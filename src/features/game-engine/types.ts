export type NodeType = 'narrative' | 'choice' | 'minigame' | 'ending';

export interface Choice {
    id: string;
    text: string;
    nextNodeId: string;
    requiredItemId?: string; // Optional: Item required to unlock this choice
}

export interface JournalEntry {
    id: string;
    text: string;
    timestamp: number;
}

export interface StoryNode {
    id: string;
    type: NodeType;
    content: string; // The narrative text
    image?: any; // URL or require() asset
    choices?: Choice[];
    minigameId?: string; // If type === 'minigame'
    itemReward?: string; // Item received upon entering this node
    background?: string; // Background color or image
    journalEntry?: string; // Text to add to journal when entering this node
}

export interface StoryData {
    nodes: Record<string, StoryNode>;
    startNodeId: string;
}
