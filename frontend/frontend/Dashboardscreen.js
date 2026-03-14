import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ScrollView 
} from 'react-native';

// Colors for styling
const Colors = {
  primary: '#4CAF50',
  secondary: '#FFC107',
  background: '#F5F5F5',
  text: '#212121',
  white: '#FFFFFF',
};

// Dummy transactions
const recentTransactions = [
  { id: '1', title: 'Groceries', amount: 25, date: '2026-03-12' },
  { id: '2', title: 'Transport', amount: 10, date: '2026-03-12' },
  { id: '3', title: 'Coffee', amount: 5, date: '2026-03-11' },
  { id: '4', title: 'Movie', amount: 15, date: '2026-03-10' },
];

const DashboardScreen = ({ navigation }) => {
  // Calculate totals
  const totalExpenses = recentTransactions.reduce((sum, item) => sum + item.amount, 0);
  const totalBalance = 500 - totalExpenses; // Example: starting balance 500

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text style={styles.transactionAmount}>-${item.amount}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Balance & Expenses Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Total Balance</Text>
        <Text style={styles.cardValue}>${totalBalance}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Total Expenses</Text>
        <Text style={styles.cardValue}>${totalExpenses}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: Colors.primary }]} 
          onPress={() => navigation.navigate('AddExpense')}
        >
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: Colors.secondary }]} 
          onPress={() => navigation.navigate('ExpenseHistory')}
        >
          <Text style={styles.buttonText}>View History</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <FlatList
        data={recentTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        style={{ marginTop: 10 }}
      />
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3, // For Android shadow
  },
  cardLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  button: {
    flex: 0.48,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  transactionItem: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  transactionDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});

export default DashboardScreen;