import React, { useState, useContext, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, Pressable, RefreshControl } from 'react-native';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'; 
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from '@shared/context/ThemeContext';
import { useManagementApi, Branch } from '@api/management';
import { useAuth } from '@shared/context/AuthContext/AuthContext';
import { MovementCard } from '@components/MovementCard';

export default function HistoryScreen() {
    const { colors } = useContext(ThemeContext);
    const api = useManagementApi();
    const { state } = useAuth();

    const { data: userProfile } = useQuery({ queryKey: ['userProfile'], queryFn: api.getUserProfile });
    const isManager = userProfile?.role?.role_name === 'Manager';
    
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
    const [selectorVisible, setSelectorVisible] = useState(false);

    const { data: branches } = useQuery({
        queryKey: ['branches'],
        queryFn: api.getBranches,
        enabled: isManager,
    });

    useEffect(() => {
        if (userProfile) {
            if (!isManager && userProfile.branch?.branchId) {
                setSelectedBranchId(userProfile.branch.branchId);
            } else if (isManager && branches && branches.length > 0 && !selectedBranchId) {
                setSelectedBranchId(branches[0].branchId);
            }
        }
    }, [userProfile, isManager, branches, selectedBranchId]);


    const LIMIT = 20;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching
    } = useInfiniteQuery({
        queryKey: ['movements', selectedBranchId],
        queryFn: ({ pageParam = 1 }) => api.getBranchMovements(selectedBranchId!, pageParam, LIMIT),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < LIMIT) return undefined;
            return allPages.length + 1;
        },
        enabled: !!selectedBranchId,
    });

    const movements = data?.pages.flatMap(page => page) || [];

    const currentBranchName = isManager 
        ? (branches?.find((b: Branch) => b.branchId === selectedBranchId)?.branchName || 'Cargando...')
        : (userProfile?.branch?.branchName || 'Mi Sucursal');

    const renderFooter = () => {
        if (!isFetchingNextPage) return <View style={{ height: 20 }} />;
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.bg },
        header: {
            padding: 16,
            borderBottomWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.bg,
        },
        selector: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: colors.text,
            borderRadius: 8,
            padding: 12,
        },
        selectorText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            padding: 20,
        },
        modalContent: {
            backgroundColor: colors.bg,
            borderRadius: 12,
            padding: 20,
            maxHeight: '50%',
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {isManager ? (
                    <TouchableOpacity style={styles.selector} onPress={() => setSelectorVisible(true)}>
                        <Text style={styles.selectorText}>Historial: {currentBranchName}</Text>
                        <MaterialIcons name="arrow-drop-down" size={24} color={colors.text} />
                    </TouchableOpacity>
                ) : (
                    <Text style={[styles.selectorText, { fontSize: 20 }]}>Historial de Movimientos</Text>
                )}
            </View>

            {isLoading ? (
                <ActivityIndicator style={{ marginTop: 20 }} size="large" color={colors.primary} />
            ) : (
                <FlatList 
                    data={movements}
                    keyExtractor={item => item.movementId.toString()}
                    renderItem={({ item }) => <MovementCard movement={item} />}
                    showsVerticalScrollIndicator={false}
                    
                    onEndReached={() => {
                        if (hasNextPage) fetchNextPage();
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    
                    refreshControl={
                        <RefreshControl 
                            refreshing={isRefetching} 
                            onRefresh={refetch} 
                            tintColor={colors.primary} 
                            colors={[colors.primary]}
                        />
                    }
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 50, color: colors.text_muted }}>
                            No hay movimientos registrados.
                        </Text>
                    }
                />
            )}

            <Modal visible={selectorVisible} transparent animationType="fade" onRequestClose={() => setSelectorVisible(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setSelectorVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: colors.text }}>Seleccionar Sucursal</Text>
                        <FlatList 
                            data={branches}
                            keyExtractor={item => item.branchId.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={{ padding: 15, borderBottomWidth: 1, borderColor: colors.border }}
                                    onPress={() => {
                                        setSelectedBranchId(item.branchId);
                                        setSelectorVisible(false);
                                    }}
                                >
                                    <Text style={{ color: colors.text, fontWeight: item.branchId === selectedBranchId ? 'bold' : 'normal' }}>
                                        {item.branchName}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}