export interface Item {
    id: string;
    name: string;
    description: string;
    image?: string; // Placeholder for future images
}

export const itemData: Record<string, Item> = {
    'ancient_coin': {
        id: 'ancient_coin',
        name: 'Ancient Coin',
        description: 'A heavy, cold coin with strange markings. It seems to hum consistently.'
    },
    'rusty_key': {
        id: 'rusty_key',
        name: 'Rusty Key',
        description: 'An old key found in the sewer. It might open something nearby.'
    }
};
