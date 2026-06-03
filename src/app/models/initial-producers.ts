import { Producer } from './producer.model';

export const initialProducers: Producer[] = [
  {
    id: 'farmers',
    name: 'Fermier',
    quantity: 0,
    price: 10,
    productionRate: 1,
    priceMultiplier: 1.2,
  },
  {
    id: 'tractors',
    name: 'Tracteur',
    quantity: 0,
    price: 100000,
    productionRate: 1500,
    priceMultiplier: 1.35,
  },
];