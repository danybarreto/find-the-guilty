import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MiniGameProps } from './types';
import * as Haptics from 'expo-haptics';
import { theme } from '@/shared/theme';

export const CipherGame: React.FC<MiniGameProps> = ({ onSuccess, onFailure }) => {
    const [status, setStatus] = useState<'memorize' | 'input' | 'success' | 'fail'>('memorize');
    const [sequence, setSequence] = useState<number[]>([]);
    const [input, setInput] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(3); // Time to memorize

    useEffect(() => {
        // Generate random 4-digit sequence
        const newSeq = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
        setSequence(newSeq);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setStatus('input');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handlePress = (num: number) => {
        if (status !== 'input') return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const newInput = [...input, num];
        setInput(newInput);

        if (newInput.length === sequence.length) {
            // Check if correct
            const isCorrect = newInput.every((val, index) => val === sequence[index]);
            if (isCorrect) {
                setStatus('success');
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setTimeout(onSuccess, 1000);
            } else {
                setStatus('fail');
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                setTimeout(onFailure, 1000);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {status === 'memorize' ? `MEMORIZE: ${timeLeft}s` : status === 'input' ? 'ENTER CODE' : status === 'success' ? 'UNLOCKED' : 'FAILED'}
            </Text>

            <View style={styles.display}>
                {status === 'memorize' ? (
                    <Text style={styles.sequenceText}>{sequence.join(' ')}</Text>
                ) : (
                    <Text style={styles.sequenceText}>
                        {input.map(() => '*').join(' ')}
                    </Text>
                )}
            </View>

            <View style={styles.keypad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={styles.key}
                        onPress={() => handlePress(num)}
                        disabled={status !== 'input'}
                    >
                        <Text style={styles.keyText}>{num}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.gold,
        width: '100%'
    },
    title: {
        color: theme.colors.gold,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: 'monospace'
    },
    display: {
        backgroundColor: '#000',
        padding: 20,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333'
    },
    sequenceText: {
        color: '#0f0',
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        letterSpacing: 5
    },
    keypad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        width: 250
    },
    key: {
        width: 60,
        height: 60,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#555'
    },
    keyText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold'
    }
});
