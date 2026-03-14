import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const ExpenseItem = ({ category, amount, date }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={styles.amount}>${amount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2, // for Android shadow
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});

export default ExpenseItem;