import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { useGameStore } from '../../game-engine/store';
import { LucideHeart, LucideBriefcase, LucideX, LucideBookOpen } from 'lucide-react-native';
import { itemData } from '../../game-engine/data/itemData';
import { colors, typography, spacing } from '../../../shared/theme/theme';

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
                <LucideBookOpen color={colors.accentSecondary} size={20} />
                <Text style={styles.text}>Registro</Text>
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
                            <LucideX color={colors.background} size={24} />
                        </Pressable>
                        <Text style={styles.modalTitle}>Registro del Detective</Text>
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
        padding: spacing.md,
        backgroundColor: colors.background,
        borderBottomWidth: 3,
        borderBottomColor: colors.border,
        zIndex: 10
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inventoryList: {
        flexDirection: 'row',
        marginLeft: 10,
        gap: 15
    },
    inventoryItem: {
        color: colors.primary,
        fontWeight: typography.weights.bold,
        textTransform: 'uppercase',
    },
    text: {
        color: colors.text,
        marginLeft: 8,
        fontWeight: typography.weights.bold,
        fontSize: typography.sizes.md
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: '85%',
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: colors.border,
        padding: spacing.lg,
        alignItems: 'center'
    },
    journalContent: {
        height: '75%',
    },
    modalTitle: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.black,
        marginBottom: spacing.md,
        fontFamily: typography.fontFamily,
        textTransform: 'uppercase',
        borderBottomWidth: 2,
        borderColor: colors.border,
        paddingBottom: 5,
        color: colors.primary,
    },
    modalDescription: {
        fontSize: typography.sizes.md,
        textAlign: 'center',
        fontFamily: typography.fontFamily,
        lineHeight: 24,
        color: colors.textMuted,
    },
    closeButton: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        zIndex: 2,
        backgroundColor: colors.primary,
        borderRadius: 20,
        padding: 4
    },
    journalList: {
        width: '100%',
        marginTop: spacing.md
    },
    journalEntry: {
        marginBottom: spacing.lg,
        borderLeftWidth: 4,
        borderLeftColor: colors.accentSecondary,
        paddingLeft: spacing.md,
        paddingBottom: 5
    },
    journalTimestamp: {
        fontSize: typography.sizes.xs,
        color: colors.textMuted,
        fontWeight: typography.weights.bold,
        marginBottom: 4
    },
    journalText: {
        fontSize: typography.sizes.md,
        color: colors.primary,
        fontFamily: typography.fontFamily,
        lineHeight: 22
    }
});
