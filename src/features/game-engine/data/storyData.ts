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
            image: require('../assets/images/body_examine.png'),
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
            image: require('../assets/images/witness_talk.png'),
            choices: [
                { id: 'c5', text: 'Press for details', nextNodeId: 'witness_press' },
                { id: 'c6', text: 'Check the alley', nextNodeId: 'alley_check' },
            ],
        },
        keep_coin: {
            id: 'keep_coin',
            type: 'narrative',
            content: 'You pocket the coin. It feels warm.',
            image: require('../assets/images/keep_coin.png'),
            choices: [{ id: 'c7', text: 'Continue investigation', nextNodeId: 'search_alley' }],
        },
        leave_coin: {
            id: 'leave_coin',
            type: 'ending',
            content: 'You leave the evidence. Later, it disappears. Case Cold. GAME OVER.',
            image: require('../assets/images/leave_coin.png'),
        },
        witness_press: {
            id: 'witness_press',
            type: 'ending',
            content: 'The witness panics and runs away. You lost your only lead. GAME OVER.',
            image: require('../assets/images/witness_press.png'),
        },
        alley_check: {
            id: 'alley_check',
            type: 'narrative',
            content: 'You check the alley. You find a matchbook for "The Neon Bar" covered in blood.',
            journalEntry: 'Found a bloody matchbook for "The Neon Bar".',
            image: require('../assets/images/alley_check.png'),
            choices: [{ id: 'c8', text: 'Go to the Bar', nextNodeId: 'neon_bar_exterior' }],
        },
        search_alley: {
            id: 'search_alley',
            type: 'narrative',
            content: 'With the coin in hand, the alley reveals a hidden glowing message pointing to "The Neon Bar".',
            journalEntry: 'Coin revealed a hidden message about The Neon Bar.',
            image: require('../assets/images/search_alley.png'),
            choices: [{ id: 'c9', text: 'Go to the Bar', nextNodeId: 'neon_bar_exterior' }],
        },
        neon_bar_exterior: {
            id: 'neon_bar_exterior',
            type: 'choice',
            content: 'The Neon Bar is a dive in the lower sectors. Rain pours heavily.',
            image: require('../assets/images/neon_bar_exterior.png'),
            choices: [
                { id: 'nb1', text: 'Enter quietly', nextNodeId: 'neon_bar_inside' },
                { id: 'nb2', text: 'Kick the door in', nextNodeId: 'neon_bar_aggressive' }
            ]
        },
        neon_bar_aggressive: {
            id: 'neon_bar_aggressive',
            type: 'ending',
            content: 'You kick the door in. The bouncer turns you into swiss cheese. GAME OVER.',
            image: require('../assets/images/neon_bar_aggressive.png')
        },
        neon_bar_inside: {
            id: 'neon_bar_inside',
            type: 'choice',
            content: 'Inside, a Cyborg Bartender is wiping a glass. He glares at you.',
            image: require('../assets/images/neon_bar_inside.png'),
            choices: [
                { id: 'nb3', text: 'Ask about the victim', nextNodeId: 'bartender_interrogate' },
                { id: 'nb4', text: 'Order a drink', nextNodeId: 'bartender_drink' }
            ]
        },
        bartender_drink: {
            id: 'bartender_drink',
            type: 'narrative',
            content: 'You order a whiskey. The bartender loosens up. "Your victim... he has an apartment in Sector 4."',
            journalEntry: 'Victim lived in Sector 4.',
            image: require('../assets/images/bartender_drink.png'),
            choices: [{ id: 'nb5', text: 'Go to Apartment', nextNodeId: 'apartment_exterior' }]
        },
        bartender_interrogate: {
            id: 'bartender_interrogate',
            type: 'choice',
            content: '"I don\'t know nothing," he growls, reaching under the counter.',
            image: require('../assets/images/bartender_interrogate.png'),
            choices: [
                { id: 'nb6', text: 'Draw weapon', nextNodeId: 'bartender_fight' },
                { id: 'nb7', text: 'Show badge', nextNodeId: 'bartender_drink' }
            ]
        },
        bartender_fight: {
            id: 'bartender_fight',
            type: 'ending',
            content: 'You draw your weapon, but his arm transforms into a plasma cannon. You get vaporized. GAME OVER.',
            image: require('../assets/images/bartender_fight.png')
        },
        apartment_exterior: {
            id: 'apartment_exterior',
            type: 'narrative',
            content: 'You arrive at Sector 4. The door to the apartment is ajar.',
            image: require('../assets/images/apartment_exterior.png'),
            choices: [{ id: 'ap1', text: 'Enter carefully', nextNodeId: 'apartment_inside' }]
        },
        apartment_inside: {
            id: 'apartment_inside',
            type: 'choice',
            content: 'The apartment is trashed. Papers everywhere, a glowing monitor in the corner.',
            image: require('../assets/images/apartment_inside.png'),
            choices: [
                { id: 'ap2', text: 'Check monitor', nextNodeId: 'apartment_monitor' },
                { id: 'ap3', text: 'Check papers', nextNodeId: 'apartment_papers' }
            ]
        },
        apartment_papers: {
            id: 'apartment_papers',
            type: 'narrative',
            content: 'You find a flyer for a hacker named "Zero". It has an address.',
            journalEntry: 'Found address for hacker "Zero".',
            image: require('../assets/images/apartment_papers.png'),
            choices: [{ id: 'ap4', text: 'Go to Hacker Den', nextNodeId: 'hacker_exterior' }]
        },
        apartment_monitor: {
            id: 'apartment_monitor',
            type: 'narrative',
            content: 'The monitor is rigged! A flashbang goes off, blinding you.',
            image: require('../assets/images/apartment_monitor.png'),
            choices: [{ id: 'ap5', text: 'Stumble blindly', nextNodeId: 'cop_encounter' }]
        },
        cop_encounter: {
            id: 'cop_encounter',
            type: 'choice',
            content: 'You trip outside, right into a Corrupt Cop. "Well well... an easy bust."',
            image: require('../assets/images/cop_encounter.png'),
            choices: [
                { id: 'cop1', text: 'Bribe him', nextNodeId: 'cop_bribe' },
                { id: 'cop2', text: 'Fight him', nextNodeId: 'cop_fight' },
                { id: 'cop3', text: 'Run', nextNodeId: 'cop_run' }
            ]
        },
        cop_fight: {
            id: 'cop_fight',
            type: 'ending',
            content: 'He is wearing level 4 kinetic armor. Your punches do nothing. He arrests you. GAME OVER.',
            image: require('../assets/images/cop_fight.png')
        },
        cop_run: {
            id: 'cop_run',
            type: 'ending',
            content: 'You try to run, but he shoots you with a stun gun. You are captured. GAME OVER.',
            image: require('../assets/images/cop_run.png')
        },
        cop_bribe: {
            id: 'cop_bribe',
            type: 'narrative',
            content: 'You hand him all your credits. He scoffs but lets you go. You find the hacker address from his terminal while he wasn\'t looking.',
            image: require('../assets/images/cop_bribe.png'),
            choices: [{ id: 'cop4', text: 'Go to Hacker Den', nextNodeId: 'hacker_exterior' }]
        },
        hacker_exterior: {
            id: 'hacker_exterior',
            type: 'narrative',
            content: 'You arrive at the Hacker Den. It is hidden behind an old subway station.',
            image: require('../assets/images/hacker_exterior.png'),
            choices: [{ id: 'h1', text: 'Enter', nextNodeId: 'hacker_inside' }]
        },
        hacker_inside: {
            id: 'hacker_inside',
            type: 'choice',
            content: 'Monitors everywhere. Zero turns around. "I can find who did this... for a price."',
            image: require('../assets/images/hacker_inside.png'),
            choices: [
                { id: 'h2', text: 'Ask for server access', nextNodeId: 'sewer_enter' },
                { id: 'h3', text: 'Ask for the killer\'s name', nextNodeId: 'hacker_refusal' }
            ]
        },
        hacker_refusal: {
            id: 'hacker_refusal',
            type: 'narrative',
            content: '"I don\'t sell names. Only access. The server is hidden in the sewers. I sent you the location."',
            image: require('../assets/images/hacker_refusal.png'),
            choices: [{ id: 'h4', text: 'Go to Sewers', nextNodeId: 'sewer_enter' }]
        },
        sewer_enter: {
            id: 'sewer_enter',
            type: 'minigame',
            content: 'A locked grate blocks the server entrance. Pick the lock!',
            minigameId: 'lockpick',
            image: require('../assets/images/sewer_enter.png'),
            choices: [
                { id: 'success', text: 'Success', nextNodeId: 'sewer_success' },
                { id: 'fail', text: 'Fail', nextNodeId: 'sewer_fail' }
            ]
        },
        sewer_success: {
            id: 'sewer_success',
            type: 'narrative',
            content: 'You opened the grate! You find a hidden door with a strange electronic lock.',
            image: require('../assets/images/sewer_success.png'),
            choices: [{ id: 'c10', text: 'Examine lock', nextNodeId: 'lab_door' }]
        },
        lab_door: {
            id: 'lab_door',
            type: 'minigame',
            content: 'Crack the security code to enter the server room.',
            minigameId: 'cipher',
            image: require('../assets/images/lab_door_01.png'),
            choices: [
                { id: 'success', text: 'Success', nextNodeId: 'lab_entered' },
                { id: 'fail', text: 'Fail', nextNodeId: 'lab_fail' }
            ]
        },
        lab_entered: {
            id: 'lab_entered',
            type: 'narrative',
            content: 'Access Granted. You step into a high-tech lab. There is a blinking terminal on the desk.',
            image: require('../assets/images/lab_entered.png'),
            choices: [{ id: 'c11', text: 'Hack Terminal', nextNodeId: 'terminal_hack' }]
        },
        terminal_hack: {
            id: 'terminal_hack',
            type: 'minigame',
            minigameId: 'terminal',
            content: 'The terminal contains files about the murder. Hack it before the guards arrive.',
            image: require('../assets/images/terminal_hack.png'),
            choices: [
                { id: 'success', text: 'Success', nextNodeId: 'lab_true_ending' },
                { id: 'fail', text: 'Fail', nextNodeId: 'lab_bad_ending' }
            ]
        },
        lab_true_ending: {
            id: 'lab_true_ending',
            type: 'ending',
            content: 'You downloaded the files! The corporation setup the crime. The truth is out. YOU WIN!',
            image: require('../assets/images/lab_true_ending.png')
        },
        lab_bad_ending: {
            id: 'lab_bad_ending',
            type: 'ending',
            content: 'INTRUDER DETECTED. The room fills with gas before you can escape. GAME OVER.',
            image: require('../assets/images/lab_bad_ending.png')
        },
        lab_fail: {
            id: 'lab_fail',
            type: 'ending',
            content: 'Security system triggered. Alarm sounds. You flee. GAME OVER.',
            image: require('../assets/images/lab_fail.png')
        },
        sewer_fail: {
            id: 'sewer_fail',
            type: 'ending',
            content: 'The lock broke. You are stuck. GAME OVER.',
            image: require('../assets/images/sewer_fail.png')
        }
    },
};
