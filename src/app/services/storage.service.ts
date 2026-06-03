import { Injectable } from '@angular/core';
import { GameState } from '../models/game-state.model';
import { initialGameState } from '../models/initial-game-state';

const SAVE_KEY = 'idleharvest:save';
const SAVE_VERSION = 1;

interface SaveData {
  version: number;
  lastSaved: number;
  state: GameState;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  save(state: GameState): void {
    const data: SaveData = {
      version: SAVE_VERSION,
      lastSaved: Date.now(),
      state,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }

  load(): { state: GameState; lastSaved: number } {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return { state: structuredClone(initialGameState), lastSaved: Date.now() };
    }
    try {
      const data = JSON.parse(raw) as SaveData;
      // Le champ version sert de point d'entrée aux migrations de format.
      return { state: this.merge(data.state), lastSaved: data.lastSaved };
    } catch {
      return { state: structuredClone(initialGameState), lastSaved: Date.now() };
    }
  }

  /**
   * Fusionne la sauvegarde avec l'état initial afin de récupérer les champs
   * et les producteurs ajoutés depuis la dernière partie.
   */
  private merge(saved: GameState): GameState {
    return {
      ...structuredClone(initialGameState),
      ...saved,
      producers: initialGameState.producers.map((init) => {
        const match = saved.producers?.find((p) => p.id === init.id);
        return match ? { ...init, ...match } : structuredClone(init);
      }),
    };
  }
}