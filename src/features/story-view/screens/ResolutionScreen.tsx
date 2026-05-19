import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button, Dimensions, ScrollView, Image } from 'react-native';
import { useGameStore } from '../../game-engine/store';
import { colors, typography, spacing } from '../../../shared/theme/theme';
import { useNavigation } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export const ResolutionScreen = () => {
    const { inventory, goodDecisions, badDecisions, startTime, endTime, resetGame } = useGameStore();
    const navigation = useNavigation<any>();

    // Calculate elapsed time in minutes
    const timeTaken = startTime && endTime ? Math.round((endTime - startTime) / 60000) : 0;
    
    // Determine the result
    const hasCoin = inventory.includes('ancient_coin');
    const hasAddress = inventory.includes('address_found') || true; // Mock condition
    const evidenceCount = inventory.length;

    let resultTitle = 'FRACASO ABSOLUTO';
    let resultColor = colors.error;
    let epilogue = 'El caso se enfrió. Las sombras tragaron la verdad y tú pasaste a ser otro fantasma más en esta ciudad rota.';

    if (evidenceCount >= 3 && goodDecisions > badDecisions) {
        resultTitle = 'JUSTICIA ALCANZADA';
        resultColor = colors.success;
        epilogue = 'Lograste desenmascarar la conspiración. No fue limpio, ni fue fácil. Pero esta noche, la ciudad dormirá un poco más tranquila.';
    } else if (evidenceCount > 0) {
        resultTitle = 'DUDA RAZONABLE';
        resultColor = colors.accentSecondary;
        epilogue = 'Atrapaste a un culpable, pero el verdadero cerebro sigue libre. Hiciste lo que pudiste con las cartas que te tocaron.';
    }

    const chartData = [
        {
            name: 'Aciertos',
            population: goodDecisions,
            color: colors.success,
            legendFontColor: colors.text,
            legendFontSize: 12,
        },
        {
            name: 'Errores',
            population: badDecisions,
            color: colors.error,
            legendFontColor: colors.text,
            legendFontSize: 12,
        }
    ];

    const handleRestart = () => {
        resetGame();
        navigation.navigate('MainMenu');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image 
                    source={require('../../game-engine/assets/images/resolution_bg.png')} 
                    style={styles.bgImage} 
                    resizeMode="cover"
                />
                
                <View style={styles.overlay}>
                    <Text style={styles.header}>INFORME DE CASO</Text>
                    
                    <View style={styles.resultBox}>
                        <Text style={[styles.resultTitle, { color: resultColor }]}>{resultTitle}</Text>
                        <Text style={styles.epilogue}>{epilogue}</Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>TIEMPO</Text>
                            <Text style={styles.statValue}>{timeTaken} MIN</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>PRUEBAS</Text>
                            <Text style={styles.statValue}>{evidenceCount}</Text>
                        </View>
                    </View>

                    <Text style={styles.chartTitle}>PRECISIÓN DE INVESTIGACIÓN</Text>
                    {goodDecisions > 0 || badDecisions > 0 ? (
                        <PieChart
                            data={chartData}
                            width={screenWidth - 40}
                            height={160}
                            chartConfig={{
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            }}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                            center={[10, 0]}
                            absolute
                        />
                    ) : (
                        <Text style={styles.epilogue}>No hay datos suficientes.</Text>
                    )}

                    <View style={styles.buttonContainer}>
                        <Button title="CERRAR CASO (Reiniciar)" color={colors.accent} onPress={handleRestart} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    bgImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 300,
        opacity: 0.4,
    },
    overlay: {
        flex: 1,
        padding: spacing.lg,
        paddingTop: 80,
    },
    header: {
        fontFamily: typography.fontFamily,
        fontSize: typography.sizes.xxl,
        fontWeight: typography.weights.black,
        color: colors.primary,
        textAlign: 'center',
        marginBottom: spacing.xl,
        letterSpacing: 2,
    },
    resultBox: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderLeftWidth: 4,
        borderColor: colors.accent,
        marginBottom: spacing.lg,
    },
    resultTitle: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.sm,
    },
    epilogue: {
        fontSize: typography.sizes.sm,
        color: colors.textMuted,
        lineHeight: 22,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
    },
    statBox: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        width: '48%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    statLabel: {
        color: colors.textMuted,
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.xs,
    },
    statValue: {
        color: colors.primary,
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.black,
    },
    chartTitle: {
        color: colors.primary,
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.md,
    },
    buttonContainer: {
        marginTop: spacing.xxl,
        marginBottom: spacing.lg,
    }
});
