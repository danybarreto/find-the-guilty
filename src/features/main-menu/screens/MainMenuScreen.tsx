import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const MainMenuScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Find the guilty</Text>
            <Button
                title="Start Game"
                onPress={() => navigation.navigate('Story')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});
