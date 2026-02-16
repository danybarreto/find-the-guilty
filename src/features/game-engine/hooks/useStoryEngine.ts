import { useEffect } from 'react';
import { useGameStore } from '../store';
import { storyData } from '../data/storyData';
import { StoryNode, Choice } from '../types';

export const useStoryEngine = () => {
    const { currentNodeId, history, inventory, setCurrentNode, addItem, addJournalEntry } = useGameStore();

    const currentNode: StoryNode | undefined = (currentNodeId ? storyData.nodes[currentNodeId] : undefined) || storyData.nodes[storyData.startNodeId];

    // Effect to add journal entry when visiting a node
    // We need to be careful not to add it infinitely, but the store action checks for duplicates.
    // However, it's better to do it when setting the node.

    // Actually, let's do it in makeChoice (side effect of moving) or useEffect
    // useEffect is safer for "on enter" logic
    useEffect(() => {
        if (currentNode?.journalEntry) {
            addJournalEntry(currentNode.journalEntry);
        }
    }, [currentNode?.id]);

    const makeChoice = (choice: Choice) => {
        // Check requirements (e.g. if choice needs item)
        if (choice.requiredItemId && !inventory.includes(choice.requiredItemId)) {
            console.warn('Missing required item:', choice.requiredItemId);
            return;
            // In real UI, button should be disabled or show lock icon
        }

        const nextNodeId = choice.nextNodeId;
        const nextNode = storyData.nodes[nextNodeId];

        // Handle rewards
        if (nextNode?.itemReward) {
            addItem(nextNode.itemReward);
        }

        setCurrentNode(nextNodeId);
    };

    return {
        currentNode,
        makeChoice,
        inventory,
        history
    };
};
