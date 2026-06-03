import { Producer } from './producer.model';

export const initialProducers: Producer[] = [
  {
    id: 'farmers',
    name: 'Fermier',
    quantity: 0,
    price: 15,
    productionRate: 1,
    priceMultiplier: 1.15,
    isUnlocked: true,
  },
  {
    id: 'tractors',
    name: 'Tracteur',
    quantity: 0,
    price: 225,
    productionRate: 10,
    priceMultiplier: 1.15,
    isUnlocked: false,
  },
  {
    id: 'harvesters',
    name: 'Moissonneuse',
    quantity: 0,
    price: 3375,
    productionRate: 100,
    priceMultiplier: 1.15,
    isUnlocked: false,
  }
];