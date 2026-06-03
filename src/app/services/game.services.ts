import { Injectable } from '@angular/core';
import { GameState } from '../models/game-state.model';
import { initialGameState } from '../models/initial-game-state';
import { Producer } from '../models/producer.model';
import { StorageService } from './storage.services';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  gameState: GameState = structuredClone(initialGameState);

  constructor(private storageService: StorageService) { }

  get totalProduction(): number {
    const producersProduction = this.gameState.producers.reduce(
      (total, producer) => total + producer.quantity * producer.productionRate,
      0
    );

    return producersProduction * this.gameState.globalProductionMultiplier;
  }

  startAutoProduction(onTick: () => void): void {
    setInterval(() => {
      this.produceAutomatically();
      onTick();
    }, 1000);
  }

  harvestCarrot(): void {
    this.gameState.carrots += this.gameState.carrotsPerClick;
    this.updateUnlockedProducers();
    this.storageService.save(this.gameState);
  }

  loadGame(): void {
    this.gameState = this.storageService.load();
    this.updateUnlockedProducers();
  }

  getProducer(id: string): Producer {
    const producer = this.gameState.producers.find(
      (currentProducer) => currentProducer.id === id
    );

    if (!producer) {
      throw new Error(`Producteur introuvable : ${id}`);
    }

    return producer;
  }

  isProducerVisible(producer: Producer): boolean {
    return producer.isUnlocked;
  }

  canBuyProducer(id: string): boolean {
    return this.gameState.carrots >= this.getProducer(id).price;
  }

  buyProducer(id: string): void {
    const producer = this.getProducer(id);

    if (!this.canBuyProducer(id)) {
      return;
    }

    this.gameState.carrots -= producer.price;
    producer.quantity += 1;
    producer.price = Math.floor(producer.price * producer.priceMultiplier);

    this.storageService.save(this.gameState);
  }

  produceAutomatically(): void {
    const gain = this.totalProduction;

    if (gain <= 0) {
      return;
    }

    this.gameState.carrots += gain;
    this.updateUnlockedProducers();
    this.storageService.save(this.gameState);
  }

  canBuyClickUpgrade(): boolean {
    return this.gameState.carrots >= this.gameState.clickUpgradePrice;
  }

  buyClickUpgrade(): void {
    if (!this.canBuyClickUpgrade()) {
      return;
    }

    this.gameState.carrots -= this.gameState.clickUpgradePrice;
    this.gameState.carrotsPerClick += 1;
    this.gameState.clickUpgradeLevel += 1;
    this.gameState.clickUpgradePrice = Math.floor(
      this.gameState.clickUpgradePrice * 1.4
    );

    this.storageService.save(this.gameState);
  }

  canBuyProductionUpgrade(): boolean {
    return this.gameState.carrots >= this.gameState.productionUpgradePrice;
  }

  buyProductionUpgrade(): void {
    if (!this.canBuyProductionUpgrade()) {
      return;
    }

    const farmers = this.getProducer('farmers');

    this.gameState.carrots -= this.gameState.productionUpgradePrice;
    farmers.productionRate += 1;
    this.gameState.productionUpgradeLevel += 1;
    this.gameState.productionUpgradePrice = Math.floor(
      this.gameState.productionUpgradePrice * 1.6
    );

    this.storageService.save(this.gameState);
  }

  canBuyGlobalProductionMultiplier(): boolean {
    return this.gameState.carrots >= this.gameState.globalProductionMultiplierPrice;
  }

  buyGlobalProductionMultiplier(): void {
    if (!this.canBuyGlobalProductionMultiplier()) {
      return;
    }

    this.gameState.carrots -= this.gameState.globalProductionMultiplierPrice;
    this.gameState.globalProductionMultiplier += 1;
    this.gameState.globalProductionMultiplierLevel += 1;
    this.gameState.globalProductionMultiplierPrice = Math.floor(
      this.gameState.globalProductionMultiplierPrice * 3
    );

    this.storageService.save(this.gameState);
  }

  resetGame(): void {
    const confirmation = confirm('Voulez-vous vraiment réinitialiser votre partie ?');

    if (!confirmation) {
      return;
    }

    this.gameState = structuredClone(initialGameState);
    this.storageService.save(this.gameState);
  }

  private updateUnlockedProducers(): void {
    for (const producer of this.gameState.producers) {
      if (
        !producer.isUnlocked &&
        (
          producer.quantity > 0 ||
          this.gameState.carrots >= producer.price * 0.1
        )
      ) {
        producer.isUnlocked = true;
      }
    }
  }
}