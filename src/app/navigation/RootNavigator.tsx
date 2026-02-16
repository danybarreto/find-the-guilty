import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainMenuScreen } from '@/features/main-menu/screens/MainMenuScreen';
import { StoryScreen } from '@/features/story-view/screens/StoryScreen';

export type RootStackParamList = {
    MainMenu: undefined;
    Story: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="MainMenu">
            <Stack.Screen
                name="MainMenu"
                component={MainMenuScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Story"
                component={StoryScreen}
                options={{ title: 'Investigation' }}
            />
        </Stack.Navigator>
    );
};
