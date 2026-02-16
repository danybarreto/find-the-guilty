import { StoryData } from '../types';

export const storyData: StoryData = {
    startNodeId: 'intro',
    nodes: {
        intro: {
            id: 'intro',
            type: 'narrative',
            content: 'You arrive at the scene. It’s raining. A body lies on the pavement.',
            image: require('../assets/images/intro.png'),
            choices: [
                { id: 'c1', text: 'Examine the body', nextNodeId: 'body_examine' },
                { id: 'c2', text: 'Talk to the witness', nextNodeId: 'witness_talk' },
            ],
        },
        body_examine: {
            id: 'body_examine',
            type: 'choice',
            content: 'The victim is clutching a strange coin. It looks ancient.',
            itemReward: 'ancient_coin',
            journalEntry: 'Found victim with an ancient coin.',
            image: require('../assets/images/coin.png'),
            choices: [
                { id: 'c3', text: 'Keep the coin', nextNodeId: 'keep_coin' },
                { id: 'c4', text: 'Leave it for forensics', nextNodeId: 'leave_coin' },
            ],
        },
        witness_talk: {
            id: 'witness_talk',
            type: 'choice',
            content: 'The witness is shaking. "I saw a shadow... huge... with glowing eyes!"',
            journalEntry: 'Witness saw a huge shadow with glowing eyes.',
            image: require('../assets/images/witness.png'),
            choices: [
                { id: 'c5', text: 'Press for details', nextNodeId: 'witness_press' },
                { id: 'c6', text: 'Check the alley', nextNodeId: 'alley_check' },
            ],
        },
        keep_coin: {
            id: 'keep_coin',
            type: 'narrative',
            content: 'You pocket the coin. It feels warm.',
            choices: [{ id: 'c7', text: 'Continue investigation', nextNodeId: 'search_alley' }],
        },
        leave_coin: {
            id: 'leave_coin',
            type: 'ending',
            content: 'You leave the evidence. Later, it disappears. Case Cold. GAME OVER.',
        },
        witness_press: {
            id: 'witness_press',
            type: 'ending',
            content: 'The witness panics and runs away. You lost your only lead. GAME OVER.',
        },
        alley_check: {
            id: 'alley_check',
            type: 'narrative',
            content: 'You check the alley. You find footprints leading to the sewer.',
            journalEntry: 'Footprints lead to the sewer.',
            choices: [{ id: 'c8', text: 'Enter sewer', nextNodeId: 'sewer_enter' }],
        },
        search_alley: {
            id: 'search_alley',
            type: 'narrative',
            content: 'With the coin in hand, the alley looks different/darker.',
            choices: [{ id: 'c9', text: 'Use coin as light', nextNodeId: 'sewer_enter' }],
        },
        sewer_enter: {
            id: 'sewer_enter',
            type: 'minigame',
            content: 'A locked gate blocks your path. Pick the lock!',
            minigameId: 'lockpick',
            image: require('../assets/images/sewer_gate.png'),
            choices: [
                { id: 'success', text: 'Success', nextNodeId: 'sewer_success' },
                { id: 'fail', text: 'Fail', nextNodeId: 'sewer_fail' }
            ]
        },
        sewer_success: {
            id: 'sewer_success',
            type: 'narrative',
            content: 'You opened the gate! You find a hidden door with a strange electronic lock.',
            choices: [{ id: 'c10', text: 'Examine lock', nextNodeId: 'lab_door' }]
        },
        lab_door: {
            id: 'lab_door',
            type: 'minigame',
            content: 'Crack the security code to enter.',
            minigameId: 'cipher',
            image: require('../assets/images/lab_door.png'),
            choices: [
                { id: 'success', text: 'Success', nextNodeId: 'lab_entered' },
                { id: 'fail', text: 'Fail', nextNodeId: 'lab_fail' }
            ]
        },
        lab_entered: {
            id: 'lab_entered',
            type: 'ending',
            content: 'Access Granted. You step into a high-tech lab... TO BE CONTINUED...'
        },
        lab_fail: {
            id: 'lab_fail',
            type: 'ending',
            content: 'Security system triggered. Alarm sounds. You flee. GAME OVER.'
        },
        sewer_fail: {
            id: 'sewer_fail',
            type: 'ending',
            content: 'The lock broke. You are stuck. GAME OVER.'
        }
    },
};
