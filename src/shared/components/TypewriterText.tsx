import React, { useState, useEffect, useRef } from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

interface TypewriterTextProps extends TextProps {
    text: string;
    speed?: number;
    onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
    text,
    speed = 30,
    onComplete,
    style,
    ...props
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const index = useRef(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setDisplayedText('');
        index.current = 0;

        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            if (index.current < text.length) {
                setDisplayedText((prev) => prev + text.charAt(index.current));
                index.current += 1;

                // Haptic feedback every few characters for "typing" feel
                if (index.current % 3 === 0) {
                    Haptics.selectionAsync();
                }
            } else {
                if (timerRef.current) clearInterval(timerRef.current);
                if (onComplete) onComplete();
            }
        }, speed);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [text, speed, onComplete]);

    return (
        <Text style={style} {...props}>
            {displayedText}
        </Text>
    );
};
