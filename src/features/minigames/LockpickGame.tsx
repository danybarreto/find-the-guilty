import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { MiniGameProps } from './types';
import * as Haptics from 'expo-haptics';
import { theme } from '@/shared/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BAR_WIDTH = SCREEN_WIDTH * 0.8;
const TARGET_WIDTH = 60;

export const LockpickGame: React.FC<MiniGameProps> = ({ onSuccess, onFailure }) => {
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const positionAnim = useRef(new Animated.Value(0)).current;

    // Random target position (between 0 and BAR_WIDTH - TARGET_WIDTH)
    const targetPosition = useRef(Math.random() * (BAR_WIDTH - TARGET_WIDTH)).current;

    useEffect(() => {
        startAnimation();
        return () => stopAnimation();
    }, []);

    const startAnimation = () => {
        const duration = 1000; // Speed of the bar

        Animated.loop(
            Animated.sequence([
                Animated.timing(positionAnim, {
                    toValue: BAR_WIDTH - 20, // cursor width
                    duration: duration,
                    useNativeDriver: true,
                }),
                Animated.timing(positionAnim, {
                    toValue: 0,
                    duration: duration,
                    useNativeDriver: true,
                })
            ])
        ).start();
    };

    const stopAnimation = () => {
        positionAnim.stopAnimation();
    };

    const handleTap = () => {
        if (gameState !== 'playing') return;

        stopAnimation();

        // Get current value
        // @ts-ignore: _value is internal but accessible for synchronous read
        const currentPos = positionAnim.__getValue();

        // Check collision
        if (currentPos >= targetPosition && currentPos <= targetPosition + TARGET_WIDTH) {
            setGameState('won');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setTimeout(onSuccess, 1000);
        } else {
            setGameState('lost');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setTimeout(onFailure, 1000);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>TAP TO UNLOCK!</Text>

            <View style={styles.gameArea}>
                {/* Track */}
                <View style={styles.track}>
                    {/* Target Zone */}
                    <View style={[styles.target, { left: targetPosition }]} />

                    {/* Cursor */}
                    <Animated.View
                        style={[
                            styles.cursor,
                            { transform: [{ translateX: positionAnim }] }
                        ]}
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleTap} disabled={gameState !== 'playing'}>
                <Text style={styles.buttonText}>
                    {gameState === 'playing' ? 'UNLOCK' : gameState === 'won' ? 'SUCCESS!' : 'FAILED'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: theme.spacing.m,
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: theme.colors.border,
        margin: 20
    },
    title: {
        color: theme.colors.text,
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold'
    },
    gameArea: {
        width: BAR_WIDTH,
        height: 50,
        justifyContent: 'center',
        marginBottom: 20
    },
    track: {
        height: 30,
        backgroundColor: theme.colors.border,
        borderRadius: 15,
        overflow: 'hidden',
        position: 'relative'
    },
    target: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: TARGET_WIDTH,
        backgroundColor: 'rgba(0, 255, 0, 0.5)',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#0f0'
    },
    cursor: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 20, // Cursor width
        backgroundColor: '#fff',
        borderRadius: 2
    },
    button: {
        backgroundColor: theme.colors.gold,
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#000'
    }
});
