import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, Image, useWindowDimensions, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { useStoryEngine } from '../../game-engine/hooks/useStoryEngine';
import { ComicPanel } from '../components/ComicPanel';
import { HUD } from '../components/HUD';
import { useGameStore } from '../../game-engine/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { CipherGame } from '../../minigames/CipherGame';
import { LockpickGame } from '../../minigames/LockpickGame';
import { TerminalHacker } from '../../minigames/TerminalHacker';
import { colors, typography, spacing } from '../../../shared/theme/theme';

type StoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Story'>;

const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
});

export const StoryScreen = () => {
    const { height: windowHeight } = useWindowDimensions();
    const navigation = useNavigation<StoryScreenNavigationProp>();
    const { currentNode, makeChoice } = useStoryEngine();
    const resetGame = useGameStore((state) => state.resetGame);
    const removeItem = useGameStore((state) => state.removeItem);
    const inventory = useGameStore((state) => state.inventory);
    const history = useGameStore((state) => state.history);
    const rollbackToNode = useGameStore((state) => state.rollbackToNode);
    const endGame = useGameStore((state) => state.endGame);
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

    const handleSeeResolution = () => {
        endGame();
        navigation.navigate('Resolution');
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
                        <Button title="Ver Resolución del Caso" onPress={handleSeeResolution} color={colors.accent} />
                        {currentNode.content.includes("GAME OVER") && inventory.includes('ancient_coin') && (
                            <Button
                                title="Usar Moneda Antigua para Revivir"
                                onPress={handleReviveWithAd}
                                color={colors.accentSecondary}
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
        backgroundColor: colors.background,
    },
    text: {
        color: colors.primary,
        fontFamily: typography.fontFamily,
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        textAlign: 'center',
        marginTop: spacing.md,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    subtext: {
        color: colors.textMuted,
        fontFamily: typography.fontFamily,
        fontSize: typography.sizes.md,
        textAlign: 'center',
        padding: spacing.lg,
        lineHeight: 24,
    },
    minigameContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 0,
        backgroundColor: colors.surface,
    },
    imageContainer: {
        width: '100%',
        marginBottom: spacing.md,
        borderWidth: 4,
        borderColor: colors.border,
    },
    nodeImage: {
        width: '100%',
        height: '100%',
    },
    minigameChoices: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: spacing.lg,
        width: '100%',
        paddingHorizontal: spacing.lg,
    },
    endingButtons: {
        gap: spacing.md,
        marginTop: spacing.lg,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.surface,
        paddingVertical: spacing.xl,
        borderTopWidth: 2,
        borderColor: colors.accent,
    },
    adContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
        width: '100%',
        borderTopWidth: 1,
        borderColor: colors.border,
    }
});
