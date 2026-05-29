import { GameState } from './game-state.model';

export const initialGameState: GameState = {
  carrots: 0,
  autoFarmers: 0,
  farmerPrice: 10,
  productionRate: 1,
  carrotsPerClick: 1,
  clickUpgradePrice: 25,
  productionUpgradePrice: 50,
  clickUpgradeLevel: 1,
  productionUpgradeLevel: 1,
  globalProductionMultiplier: 1,
  globalProductionMultiplierPrice: 5000,
  globalProductionMultiplierLevel: 1,
  tractors: 0,
  tractorPrice: 100000,
  tractorProductionRate: 1500,
};