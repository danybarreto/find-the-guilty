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
    
    // Stats for resolution screen
    startTime: number | null;
    endTime: number | null;
    goodDecisions: number;
    badDecisions: number;

    // Actions
    addItem: (item: string) => void;
    removeItem: (item: string) => void;
    setCurrentNode: (nodeId: string, isGoodDecision?: boolean) => void;
    rollbackToNode: (nodeId: string) => void;
    decreaseLives: () => void;
    resetGame: () => void;
    endGame: () => void;
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
            startTime: Date.now(),
            endTime: null,
            goodDecisions: 0,
            badDecisions: 0,

            addItem: (item) => set((state) => ({ inventory: [...state.inventory, item] })),
            removeItem: (item) => set((state) => ({
                inventory: state.inventory.filter((i) => i !== item)
            })),
            setCurrentNode: (nodeId, isGoodDecision?: boolean) => set((state) => {
                const newGood = state.goodDecisions + (isGoodDecision === true ? 1 : 0);
                const newBad = state.badDecisions + (isGoodDecision === false ? 1 : 0);
                
                return {
                    currentNodeId: nodeId,
                    history: [...state.history, nodeId],
                    goodDecisions: newGood,
                    badDecisions: newBad,
                };
            }),
            rollbackToNode: (nodeId) => set((state) => {
                const index = state.history.indexOf(nodeId);
                if (index === -1) return state; // Node not found in history
                
                // Keep history up to and including the target node
                const newHistory = state.history.slice(0, index + 1);
                
                return {
                    currentNodeId: nodeId,
                    history: newHistory,
                };
            }),
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
            endGame: () => set({ endTime: Date.now() }),
            resetGame: () => set({
                lives: 3,
                inventory: [],
                currentNodeId: 'intro', // Set to actual start node
                history: [],
                journal: [],
                startTime: Date.now(),
                endTime: null,
                goodDecisions: 0,
                badDecisions: 0,
            }),
        }),
        {
            name: 'game-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
