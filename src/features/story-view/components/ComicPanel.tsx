import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { StoryNode, Choice } from '../../game-engine/types';
import * as Haptics from 'expo-haptics';
import { theme } from '@/shared/theme';
import { TypewriterText } from '@/shared/components/TypewriterText';

interface ComicPanelProps {
    node: StoryNode;
    onChoiceSelect: (choice: Choice) => void;
}

export const ComicPanel: React.FC<ComicPanelProps> = ({ node, onChoiceSelect }) => {
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
                    <View style={styles.imageContainer}>
                        <Image source={node.image} style={styles.nodeImage} resizeMode="cover" />
                    </View>
                )}
                <View style={[styles.panel, { borderColor: theme.colors.error }]}>
                    <TypewriterText
                        text={node.content}
                        style={styles.content}
                        onComplete={() => setIsTextFinished(true)}
                    />
                </View>
                {isTextFinished && <Text style={styles.gameOverText}>GAME OVER</Text>}
            </View>
        )
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity activeOpacity={1} onPress={handleSkip}>
                <View style={styles.panel}>
                    {node.image && (
                        <View style={styles.imageContainer}>
                            <Image source={node.image} style={styles.nodeImage} resizeMode="cover" />
                        </View>
                    )}
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
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: theme.spacing.m,
        backgroundColor: '#1a1a1a', // Darker background for contrast
    },
    endingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    panel: {
        ...theme.styles.comicBox,
        backgroundColor: theme.colors.comicBackground,
        padding: theme.spacing.l,
        marginBottom: theme.spacing.xl,
        minHeight: 200,
        justifyContent: 'center',
        overflow: 'hidden' // Ensure image respects border
    },
    imageContainer: {
        width: '100%',
        height: 200,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#000',
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
