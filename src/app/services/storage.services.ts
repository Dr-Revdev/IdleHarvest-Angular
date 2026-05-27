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
    }

    load(): GameState {
        return {
            carrots: parseInt(localStorage.getItem('carrots') || '0'),
            autoHarvesters: parseInt(localStorage.getItem('autoHarvesters') || '0'),
            harvesterPrice: parseInt(localStorage.getItem('harvesterPrice') || '10'),
            productionRate: 1,
        };
    }
}