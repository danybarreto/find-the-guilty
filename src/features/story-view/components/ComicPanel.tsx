import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, useWindowDimensions } from 'react-native';
import { StoryNode, Choice } from '../../game-engine/types';
import * as Haptics from 'expo-haptics';
import { theme } from '@/shared/theme';
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
                        <View style={[styles.panel, { borderColor: theme.colors.error, minHeight: 'auto' }]}>
                            <TypewriterText
                                text={node.content}
                                style={styles.content}
                                onComplete={() => setIsTextFinished(true)}
                            />
                        </View>
                        {isTextFinished && <Text style={styles.gameOverText}>GAME OVER</Text>}
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
                        <View style={[styles.panel, { minHeight: 'auto', marginBottom: theme.spacing.m }]}>
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
        backgroundColor: '#1a1a1a', // Darker background for contrast
    },
    endingContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    contentArea: {
        width: '100%',
        paddingHorizontal: theme.spacing.m,
        paddingBottom: theme.spacing.m,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: theme.spacing.xl,
    },
    panel: {
        ...theme.styles.comicBox,
        backgroundColor: theme.colors.comicBackground,
        padding: theme.spacing.m,
        justifyContent: 'center',
        overflow: 'hidden' // Ensure image respects border
    },
    imageContainer: {
        width: '100%',
        marginBottom: 0,
        borderBottomWidth: 2,
        borderColor: '#fff',
    },
    nodeImage: {
        width: '100%',
        height: '100%',
    },
    content: {
        fontSize: 20,
        fontFamily: 'serif', // Keep serif for comic feel
        color: theme.colors.comicText,
        lineHeight: 28,
        fontWeight: '500',
    },
    choicesContainer: {
        gap: 15,
        paddingBottom: 40,
    },
    choiceButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderWidth: 3,
        borderColor: '#000',
        borderRadius: 255, // Jagged/Organic look approximation
        borderBottomLeftRadius: 5,
        borderTopRightRadius: 5,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    choiceText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '900', // Heavy font for actions
        fontFamily: 'sans-serif-condensed', // Or normal bold
    },
    gameOverText: {
        fontSize: 40,
        color: theme.colors.error,
        fontWeight: 'bold',
        marginTop: 30,
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
        letterSpacing: 5
    }
});
