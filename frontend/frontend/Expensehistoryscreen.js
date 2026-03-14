import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import ExpenseItem from '../components/ExpenseItem';
import Colors from '../constants/Colors';
import api from '../services/api'; // Axios instance

const ExpenseHistoryScreen = () => {
  const [expenses, setExpenses] = useState([]);

  // Fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses'); // API endpoint
      if (response.data.success) {
        setExpenses(response.data.expenses);
      } else {
        console.log('No expenses found');
      }
    } catch (error) {
      console.log('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense History</Text>
      {expenses.length === 0 ? (
        <Text style={styles.noData}>No expenses found.</Text>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ExpenseItem
              category={item.category}
              amount={item.amount}
              date={item.date}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
  },
  noData: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
    fontSize: 16,
  },
});

export default ExpenseHistoryScreen;