import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MiniGameProps } from './types';
import * as Haptics from 'expo-haptics';
import { theme } from '@/shared/theme';

const WORDS = [
    "ROOT", "BOOT", "DATA", "NODE", "FILE", "CORE", "HACK", "CODE",
    "BYTE", "BASH", "USER", "PASS", "LOCK", "KEYS", "TRUE", "NULL"
];

export const TerminalHacker: React.FC<MiniGameProps> = ({ onSuccess, onFailure }) => {
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [targetWord, setTargetWord] = useState('');
    const [wordList, setWordList] = useState<string[]>([]);
    const [attemptsLeft, setAttemptsLeft] = useState(4);
    const [logs, setLogs] = useState<string[]>(['> INITIATING OVERRIDE PROTOCOL...', '> SELECT TARGET PASSWORD']);

    useEffect(() => {
        // Shuffle and pick 8 words
        const shuffled = [...WORDS].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 8);
        setWordList(selected);
        // Pick target
        setTargetWord(selected[Math.floor(Math.random() * selected.length)]);
    }, []);

    const getMatchCount = (guess: string) => {
        let count = 0;
        for (let i = 0; i < guess.length; i++) {
            if (guess[i] === targetWord[i]) count++;
        }
        return count;
    };

    const handleGuess = (word: string) => {
        if (gameState !== 'playing') return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (word === targetWord) {
            setGameState('won');
            setLogs(prev => [...prev, `> ${word}`, '> ACCESS GRANTED.']);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setTimeout(onSuccess, 1500);
        } else {
            const matches = getMatchCount(word);
            const newAttempts = attemptsLeft - 1;
            setAttemptsLeft(newAttempts);
            setLogs(prev => [...prev, `> ${word}`, `> DENIED. LIKENESS=${matches}`]);

            if (newAttempts <= 0) {
                setGameState('lost');
                setLogs(prev => [...prev, '> SYSTEM TERMINAL LOCKED.']);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                setTimeout(onFailure, 1500);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM</Text>
                <Text style={styles.attempts}>ATTEMPTS LEFT: {'█ '.repeat(attemptsLeft)}</Text>
            </View>

            <View style={styles.mainArea}>
                <View style={styles.wordColumn}>
                    {wordList.map((word, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleGuess(word)}
                            disabled={gameState !== 'playing'}
                            style={styles.wordButton}
                        >
                            <Text style={styles.wordText}>0x{index.toString(16).toUpperCase()}0 {word}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.logArea}>
                    <ScrollView>
                        {logs.map((log, index) => (
                            <Text key={index} style={styles.logText}>{log}</Text>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#0a0a0a',
        padding: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#0f0',
        minHeight: 350
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: '#0f0',
        paddingBottom: 10,
        marginBottom: 10
    },
    title: {
        color: '#0f0',
        fontFamily: 'monospace',
        fontSize: 12,
        fontWeight: 'bold'
    },
    attempts: {
        color: '#0f0',
        fontFamily: 'monospace',
        fontSize: 14,
        marginTop: 5
    },
    mainArea: {
        flexDirection: 'row',
        flex: 1
    },
    wordColumn: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: '#0f0',
        paddingRight: 10
    },
    wordButton: {
        paddingVertical: 5
    },
    wordText: {
        color: '#0f0',
        fontFamily: 'monospace',
        fontSize: 16,
        letterSpacing: 2
    },
    logArea: {
        flex: 1,
        paddingLeft: 10
    },
    logText: {
        color: '#0f0',
        fontFamily: 'monospace',
        fontSize: 12,
        marginBottom: 5
    }
});
