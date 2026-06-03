import { Producer } from './producer.model';

export interface GameState {
  carrots: number;
  carrotsPerClick: number;

  clickUpgradePrice: number;
  clickUpgradeLevel: number;

  productionUpgradePrice: number;
  productionUpgradeLevel: number;

  globalProductionMultiplier: number;
  globalProductionMultiplierPrice: number;
  globalProductionMultiplierLevel: number;

  producers: Producer[];
}