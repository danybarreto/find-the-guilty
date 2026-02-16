import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry } from './types';

export interface GameState {
    lives: number;
    inventory: string[];
    currentNodeId: string | null;
    history: string[]; // List of node IDs visited
    journal: JournalEntry[];

    // Actions
    addItem: (item: string) => void;
    removeItem: (item: string) => void;
    setCurrentNode: (nodeId: string) => void;
    decreaseLives: () => void;
    resetGame: () => void;
    addJournalEntry: (text: string) => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            lives: 3,
            inventory: [],
            currentNodeId: 'intro', // Ensure this matches startNodeId in data
            history: [],
            journal: [],

            addItem: (item) => set((state) => ({ inventory: [...state.inventory, item] })),
            removeItem: (item) => set((state) => ({
                inventory: state.inventory.filter((i) => i !== item)
            })),
            setCurrentNode: (nodeId) => set((state) => ({
                currentNodeId: nodeId,
                history: [...state.history, nodeId]
            })),
            decreaseLives: () => set((state) => ({ lives: Math.max(0, state.lives - 1) })),
            addJournalEntry: (text) => {
                const currentJournal = get().journal;
                // Avoid duplicates based on text (simple check)
                if (!currentJournal.some(e => e.text === text)) {
                    set((state) => ({
                        journal: [
                            { id: Date.now().toString(), text, timestamp: Date.now() },
                            ...state.journal
                        ]
                    }));
                }
            },
            resetGame: () => set({
                lives: 3,
                inventory: [],
                currentNodeId: 'intro', // Set to actual start node
                history: [],
                journal: []
            }),
        }),
        {
            name: 'game-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
