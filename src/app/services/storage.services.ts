import { Injectable } from "@angular/core";
import { GameState } from "../models/game-state.model";

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    save(gameState: GameState): void {
        localStorage.setItem('carrots', gameState.carrots.toString());
        localStorage.setItem('autoHarvesters', gameState.autoHarvesters.toString());
        localStorage.setItem('harvesterPrice', gameState.harvesterPrice.toString());
        localStorage.setItem('carrotsPerClick', gameState.carrotsPerClick.toString());
        localStorage.setItem('clickUpgradePrice', gameState.clickUpgradePrice.toString());
        localStorage.setItem('productionUpgradePrice', gameState.productionUpgradePrice.toString());
        localStorage.setItem('productionRate', gameState.productionRate.toString());
    }

    load(): GameState {
        return {
            carrots: parseInt(localStorage.getItem('carrots') || '0'),
            autoHarvesters: parseInt(localStorage.getItem('autoHarvesters') || '0'),
            harvesterPrice: parseInt(localStorage.getItem('harvesterPrice') || '10'),
            productionRate: parseInt(localStorage.getItem('productionRate') || '1'),
            carrotsPerClick: parseInt(localStorage.getItem('carrotsPerClick') || '1'),
            clickUpgradePrice: parseInt(localStorage.getItem('clickUpgradePrice') || '25'),
            productionUpgradePrice: parseInt(localStorage.getItem('productionUpgradePrice') || '50'),
        };
    }
}