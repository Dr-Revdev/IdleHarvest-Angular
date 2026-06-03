import { GameState } from './game-state.model';
import { initialProducers } from './initial-producers';

export const initialGameState: GameState = {
  carrots: 0,
  carrotsPerClick: 1,

  clickUpgradePrice: 25,
  clickUpgradeLevel: 1,

  productionUpgradePrice: 50,
  productionUpgradeLevel: 1,
  autoProductionMultiplier: 1,

  globalProductionMultiplier: 1,
  globalProductionMultiplierPrice: 5000,
  globalProductionMultiplierLevel: 1,

  producers: structuredClone(initialProducers),
};