import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View, Dimensions, SectionList, Alert, Text } from 'react-native'
import  { useState } from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedCard from '../../components/ThemedCard'
import Spacer from '../../components/Spacer'
import ThemedTextInput from '../../components/ThemedTextInput'
import ThemedButton from '../../components/ThemedButton'
import { Ionicons } from '@expo/vector-icons'
import { instructions } from '../../constants/instructions'
import ResultsDisplay from '../../components/Results'

const calculator = () => {

  const instruction = instructions.calcTips

  const tips = instructions.calcInstructions

  const [currentCwa, setCurrentcwa] = useState('');
  const [previousCredit, setPreviouscredit] = useState('');
  const [semesterCredit, setSemestercredit] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const generateProjectedCwa = (stch, pcwa, ptch) => {
    const results = [];
    for (let rswa = 0; rswa <= 100; rswa += 0.01) {
      const projectedCwa = ((rswa * stch) + (pcwa * ptch)) / (ptch + stch);
      results.push({
        rswa: parseFloat(rswa.toFixed(2)),
        projectedCwa: parseFloat(projectedCwa.toFixed(2)),
      });
    }
    return results;
  };

  const handleCalculate = () => {
    const prev = parseFloat(currentCwa);
    const prevCredits = parseFloat(previousCredit);
    const semCredits = parseFloat(semesterCredit);

    if (isNaN(prev) || isNaN(prevCredits) || isNaN(semCredits)) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for all fields.');
      return;
    }

    const calcResults = generateProjectedCwa(semCredits, prev, prevCredits);
    setResults(calcResults);
    setShowResults(true);
  };

  const handleBack = () => setShowResults(false);

  const handleSaveToHistory = () => {
    Alert.alert('Saved', 'Projections saved to history!');
  };

  if (showResults) {
    return (
      <ResultsDisplay
        results={results}
        currentCwa={currentCwa}
        previousCredit={previousCredit}
        semesterCredit={semesterCredit}
        onBack={handleBack}
        onSaveToHistory={handleSaveToHistory}
        isProjectionMode={true}
      />
    );
  }

  return (
    
    <ScrollView contentContainerStyle={{ paddingBottom:0 }}>
   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
   <ThemedView safe={true} style={styles.container}>
      <Spacer/>
      <ThemedText title style={styles.title}>
        GradePoint
      </ThemedText>
      <ThemedText style={{textAlign:'center',color:'#4B5563'}}>Calculate your possible Cwa</ThemedText>
      <Spacer/>

      <ThemedCard style={styles.Card}>
      <ThemedTextInput
        label="Current CWA"
        placeholder="Enter your current CWA (e.g. 65.00)"
        keyboardType ="numeric"
        style={styles.input}
        placeholderTextColor={'#9CA3AF'}
        onChangeText={setCurrentcwa}
        value={currentCwa}
      />
      <ThemedText style={{fontSize:12}}>Range 0.00 - 100</ThemedText>
      <Spacer height={30}/>
      <ThemedTextInput
        label=" Previous Credit Hours"
        placeholder="Enter total credit hours completed "
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor={'#9CA3AF'}
        onChangeText={setPreviouscredit}
        value={previousCredit}
      />
      <ThemedText style={{fontSize:12}}>Total credit hours so far</ThemedText>
      <Spacer height={30}/>
      <ThemedTextInput
        label=" Semester Credit Hours"
        placeholder="Enter semesters credit hours  "
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor={'#9CA3AF'}
        onChangeText={setSemestercredit}
        value={semesterCredit}
      />
      <ThemedText style={{fontSize:12}}>Credit hours for ongoing semester</ThemedText>
      <Spacer height={30}/>
      <ThemedButton style={styles.btn} onPress={handleCalculate}>
        Calculate Possible CWA
      </ThemedButton>
      </ThemedCard>
      <Spacer height={30}/>
      <ThemedCard>
        <ThemedText title style={{fontSize:18,}}>
         {instruction.title}
        </ThemedText>
        <Spacer height={10}/>
          {instruction.body.map((instruction, index) => (
                    <View key={index}>
                      <View style={styles.tipContainer}>
                        <Ionicons name={instruction.icon} size={15.59} color={'#4A90E2'} style={{marginLeft:-10}}/>
                        <ThemedText style={styles.tip}>{instruction.text}</ThemedText>
                      </View>
                      <Spacer height={12} />
                    </View>
                  ))}
      </ThemedCard>
      <Spacer height={16}/>
      <ThemedCard>
       <ThemedText title style={{fontSize:18,}}>
          {tips.title}
        </ThemedText>
        <Spacer height={10}/>
          {tips.body.map((tips, index) => (
                    <View key={index}>
                      <View style={styles.tipContainer}>
                        <Ionicons name='star-outline' color={'#4A90E2'} size={15.95} style={{marginLeft:-10}}/>
                        <ThemedText style={styles.tip}>{tips}</ThemedText>
                      </View>
                      <Spacer height={12} />
                    </View>
          ))}
      </ThemedCard>
      <Spacer height={30}/>
      <ThemedText style={{textAlign:'center',fontSize:12,}}>This is an estimation tool final CWA may vary based on actual grades </ThemedText>
    </ThemedView>
   </TouchableWithoutFeedback>
    </ScrollView>
  )
}

export default calculator

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 5,
  },
  form: {
    width: '100%',
  },
  input: {
    width: 300,
    height:50,
    borderRadius: 8,
    borderWidth:1,
    borderColor:'#E5E7EB',
    backgroundColor:'transparent',
    padding: 14,
  },
  btn:{
    width:300,
    height:56,
    borderRadius: 8,
    paddingVertical:15,
  },
  Card:{
    borderRadius: 12,
    padding: 20,
    backgroundColor: 'transparent',
    borderWidth:2,
    borderRadius:12,
    borderColor:'#F3F4F6',
  },
  tipContainer:{
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal:4,
  }
})
