import { View, FlatList, Text, StyleSheet, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuthState } from '../hooks/useAuthState';
import ThemedView from './ThemedView';
import ThemedText from './ThemedText';
import ThemedButton from './ThemedButton';
import Spacer from './Spacer';
import ThemedTextInput from './ThemedTextInput';
import ThemedCard from './ThemedCard';

const ResultsDisplay = ({
  results,
  currentCwa,
  previousCredit,
  semesterCredit,
  onBack,
  onSaveToHistory,
  isProjectionMode = false,
  saveLoading = false,
  saveError = null,
}) => {
    const { isAuthenticated } = useAuthState();

    const [searchQuery, setSearchQuery] = useState('');

    const filteredResults = results.filter(item => {
        const query = searchQuery.trim();
        if (!query) return true;
        
        const searchValue = parseFloat(query);
        
        
        if (isNaN(searchValue)) return false;
        
        const projectedCwa = item.projectedCwa;
        
       
        if (!query.includes('.')) {
          
            return projectedCwa >= searchValue && projectedCwa < searchValue + 1;
        } else {

            const decimalPlaces = query.split('.')[1]?.length || 0;
            
            if (decimalPlaces === 1) {
                
                const rangeSize = 0.1;
                return projectedCwa >= searchValue && projectedCwa < searchValue + rangeSize;
            } else if (decimalPlaces === 2) {
         
                const tolerance = 0.005; 
                return Math.abs(projectedCwa - searchValue) < tolerance;
            } else {

                return Math.abs(projectedCwa - searchValue) < 0.001;
            }
        }
    });

    const sortedResults = filteredResults.sort((a, b) => a.projectedCwa - b.projectedCwa);

    const renderProjectionItem = ({ item }) => (
        <View style={styles.projectionCard}>
            <Text style={styles.rswaText}>{item.rswa.toFixed(2)}%</Text>
            <Text style={styles.arrowText}>→</Text>
            <Text style={styles.cwaText}>{item.projectedCwa.toFixed(2)}%</Text>
        </View>
    );

    
    const getSearchPlaceholder = () => {
        return "Search CWA (e.g., 70, 70.5, 70.55)";
    };

    const getResultsCount = () => {
        if (searchQuery.trim()) {
            return `${sortedResults.length} result${sortedResults.length !== 1 ? 's' : ''} found`;
        }
        return `${results.length} total projections`;
    };
    

    if (isProjectionMode) {
        return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView safe={true} style={styles.container}>
                <ThemedView style={styles.header}>
                    <ThemedText style={styles.title} title>GradePoint</ThemedText>
                    <ThemedButton 
                        useGradient={false} 
                        style={{
                            backgroundColor: 'transparent', 
                            borderWidth: 1, 
                            borderColor: '#ccc',  
                            borderRadius: 5,
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            marginRight: 10,
                        }} 
                        onPress={onBack}
                    >
                        <ThemedText title>Back</ThemedText>
                    </ThemedButton>
                </ThemedView>

                <ThemedCard style={styles.summarySection}>
                    <ThemedText style={styles.summaryTitle}>Input Summary:</ThemedText>
                    <ThemedText>Current CWA: {currentCwa}%</ThemedText>
                    <ThemedText>Previous Credits: {previousCredit}</ThemedText>
                    <ThemedText>Semester Credits: {semesterCredit}</ThemedText>
                </ThemedCard>

                <View style={styles.tableHeader}>
                    <Text style={styles.columnHeader}>Required Avg</Text>
                    <Text style={styles.columnHeader}>Projected CWA</Text>
                </View>

                <ThemedTextInput
                    placeholder={getSearchPlaceholder()}
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                    onSubmitEditing={() => {
                        Keyboard.dismiss();
                    }}
                    returnKeyType="done"
                    keyboardType="numeric"
                />

                {/* Results count indicator */}
                <ThemedCard style={styles.resultsCountContainer}>
                    <ThemedText style={styles.resultsCount}>
                        {getResultsCount()}
                    </ThemedText>
                    {searchQuery.trim() && sortedResults.length === 0 && (
                        <ThemedText style={styles.noResults}>
                            No results found. Try a different CWA value.
                        </ThemedText>
                    )}
                </ThemedCard>

                <Spacer height={10}/>

                <FlatList
                    data={sortedResults}
                    keyExtractor={(item, index) => `${item.rswa}-${item.projectedCwa}-${index}`}
                    renderItem={renderProjectionItem}
                    horizontal={true}
                    showsHorizontalScrollIndicator={true}
                    snapToInterval={136} // Adjusted for card width + margin
                    decelerationRate={'fast'}
                    contentContainerStyle={styles.projectionsList}
                    ListEmptyComponent={() => (
                        searchQuery.trim() ? (
                            <ThemedView style={styles.emptyContainer}>
                                <ThemedText style={styles.emptyText}>
                                    No projections match your search
                                </ThemedText>
                            </ThemedView>
                        ) : null
                    )}
                />

                <Spacer height={15}/>
                <View style={styles.actionButtons}>
                    <ThemedButton 
                        onPress={onSaveToHistory} 
                        style={{ borderRadius: 8 }}
                        disabled={saveLoading || !isAuthenticated}
                    >
                        {saveLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color="#fff" />
                                <Text style={styles.loadingText}>Saving...</Text>
                            </View>
                        ) : (
                            <Text style={styles.buttonText}>
                                {isAuthenticated ? 'Save to History' : 'Login to Save'}
                            </Text>
                        )}
                    </ThemedButton>
                    <ThemedButton style={{ borderRadius: 8 }} onPress={onBack} variant="secondary">
                        <Text style={styles.buttonText}>Calculate Again</Text>
                    </ThemedButton>
                </View>
                
                {!isAuthenticated && (
                    <ThemedCard style={styles.guestModeNotice}>
                        <View style={styles.guestModeContent}>
                            <Ionicons name="information-circle-outline" size={16} color="#F59E0B" />
                            <ThemedText style={styles.guestModeText}>
                                Log in to save your calculations and view history
                            </ThemedText>
                        </View>
                    </ThemedCard>
                )}
                
                {/* Show error message if save failed */}
                {saveError && (
                    <ThemedCard style={styles.errorContainer}>
                        <ThemedText style={styles.errorText}>
                            ⚠️ Save Error: {saveError}
                        </ThemedText>
                    </ThemedCard>
                )}
            </ThemedView>
         </TouchableWithoutFeedback>
        );
    }

    return null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginTop: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,

    },
    title: {
        fontSize: 24, 
        flex: 1,
    },
    summarySection: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    summaryTitle: {
        fontWeight: '600',
        marginBottom: 8,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#e9ecef',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginBottom: 8,
        justifyContent: 'space-between',
    },
    columnHeader: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    resultsCountContainer: {
        marginBottom: 4,
        paddingHorizontal: 4,
    },
    resultsCount: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    noResults: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 4,
    },
    projectionsList: {
        paddingVertical: 5,
        paddingHorizontal: 4,
    },
    projectionCard: {
        width: 120, 
        marginHorizontal: 8,
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rswaText: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
        textAlign: 'center',
    },
    arrowText: {
        fontSize: 20,
        color: '#999',
        marginVertical: 2,
    },
    cwaText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
        textAlign: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        marginBottom: 20,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    errorContainer: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#FEF2F2',
        borderColor: '#FCA5A5',
        borderWidth: 1,
        borderRadius: 8,
    },
    errorText: {
        color: '#DC2626',
        fontSize: 14,
        textAlign: 'center',
    },
    guestModeNotice: {
        marginTop: 12,
        backgroundColor: '#FEF3C7',
        borderColor: '#F59E0B',
        borderWidth: 1,
    },
    guestModeContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    guestModeText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#92400E',
        textAlign: 'center',
    },
});

export default ResultsDisplay;
