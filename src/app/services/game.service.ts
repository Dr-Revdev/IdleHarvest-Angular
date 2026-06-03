import { Injectable, signal, computed } from '@angular/core';
import { GameState } from '../models/game-state.model';
import { initialGameState } from '../models/initial-game-state';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  readonly state = signal<GameState>(structuredClone(initialGameState));

  /** Production totale par seconde, multiplicateur global inclus. */
  readonly totalProduction = computed(() => this.production(this.state()));

  private intervalId?: ReturnType<typeof setInterval>;
  private saveTimer?: ReturnType<typeof setTimeout>;
  private lastTick = Date.now();

  constructor(private storage: StorageService) {}

  /** Démarre la boucle de production. Sans effet si une boucle est déjà active. */
  startGameLoop(): void {
    if (this.intervalId !== undefined) {
      return;
    }
    this.lastTick = Date.now();
    this.intervalId = setInterval(() => this.tick(), 1000);
    // Sauvegarde de sécurité à la fermeture de l'onglet.
    window.addEventListener('beforeunload', () => this.storage.save(this.state()));
  }

  /** Arrête la boucle et libère l'intervalle. */
  stopGameLoop(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  /** Incrémente les carottes au prorata du temps réel écoulé depuis le dernier tick. */
  private tick(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastTick) / 1000;
    this.lastTick = now;
    this.commit((s) => {
      s.carrots += this.production(s) * elapsedSeconds;
      this.unlock(s);
    });
  }

  /** Restaure la partie et crédite la production accumulée hors ligne. */
  loadGame(): void {
    const { state, lastSaved } = this.storage.load();
    this.state.set(state);

    const offlineSeconds = (Date.now() - lastSaved) / 1000;
    if (offlineSeconds > 0) {
      this.commit((s) => {
        s.carrots += this.production(s) * offlineSeconds;
        this.unlock(s);
      });
    }
    this.lastTick = Date.now();
  }

  harvestCarrot(): void {
    this.commit((s) => {
      s.carrots += s.carrotsPerClick;
      this.unlock(s);
    });
  }

  canBuyProducer(id: string): boolean {
    const producer = this.state().producers.find((p) => p.id === id);
    return !!producer && this.state().carrots >= producer.price;
  }

  buyProducer(id: string): void {
    if (!this.canBuyProducer(id)) {
      return;
    }
    this.commit((s) => {
      const producer = s.producers.find((p) => p.id === id)!;
      s.carrots -= producer.price;
      producer.quantity += 1;
      producer.price = Math.floor(producer.price * producer.priceMultiplier);
    });
  }

  canBuyClickUpgrade(): boolean {
    return this.state().carrots >= this.state().clickUpgradePrice;
  }

  buyClickUpgrade(): void {
    if (!this.canBuyClickUpgrade()) {
      return;
    }
    this.commit((s) => {
      s.carrots -= s.clickUpgradePrice;
      s.carrotsPerClick += 1;
      s.clickUpgradeLevel += 1;
      s.clickUpgradePrice = Math.floor(s.clickUpgradePrice * 1.4);
    });
  }

  canBuyProductionUpgrade(): boolean {
    return this.state().carrots >= this.state().productionUpgradePrice;
  }

  buyProductionUpgrade(): void {
    if (!this.canBuyProductionUpgrade()) {
      return;
    }

    this.commit((s) => {
      s.carrots -= s.productionUpgradePrice;
      s.autoProductionMultiplier *= 1.25;
      s.productionUpgradeLevel += 1;
      s.productionUpgradePrice = Math.floor(s.productionUpgradePrice * 2.2);
    });
  }

  canBuyGlobalProductionMultiplier(): boolean {
    return this.state().carrots >= this.state().globalProductionMultiplierPrice;
  }

  buyGlobalProductionMultiplier(): void {
    if (!this.canBuyGlobalProductionMultiplier()) {
      return;
    }
    this.commit((s) => {
      s.carrots -= s.globalProductionMultiplierPrice;
      // Multiplicateur global doublé à chaque achat.
      s.globalProductionMultiplier *= 2;
      s.globalProductionMultiplierLevel += 1;
      s.globalProductionMultiplierPrice = Math.floor(s.globalProductionMultiplierPrice * 25);
    });
  }

  resetGame(): void {
    if (!confirm('Voulez-vous vraiment réinitialiser votre partie ?')) {
      return;
    }
    this.state.set(structuredClone(initialGameState));
    this.lastTick = Date.now();
    this.storage.save(this.state());
  }

  /** Calcule la production totale par seconde pour un état donné. */
  private production(s: GameState): number {
    const base = s.producers.reduce(
      (total, p) => total + p.quantity * p.productionRate,
      0
    );
    return base * s.autoProductionMultiplier * s.globalProductionMultiplier;
  }

  /** Débloque les producteurs déjà possédés ou financièrement atteignables. */
  private unlock(s: GameState): void {
    for (const p of s.producers) {
      if (!p.isUnlocked && (p.quantity > 0 || s.carrots >= p.price * 0.1)) {
        p.isUnlocked = true;
      }
    }
  }

  /**
   * Applique une mutation à l'état, renouvelle la référence pour déclencher
   * la détection de changement, puis planifie une sauvegarde.
   */
  private commit(mutate: (s: GameState) => void): void {
    this.state.update((s) => {
      mutate(s);
      return { ...s };
    });
    this.scheduleSave();
  }

  /** Limite les écritures à une sauvegarde toutes les cinq secondes. */
  private scheduleSave(): void {
    if (this.saveTimer !== undefined) {
      return;
    }
    this.saveTimer = setTimeout(() => {
      this.storage.save(this.state());
      this.saveTimer = undefined;
    }, 5000);
  }
}