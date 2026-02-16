import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { useGameStore } from '../../game-engine/store';
import { LucideHeart, LucideBriefcase, LucideX, LucideBookOpen } from 'lucide-react-native';
import { itemData } from '../../game-engine/data/itemData';
import { theme } from '@/shared/theme';

export const HUD = () => {
    const { lives, inventory, journal } = useGameStore();
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [isJournalOpen, setIsJournalOpen] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <LucideHeart color="red" fill="red" size={20} />
                <Text style={styles.text}> x {lives}</Text>
            </View>

            <TouchableOpacity style={styles.section} onPress={() => setIsJournalOpen(true)}>
                <LucideBookOpen color={theme.colors.gold} size={20} />
                <Text style={styles.text}>Journal</Text>
            </TouchableOpacity>

            <View style={styles.section}>
                <LucideBriefcase color="#fff" size={20} />
                <View style={styles.inventoryList}>
                    {inventory.length > 0 ? (
                        inventory.map((itemId) => (
                            <TouchableOpacity key={itemId} onPress={() => setSelectedItem(itemId)}>
                                <Text style={styles.inventoryItem}>{itemData[itemId]?.name || itemId}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.text}>Empty</Text>
                    )}
                </View>
            </View>

            {/* Inventory Modal */}
            <Modal
                transparent={true}
                visible={!!selectedItem}
                animationType="fade"
                onRequestClose={() => setSelectedItem(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Pressable style={styles.closeButton} onPress={() => setSelectedItem(null)}>
                            <LucideX color="#000" size={24} />
                        </Pressable>
                        <Text style={styles.modalTitle}>{selectedItem && (itemData[selectedItem]?.name || selectedItem)}</Text>
                        <Text style={styles.modalDescription}>{selectedItem && (itemData[selectedItem]?.description || "No description available.")}</Text>
                    </View>
                </View>
            </Modal>

            {/* Journal Modal */}
            <Modal
                transparent={true}
                visible={isJournalOpen}
                animationType="slide"
                onRequestClose={() => setIsJournalOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, styles.journalContent]}>
                        <Pressable style={styles.closeButton} onPress={() => setIsJournalOpen(false)}>
                            <LucideX color="#000" size={24} />
                        </Pressable>
                        <Text style={styles.modalTitle}>Detective's Journal</Text>
                        <ScrollView style={styles.journalList}>
                            {journal.length > 0 ? (
                                journal.map((entry) => (
                                    <View key={entry.id} style={styles.journalEntry}>
                                        <Text style={styles.journalTimestamp}>{new Date(entry.timestamp).toLocaleTimeString()}</Text>
                                        <Text style={styles.journalText}>{entry.text}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.journalText}>No entries yet.</Text>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#222',
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        zIndex: 10
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        marginLeft: 5,
        fontWeight: 'bold',
    },
    inventoryList: {
        flexDirection: 'row',
        marginLeft: 10,
        gap: 10
    },
    inventoryItem: {
        color: theme.colors.gold,
        textDecorationLine: 'underline',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        borderWidth: 4,
        borderColor: '#000',
        alignItems: 'center'
    },
    journalContent: {
        height: '70%',
        backgroundColor: theme.colors.comicBackground,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: 'serif',
        textDecorationLine: 'underline'
    },
    modalDescription: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'serif'
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1
    },
    journalList: {
        width: '100%'
    },
    journalEntry: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5
    },
    journalTimestamp: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'monospace'
    },
    journalText: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'serif'
    }
});
