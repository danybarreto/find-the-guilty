import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, useWindowDimensions } from 'react-native';
import { StoryNode, Choice } from '../../game-engine/types';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '../../../shared/theme/theme';
import { TypewriterText } from '@/shared/components/TypewriterText';

interface ComicPanelProps {
    node: StoryNode;
    onChoiceSelect: (choice: Choice) => void;
}

export const ComicPanel: React.FC<ComicPanelProps> = ({ node, onChoiceSelect }) => {
    const { height: windowHeight } = useWindowDimensions();
    const [isTextFinished, setIsTextFinished] = useState(false);

    // Reset text state when node changes
    useEffect(() => {
        setIsTextFinished(false);
    }, [node.id]);

    const handleChoice = (choice: Choice) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onChoiceSelect(choice);
    };

    const handleSkip = () => {
        setIsTextFinished(true);
    };

    if (node.type === 'ending') {
        return (
            <View style={[styles.container, styles.endingContainer]}>
                {node.image && (
                    <View style={[styles.imageContainer, { flex: 0.65 }]}>
                        <Image source={node.image} style={styles.nodeImage} resizeMode="cover" />
                    </View>
                )}
                <View style={[styles.contentArea, { flex: 0.35 }]}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <View style={[styles.panel, { borderColor: colors.error, minHeight: 'auto' }]}>
                            <TypewriterText
                                text={node.content}
                                style={styles.content}
                                onComplete={() => setIsTextFinished(true)}
                            />
                        </View>
                        {isTextFinished && <Text style={styles.gameOverText}>FIN DEL CAMINO</Text>}
                    </ScrollView>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {node.image && (
                <View style={[styles.imageContainer, { flex: 0.7 }]}>
                    <Image source={node.image} style={styles.nodeImage} resizeMode="cover" />
                </View>
            )}

            <View style={[styles.contentArea, { flex: 0.3 }]}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity activeOpacity={1} onPress={handleSkip}>
                        <View style={[styles.panel, { minHeight: 'auto', marginBottom: spacing.md }]}>
                            {isTextFinished ? (
                                <Text style={styles.content}>{node.content}</Text>
                            ) : (
                                <TypewriterText
                                    text={node.content}
                                    style={styles.content}
                                    onComplete={() => setIsTextFinished(true)}
                                    speed={30}
                                />
                            )}
                        </View>
                    </TouchableOpacity>

                    {isTextFinished && (
                        <View style={styles.choicesContainer}>
                            {node.choices?.map((choice, index) => (
                                <TouchableOpacity
                                    key={choice.id}
                                    style={[
                                        styles.choiceButton,
                                        { transform: [{ rotate: index % 2 === 0 ? '-1deg' : '1deg' }] }
                                    ]}
                                    onPress={() => handleChoice(choice)}
                                >
                                    <Text style={styles.choiceText}>{choice.text.toUpperCase()}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    endingContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    contentArea: {
        width: '100%',
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: spacing.xl,
    },
    panel: {
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: colors.border,
        padding: spacing.md,
        justifyContent: 'center',
        overflow: 'hidden'
    },
    imageContainer: {
        width: '100%',
        marginBottom: 0,
        borderBottomWidth: 4,
        borderColor: colors.primary,
    },
    nodeImage: {
        width: '100%',
        height: '100%',
    },
    content: {
        fontSize: typography.sizes.lg,
        fontFamily: typography.fontFamily,
        color: colors.primary,
        lineHeight: 28,
        fontWeight: typography.weights.bold,
    },
    choicesContainer: {
        gap: spacing.md,
        paddingBottom: 40,
    },
    choiceButton: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
    },
    choiceText: {
        color: colors.primary,
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.black,
        letterSpacing: 1,
    },
    gameOverText: {
        fontSize: 36,
        color: colors.error,
        fontWeight: typography.weights.black,
        marginTop: 30,
        textAlign: 'center',
        letterSpacing: 2
    }
});
