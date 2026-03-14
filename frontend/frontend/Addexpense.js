import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../constants/Colors';
import api from '../services/api';

const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Other'];

const AddExpenseScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Validation and API call
  const handleSaveExpense = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount.');
      return;
    }
    if (!category) {
      Alert.alert('Validation Error', 'Please select a category.');
      return;
    }

    // Prepare payload
    const expenseData = {
      amount: parseFloat(amount),
      category,
      date: date.toISOString().split('T')[0],
      notes,
    };

    try {
      const response = await api.post('/expenses', expenseData);
      if (response.data.success) {
        Alert.alert('Success', 'Expense saved successfully!');
        navigation.goBack(); // Navigate back to Dashboard
      } else {
        Alert.alert('Error', 'Failed to save expense.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong while saving expense.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Expense</Text>

      {/* Amount Input */}
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Category Input */}
      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              category === cat && { backgroundColor: Colors.primary },
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                category === cat && { color: Colors.white },
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Picker */}
      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {/* Notes Input */}
      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Add notes (optional)"
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.button} onPress={handleSaveExpense}>
        <Text style={styles.buttonText}>Save Expense</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.text,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  categoryText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default AddExpenseScreen;s