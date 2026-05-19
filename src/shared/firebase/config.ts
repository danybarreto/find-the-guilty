import firestore from '@react-native-firebase/firestore';

// Note: To make this work, you must add google-services.json (Android) 
// and GoogleService-Info.plist (iOS) to the root of your project,
// and configure app.json plugins:
// "plugins": [
//   "@react-native-firebase/app"
// ]

export const saveGameStateToCloud = async (userId: string, gameState: any) => {
    try {
        await firestore().collection('users').doc(userId).set(gameState, { merge: true });
        console.log('Game state saved to cloud');
    } catch (error) {
        console.error('Error saving game state to cloud:', error);
    }
};

export const loadGameStateFromCloud = async (userId: string) => {
    try {
        const doc = await firestore().collection('users').doc(userId).get();
        if (doc.exists) {
            return doc.data();
        }
        return null;
    } catch (error) {
        console.error('Error loading game state from cloud:', error);
        return null;
    }
};
