import { Injectable } from '@angular/core';
import { GameState } from '../models/game-state.model';
import { initialGameState } from '../models/initial-game-state';
import { initialProducers } from '../models/initial-producers';
import { Producer } from '../models/producer.model';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    save(gameState: GameState): void {
        localStorage.setItem('carrots', gameState.carrots.toString());
        localStorage.setItem('carrotsPerClick', gameState.carrotsPerClick.toString());

        localStorage.setItem('clickUpgradePrice', gameState.clickUpgradePrice.toString());
        localStorage.setItem('clickUpgradeLevel', gameState.clickUpgradeLevel.toString());

        localStorage.setItem(
            'productionUpgradePrice',
            gameState.productionUpgradePrice.toString()
        );
        localStorage.setItem(
            'productionUpgradeLevel',
            gameState.productionUpgradeLevel.toString()
        );

        localStorage.setItem(
            'globalProductionMultiplier',
            gameState.globalProductionMultiplier.toString()
        );
        localStorage.setItem(
            'globalProductionMultiplierPrice',
            gameState.globalProductionMultiplierPrice.toString()
        );
        localStorage.setItem(
            'globalProductionMultiplierLevel',
            gameState.globalProductionMultiplierLevel.toString()
        );

        localStorage.setItem('producers', JSON.stringify(gameState.producers));
    }

    load(): GameState {
        return {
            carrots: this.getNumber('carrots', initialGameState.carrots),
            carrotsPerClick: this.getNumber(
                'carrotsPerClick',
                initialGameState.carrotsPerClick
            ),

            clickUpgradePrice: this.getNumber(
                'clickUpgradePrice',
                initialGameState.clickUpgradePrice
            ),
            clickUpgradeLevel: this.getNumber(
                'clickUpgradeLevel',
                initialGameState.clickUpgradeLevel
            ),

            productionUpgradePrice: this.getNumber(
                'productionUpgradePrice',
                initialGameState.productionUpgradePrice
            ),
            productionUpgradeLevel: this.getNumber(
                'productionUpgradeLevel',
                initialGameState.productionUpgradeLevel
            ),

            globalProductionMultiplier: this.getNumber(
                'globalProductionMultiplier',
                initialGameState.globalProductionMultiplier
            ),
            globalProductionMultiplierPrice: this.getNumber(
                'globalProductionMultiplierPrice',
                initialGameState.globalProductionMultiplierPrice
            ),
            globalProductionMultiplierLevel: this.getNumber(
                'globalProductionMultiplierLevel',
                initialGameState.globalProductionMultiplierLevel
            ),

            producers: this.loadProducers(),
        };
    }

    private getNumber(key: string, defaultValue: number): number {
        return Number(localStorage.getItem(key) ?? defaultValue);
    }

    private loadProducers(): Producer[] {
        const savedProducers = localStorage.getItem('producers');

        if (savedProducers) {
            try {
                return this.mergeProducers(JSON.parse(savedProducers));
            } catch {
                return structuredClone(initialProducers);
            }
        }

        return this.loadLegacyProducers();
    }

    private loadLegacyProducers(): Producer[] {
        const producers = structuredClone(initialProducers);

        const farmers = producers.find((producer) => producer.id === 'farmers');
        const tractors = producers.find((producer) => producer.id === 'tractors');

        if (farmers) {
            farmers.quantity = this.getNumber('autoFarmers', farmers.quantity);
            farmers.price = this.getNumber('farmerPrice', farmers.price);
            farmers.productionRate = this.getNumber('productionRate', farmers.productionRate);
        }

        if (tractors) {
            tractors.quantity = this.getNumber('tractors', tractors.quantity);
            tractors.price = this.getNumber('tractorPrice', tractors.price);
            tractors.productionRate = this.getNumber(
                'tractorProductionRate',
                tractors.productionRate
            );
        }

        return producers;
    }

    private mergeProducers(savedProducers: Producer[]): Producer[] {
        return initialProducers.map((initialProducer) => {
            const savedProducer = savedProducers.find(
                (producer) => producer.id === initialProducer.id
            );

            return savedProducer
                ? { ...initialProducer, ...savedProducer }
                : structuredClone(initialProducer);
        });
    }
}