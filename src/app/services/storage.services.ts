import { Injectable } from "@angular/core";
import { GameState } from "../models/game-state.model";

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    save(gameState: GameState): void {
        localStorage.setItem('carrots', gameState.carrots.toString());
        localStorage.setItem('autoFarmers', gameState.autoFarmers.toString());
        localStorage.setItem('farmerPrice', gameState.farmerPrice.toString());
        localStorage.setItem('carrotsPerClick', gameState.carrotsPerClick.toString());
        localStorage.setItem('clickUpgradePrice', gameState.clickUpgradePrice.toString());
        localStorage.setItem('productionUpgradePrice', gameState.productionUpgradePrice.toString());
        localStorage.setItem('productionRate', gameState.productionRate.toString());
        localStorage.setItem('clickUpgradeLevel', gameState.clickUpgradeLevel.toString());
        localStorage.setItem('productionUpgradeLevel', gameState.productionUpgradeLevel.toString());
        localStorage.setItem('globalProductionMultiplier',gameState.globalProductionMultiplier.toString());
        localStorage.setItem('globalProductionMultiplierPrice',gameState.globalProductionMultiplierPrice.toString());
        localStorage.setItem('globalProductionMultiplierLevel', gameState.globalProductionMultiplierLevel.toString());
        localStorage.setItem('tractors', gameState.tractors.toString());
        localStorage.setItem('tractorPrice', gameState.tractorPrice.toString());
        localStorage.setItem('tractorProductionRate', gameState.tractorProductionRate.toString());
    }

    load(): GameState {
        return {
            carrots: parseInt(localStorage.getItem('carrots') || '0'),
            autoFarmers: parseInt(localStorage.getItem('autoFarmers') || '0'),
            farmerPrice: parseInt(localStorage.getItem('farmerPrice') || '10'),
            productionRate: parseInt(localStorage.getItem('productionRate') || '1'),
            carrotsPerClick: parseInt(localStorage.getItem('carrotsPerClick') || '1'),
            clickUpgradePrice: parseInt(localStorage.getItem('clickUpgradePrice') || '25'),
            productionUpgradePrice: parseInt(localStorage.getItem('productionUpgradePrice') || '50'),
            clickUpgradeLevel: parseInt(localStorage.getItem('clickUpgradeLevel') || '1'),
            productionUpgradeLevel: parseInt(localStorage.getItem('productionUpgradeLevel') || '1'),
            globalProductionMultiplier: parseInt(localStorage.getItem('globalProductionMultiplier') || '1'),
            globalProductionMultiplierPrice: parseInt(localStorage.getItem('globalProductionMultiplierPrice') || '5000'),
            globalProductionMultiplierLevel: parseInt(localStorage.getItem('globalProductionMultiplierLevel') || '1'),
            tractors: parseInt(localStorage.getItem('tractors') || '0'),
            tractorPrice: parseInt(localStorage.getItem('tractorPrice') || '10000'),
            tractorProductionRate: parseInt(localStorage.getItem('tractorProductionRate') || '100'),
            
        };
    }
}