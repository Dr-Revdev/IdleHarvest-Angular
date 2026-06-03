import { Producer } from './producer.model';

export interface GameState {
    carrots: number;
    autoFarmers: number;
    farmerPrice: number;
    productionRate: number;
    carrotsPerClick: number;
    clickUpgradePrice: number;
    productionUpgradePrice: number;
    clickUpgradeLevel: number;
    productionUpgradeLevel: number;
    globalProductionMultiplier: number;
    globalProductionMultiplierPrice: number;
    globalProductionMultiplierLevel: number;
    tractors: number;
    tractorPrice: number;
    tractorProductionRate: number;
    producers: Producer[];
}