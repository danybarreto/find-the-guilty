import React from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, Image } from 'react-native';
import { useStoryEngine } from '../../game-engine/hooks/useStoryEngine';
import { ComicPanel } from '../components/ComicPanel';
import { HUD } from '../components/HUD';
import { useGameStore } from '../../game-engine/store';
import { useNavigation } from '@react-navigation/native';
import { CipherGame } from '../../minigames/CipherGame';
import { LockpickGame } from '../../minigames/LockpickGame';


export const StoryScreen = () => {
    const { currentNode, makeChoice } = useStoryEngine();
    const resetGame = useGameStore((state) => state.resetGame);
    const removeItem = useGameStore((state) => state.removeItem);
    const inventory = useGameStore((state) => state.inventory);
    const history = useGameStore((state) => state.history);
    const setCurrentNode = useGameStore((state) => state.setCurrentNode);

    const handleRevive = () => {
        removeItem('ancient_coin');
        if (history.length > 1) {
            const prevNodeId = history[history.length - 2];
            setCurrentNode(prevNodeId);
        } else {
            resetGame();
        }
    };

    const handleMiniGameSuccess = () => {
        const successChoice = currentNode?.choices?.find(c => c.id === 'success');
        if (successChoice) makeChoice(successChoice);
    };

    const handleMiniGameFailure = () => {
        const failChoice = currentNode?.choices?.find(c => c.id === 'fail');
        if (failChoice) makeChoice(failChoice);
    };

    if (!currentNode) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <HUD />

            {currentNode.type === 'minigame' ? (
                <View style={styles.minigameContainer}>
                    {currentNode.image && (
                        <View style={styles.imageContainer}>
                            <Image source={currentNode.image} style={styles.nodeImage} resizeMode="cover" />
                        </View>
                    )}
                    <Text style={styles.text}>Minigame: {currentNode.minigameId}</Text>
                    <Text style={styles.subtext}>{currentNode.content}</Text>

                    {currentNode.minigameId === 'lockpick' ? (
                        <LockpickGame
                            onSuccess={handleMiniGameSuccess}
                            onFailure={handleMiniGameFailure}
                        />
                    ) : currentNode.minigameId === 'cipher' ? (
                        <CipherGame
                            onSuccess={handleMiniGameSuccess}
                            onFailure={handleMiniGameFailure}
                        />
                    ) : (
                        <View style={styles.minigameChoices}>
                            {currentNode.choices?.map(choice => (
                                <Button key={choice.id} title={choice.text} onPress={() => makeChoice(choice)} />
                            ))}
                        </View>
                    )}
                </View>
            ) : (
                <ComicPanel node={currentNode} onChoiceSelect={makeChoice} />
            )}

            {currentNode.type === 'ending' && (
                <View style={styles.endingButtons}>
                    <Button title="Restart Game" onPress={resetGame} color="red" />
                    {currentNode.content.includes("GAME OVER") && inventory.includes('ancient_coin') && (
                        <Button
                            title="Use Ancient Coin to Retry"
                            onPress={handleRevive}
                            color="gold"
                        />
                    )}
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    text: {
        color: '#fff',
        fontSize: 24,
        textAlign: 'center',
        marginTop: 10,
    },
    subtext: {
        color: '#ccc',
        fontSize: 16,
        textAlign: 'center',
        padding: 20
    },
    minigameContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 20
    },
    imageContainer: {
        width: '90%',
        height: 200,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#fff',
    },
    nodeImage: {
        width: '100%',
        height: '100%',
    },
    minigameChoices: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    },
    endingButtons: {
        gap: 10,
        marginTop: 20,
        paddingHorizontal: 20
    }
});
