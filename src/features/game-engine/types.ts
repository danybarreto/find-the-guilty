export type NodeType = 'narrative' | 'choice' | 'minigame' | 'ending';

export interface Choice {
    id: string;
    text: string;
    nextNodeId: string;
    requiredItemId?: string; // Optional: Item required to unlock this choice
    isGoodDecision?: boolean; // For tracking stats
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
    act?: 1 | 2 | 3; // The act this node belongs to
    image?: any; // URL or require() asset
    choices?: Choice[];
    minigameId?: string; // If type === 'minigame'
    itemReward?: string; // Item received upon entering this node
    background?: string; // Background color or image
    journalEntry?: string; // Text to add to journal when entering this node
    isGoodDecision?: boolean; // For tracking justice score
}

export interface StoryData {
    nodes: Record<string, StoryNode>;
    startNodeId: string;
}
