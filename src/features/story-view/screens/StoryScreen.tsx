import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, Image, useWindowDimensions, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { useStoryEngine } from '../../game-engine/hooks/useStoryEngine';
import { ComicPanel } from '../components/ComicPanel';
import { HUD } from '../components/HUD';
import { useGameStore } from '../../game-engine/store';
import { useNavigation } from '@react-navigation/native';
import { CipherGame } from '../../minigames/CipherGame';
import { LockpickGame } from '../../minigames/LockpickGame';
import { TerminalHacker } from '../../minigames/TerminalHacker';

const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
});

export const StoryScreen = () => {
    const { height: windowHeight } = useWindowDimensions();
    const { currentNode, makeChoice } = useStoryEngine();
    const resetGame = useGameStore((state) => state.resetGame);
    const removeItem = useGameStore((state) => state.removeItem);
    const inventory = useGameStore((state) => state.inventory);
    const history = useGameStore((state) => state.history);
    const rollbackToNode = useGameStore((state) => state.rollbackToNode);
    const [interstitialLoaded, setInterstitialLoaded] = useState(false);

    useEffect(() => {
        const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            setInterstitialLoaded(true);
        });
        const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
            setInterstitialLoaded(false);
            interstitial.load(); // preload next ad
        });
        interstitial.load();
        return () => {
            unsubscribeLoaded();
            unsubscribeClosed();
        };
    }, []);

    const handleRevive = () => {
        removeItem('ancient_coin');
        if (history.length > 1) {
            const prevNodeId = history[history.length - 2];
            rollbackToNode(prevNodeId);
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

    const handleRestartWithAd = () => {
        if (interstitialLoaded) interstitial.show();
        resetGame();
    };

    const handleReviveWithAd = () => {
        if (interstitialLoaded) interstitial.show();
        handleRevive();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1 }}>
                <HUD />

                {currentNode.type === 'minigame' ? (
                    <View style={[styles.minigameContainer, { paddingBottom: 20 }]}>
                        {currentNode.image && (
                            <View style={[styles.imageContainer, { flex: 0.7 }]}>
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
                        ) : currentNode.minigameId === 'terminal' ? (
                            <TerminalHacker
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
                        <Button title="Restart Game" onPress={handleRestartWithAd} color="red" />
                        {currentNode.content.includes("GAME OVER") && inventory.includes('ancient_coin') && (
                            <Button
                                title="Use Ancient Coin to Retry"
                                onPress={handleReviveWithAd}
                                color="gold"
                            />
                        )}
                    </View>
                )}
            </View>

            <View style={styles.adContainer}>
                <BannerAd
                    unitId={TestIds.BANNER}
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                />
            </View>
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
        paddingTop: 0
    },
    imageContainer: {
        width: '100%',
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
    },
    adContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        width: '100%',
    }
});
