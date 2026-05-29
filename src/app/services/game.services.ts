import { Injectable } from '@angular/core';
import { GameState } from '../models/game-state.model';
import { initialGameState } from '../models/initial-game-state';
import { StorageService } from './storage.services';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  gameState: GameState = { ...initialGameState };

  constructor(private storageService: StorageService) {}

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

  canBuyHarvester(): boolean {
    return this.gameState.carrots >= this.gameState.harvesterPrice;
  }

  buyHarvester(): void {
    if (!this.canBuyHarvester()) {
      return;
    }

    this.gameState.carrots -= this.gameState.harvesterPrice;
    this.gameState.autoHarvesters += 1;
    this.gameState.harvesterPrice = Math.floor(this.gameState.harvesterPrice * 1.2);

    this.storageService.save(this.gameState);
  }

  produceAutomatically(): void {
    const gain = this.gameState.autoHarvesters * this.gameState.productionRate;

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
    this.gameState.clickUpgradePrice = Math.floor(this.gameState.clickUpgradePrice * 1.5);

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
    this.gameState.productionUpgradePrice = Math.floor(this.gameState.productionUpgradePrice * 1.6);

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
