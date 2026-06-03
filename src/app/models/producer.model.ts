export interface Producer {
    id: string;
    name: string;
    quantity: number;
    price: number;
    productionRate: number;
    priceMultiplier: number;
    isUnlocked: boolean;
}
