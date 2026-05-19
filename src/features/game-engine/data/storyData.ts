import { StoryData } from '../types';

export const storyData: StoryData = {
    startNodeId: 'intro',
    nodes: {
        // --- ACTO 1: LA INVITACIÓN ---
        intro: {
            id: 'intro',
            type: 'narrative',
            act: 1,
            content: 'Llegas a la escena. Llueve. Un cuerpo yace en el pavimento.',
            image: require('../assets/images/intro.png'),
            choices: [
                { id: 'c1', text: 'Examinar cuerpo', nextNodeId: 'body_examine' },
                { id: 'c2', text: 'Hablar con testigo', nextNodeId: 'witness_talk' },
            ],
        },
        body_examine: {
            id: 'body_examine',
            type: 'choice',
            act: 1,
            content: 'La víctima sujeta una extraña moneda. Parece antigua.',
            itemReward: 'ancient_coin',
            journalEntry: 'Víctima encontrada con una moneda antigua.',
            image: require('../assets/images/body_examine.png'),
            choices: [
                { id: 'c3', text: 'Guardar moneda', nextNodeId: 'keep_coin', isGoodDecision: true },
                { id: 'c4', text: 'Dejar para forense', nextNodeId: 'leave_coin', isGoodDecision: false },
            ],
        },
        leave_coin: {
            id: 'leave_coin',
            type: 'ending',
            content: 'Dejas la evidencia. Más tarde, desaparece. Caso Cerrado. GAME OVER.',
            image: require('../assets/images/leave_coin.png'),
        },
        keep_coin: {
            id: 'keep_coin',
            type: 'narrative',
            act: 1,
            content: 'Al guardar la moneda, notas un mensaje críptico pintado en la pared con sangre.',
            image: require('../assets/images/cryptic_message.png'),
            choices: [{ id: 'c5', text: 'Leer mensaje', nextNodeId: 'cryptic_read' }],
        },
        witness_talk: {
            id: 'witness_talk',
            type: 'choice',
            act: 1,
            content: 'El testigo tiembla. "¡Vi una sombra... enorme... con ojos brillantes!"',
            image: require('../assets/images/witness_talk.png'),
            choices: [
                { id: 'c5', text: 'Presionar agresivamente', nextNodeId: 'witness_press', isGoodDecision: false },
                { id: 'c6', text: 'Buscar pistas alrededor', nextNodeId: 'keep_coin', isGoodDecision: true },
            ],
        },
        witness_press: {
            id: 'witness_press',
            type: 'ending',
            content: 'El testigo entra en pánico y huye. Perdiste tu única pista. GAME OVER.',
            image: require('../assets/images/witness_press.png'),
        },
        cryptic_read: {
            id: 'cryptic_read',
            type: 'narrative',
            act: 1,
            content: 'MATA A TU HERMANO. Este asesino te conoce. El rastro lleva al Asilo Abandonado.',
            journalEntry: 'Mensaje del asesino. Rastro hacia el Asilo.',
            image: require('../assets/images/cryptic_message.png'),
            choices: [{ id: 'c7', text: 'Ir al Asilo', nextNodeId: 'act2_asylum' }],
        },

        // --- ACTO 2: EL LABERINTO DE SOMBRAS ---
        act2_asylum: {
            id: 'act2_asylum',
            type: 'choice',
            act: 2,
            content: 'El olor a podredumbre inunda los pasillos del Asilo. Una silla de ruedas ensangrentada te bloquea el paso.',
            image: require('../assets/images/asylum_interior.png'),
            choices: [
                { id: 'a1', text: 'Revisar expedientes médicos', nextNodeId: 'asylum_files', isGoodDecision: true },
                { id: 'a2', text: 'Seguir el rastro de sangre', nextNodeId: 'asylum_trap', isGoodDecision: false },
            ]
        },
        asylum_trap: {
            id: 'asylum_trap',
            type: 'ending',
            content: 'Caíste en una trampa del asesino. El suelo cede bajo tus pies. GAME OVER.',
            image: require('../assets/images/asylum_interior.png'),
        },
        asylum_files: {
            id: 'asylum_files',
            type: 'narrative',
            act: 2,
            content: 'Encuentras tu propio nombre en los registros de pacientes. Un mapa adjunto señala una Fábrica en ruinas.',
            journalEntry: 'Fui paciente aquí. Siguiente pista: La Fábrica.',
            itemReward: 'asylum_file',
            image: require('../assets/images/asylum_interior.png'),
            choices: [{ id: 'a3', text: 'Ir a la Fábrica', nextNodeId: 'act2_factory' }]
        },
        act2_factory: {
            id: 'act2_factory',
            type: 'minigame',
            act: 2,
            content: 'Engranajes gigantes y oxidados. La puerta a la sala de control está bloqueada por un panel electrónico.',
            minigameId: 'cipher',
            image: require('../assets/images/factory_ruins.png'),
            choices: [
                { id: 'success', text: 'Hackear exitoso', nextNodeId: 'factory_success', isGoodDecision: true },
                { id: 'fail', text: 'Hackear fallido', nextNodeId: 'factory_fail', isGoodDecision: false }
            ]
        },
        factory_fail: {
            id: 'factory_fail',
            type: 'ending',
            content: 'La alarma suena. Gas tóxico inunda la sala. GAME OVER.',
            image: require('../assets/images/factory_ruins.png')
        },
        factory_success: {
            id: 'factory_success',
            type: 'narrative',
            act: 2,
            content: 'En la computadora descubres una transferencia de fondos ilícitos. Destino: El Orfanato.',
            journalEntry: 'Transferencia ilícita ligada al Orfanato St. Jude.',
            itemReward: 'factory_drive',
            image: require('../assets/images/factory_ruins.png'),
            choices: [{ id: 'f1', text: 'Ir al Orfanato', nextNodeId: 'act2_orphanage' }]
        },
        act2_orphanage: {
            id: 'act2_orphanage',
            type: 'choice',
            act: 2,
            content: 'El Orfanato St. Jude. El lugar donde creciste. La puerta principal está abierta.',
            image: require('../assets/images/orphanage_exterior.png'),
            choices: [
                { id: 'o1', text: 'Entrar cautelosamente', nextNodeId: 'orphanage_inside', isGoodDecision: true },
                { id: 'o2', text: 'Llamar a los refuerzos', nextNodeId: 'orphanage_cops', isGoodDecision: false }
            ]
        },
        orphanage_cops: {
            id: 'orphanage_cops',
            type: 'ending',
            content: 'La policía llega e interfiere con la escena, destruyendo las pruebas. El asesino escapa. GAME OVER.',
            image: require('../assets/images/orphanage_exterior.png')
        },
        orphanage_inside: {
            id: 'orphanage_inside',
            type: 'narrative',
            act: 2,
            content: 'Adentro, encuentras los juguetes de tu hermano. Alguien los acomodó para formar la palabra "MUELLES".',
            journalEntry: 'Mensaje macabro en el orfanato. Hacia los muelles.',
            image: require('../assets/images/orphanage_exterior.png'),
            choices: [{ id: 'o3', text: 'Ir a los Muelles', nextNodeId: 'act2_docks' }]
        },
        act2_docks: {
            id: 'act2_docks',
            type: 'narrative',
            act: 2,
            content: 'Niebla espesa. Un contenedor rojo brillante destaca en la oscuridad.',
            image: require('../assets/images/docks_night.png'),
            choices: [{ id: 'd1', text: 'Abrir contenedor', nextNodeId: 'docks_container' }]
        },
        docks_container: {
            id: 'docks_container',
            type: 'choice',
            act: 2,
            content: 'Adentro hay archivos robados de la policía. Alguien encubrió crímenes pasados.',
            image: require('../assets/images/docks_night.png'),
            choices: [
                { id: 'd2', text: 'Llevar los archivos', nextNodeId: 'act3_archives', isGoodDecision: true },
                { id: 'd3', text: 'Quemar los archivos', nextNodeId: 'docks_burn', isGoodDecision: false }
            ]
        },
        docks_burn: {
            id: 'docks_burn',
            type: 'ending',
            content: 'Destruyes la única prueba real. Nunca sabrás la verdad. GAME OVER.',
            image: require('../assets/images/docks_night.png')
        },

        // --- ACTO 3: EL JUICIO FINAL ---
        act3_archives: {
            id: 'act3_archives',
            type: 'narrative',
            act: 3,
            content: 'Vas a los Archivos Centrales de la Policía a confrontar la verdad.',
            image: require('../assets/images/police_archives.png'),
            choices: [{ id: 'arch1', text: 'Descender al archivo', nextNodeId: 'archives_boss' }]
        },
        archives_boss: {
            id: 'archives_boss',
            type: 'choice',
            act: 3,
            content: 'El Jefe de Policía te espera armado. "Descubriste demasiado, detective".',
            image: require('../assets/images/police_archives.png'),
            choices: [
                { id: 'boss1', text: 'Disparar primero', nextNodeId: 'archives_shoot', isGoodDecision: false },
                { id: 'boss2', text: 'Presentar evidencias', nextNodeId: 'archives_evidence', isGoodDecision: true }
            ]
        },
        archives_shoot: {
            id: 'archives_shoot',
            type: 'ending',
            content: 'Lo matas, pero ahora eres un asesino de policías sin pruebas oficiales.',
            image: require('../assets/images/police_archives.png')
        },
        archives_evidence: {
            id: 'archives_evidence',
            type: 'minigame',
            act: 3,
            content: 'Debes descifrar la terminal central para transmitir las pruebas a la prensa antes de que te dispare.',
            minigameId: 'terminal',
            image: require('../assets/images/police_archives.png'),
            choices: [
                { id: 'success', text: 'Transmitir', nextNodeId: 'true_ending', isGoodDecision: true },
                { id: 'fail', text: 'Fallar', nextNodeId: 'bad_ending', isGoodDecision: false }
            ]
        },
        bad_ending: {
            id: 'bad_ending',
            type: 'ending',
            content: 'Fallas. Te dispara y destruye todo. GAME OVER.',
            image: require('../assets/images/police_archives.png')
        },
        true_ending: {
            id: 'true_ending',
            type: 'ending',
            content: 'Transmitido con éxito. El FBI entra al edificio. Sobreviviste al laberinto.',
            image: require('../assets/images/resolution_bg.png')
        }
    },
};
