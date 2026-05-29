import { Injectable } from '@angular/core';
import { GameState } from '../models/game-state.model';
import { initialGameState } from '../models/initial-game-state';
import { StorageService } from './storage.services';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  gameState: GameState = { ...initialGameState };

  constructor(
    private storageService: StorageService,
  ) {}

  get totalProduction(): number {
    const farmerProduction =
      this.gameState.autoFarmers * this.gameState.productionRate;

    const tractorProduction =
      this.gameState.tractors * this.gameState.tractorProductionRate;

    return (
      farmerProduction + tractorProduction
    ) * this.gameState.globalProductionMultiplier;
  }

  startAutoProduction(onTick: () => void): void {
    setInterval(() => {
      this.produceAutomatically();
      onTick();
    }, 1000);
  }

  harvestCarrot(): void {
    this.gameState.carrots += this.gameState.carrotsPerClick;
    this.storageService.save(this.gameState);
  }

  loadGame(): void {
    this.gameState = this.storageService.load();
  }

  canBuyFarmer(): boolean {
    return this.gameState.carrots >= this.gameState.farmerPrice;
  }

  buyFarmer(): void {
    if (!this.canBuyFarmer()) {
      return;
    }

    this.gameState.carrots -= this.gameState.farmerPrice;
    this.gameState.autoFarmers += 1;
    this.gameState.farmerPrice = Math.floor(this.gameState.farmerPrice * 1.2);

    this.storageService.save(this.gameState);
  }

  produceAutomatically(): void {
    const gain = this.totalProduction;

    if (gain <= 0) {
      return;
    }

    this.gameState.carrots += gain;
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
    this.gameState.clickUpgradePrice = Math.floor(this.gameState.clickUpgradePrice * 1.4);

    this.storageService.save(this.gameState);
  }

  canBuyProductionUpgrade(): boolean {
    return this.gameState.carrots >= this.gameState.productionUpgradePrice;
  }

  buyProductionUpgrade(): void {
    if (!this.canBuyProductionUpgrade()) {
      return;
    }

    this.gameState.carrots -= this.gameState.productionUpgradePrice;
    this.gameState.productionRate += 1;
    this.gameState.productionUpgradeLevel += 1;
    this.gameState.productionUpgradePrice = Math.floor(this.gameState.productionUpgradePrice * 1.6);

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
    this.gameState.globalProductionMultiplierPrice = Math.floor(this.gameState.globalProductionMultiplierPrice * 3);

    this.storageService.save(this.gameState);
  }

  canBuyTractor(): boolean {
    return this.gameState.carrots >= this.gameState.tractorPrice;
  }

  buyTractor(): void {
    if (!this.canBuyTractor()) {
      return;
    }

    this.gameState.carrots -= this.gameState.tractorPrice;
    this.gameState.tractors += 1;
    this.gameState.tractorPrice = Math.floor(this.gameState.tractorPrice * 1.25);

    this.storageService.save(this.gameState);
  }

  resetGame(): void {
    const confirmation = confirm('Voulez-vous vraiment réinitialiser votre partie ?');

    if (!confirmation) {
      return;
    }

    this.gameState = { ...initialGameState };
    this.storageService.save(this.gameState);
  }
}
