import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import Colors from '../constants/Colors';

const screenWidth = Dimensions.get('window').width - 40; // adjust for padding

const AnalyticsScreen = () => {
  // Pie chart data: category spending
  const pieData = [
    { name: 'Food', amount: 200, color: '#4CAF50', legendFontColor: '#212121', legendFontSize: 14 },
    { name: 'Transport', amount: 100, color: '#FFC107', legendFontColor: '#212121', legendFontSize: 14 },
    { name: 'Shopping', amount: 150, color: '#2196F3', legendFontColor: '#212121', legendFontSize: 14 },
    { name: 'Entertainment', amount: 80, color: '#F44336', legendFontColor: '#212121', legendFontSize: 14 },
  ];

  // Bar chart data: monthly expenses
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [400, 350, 500, 450, 300, 600],
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Analytics</Text>

      {/* Pie Chart */}
      <Text style={styles.sectionTitle}>Category Spending</Text>
      <PieChart
        data={pieData}
        width={screenWidth}
        height={220}
        chartConfig={{
          color: () => Colors.primary,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      {/* Bar Chart */}
      <Text style={styles.sectionTitle}>Monthly Expenses</Text>
      <BarChart
        data={barData}
        width={screenWidth}
        height={250}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: Colors.background,
          backgroundGradientFrom: Colors.background,
          backgroundGradientTo: Colors.background,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          labelColor: () => '#212121',
        }}
        style={{ borderRadius: 12, marginVertical: 10 }}
        verticalLabelRotation={30}
      />
    </ScrollView>
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
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: Colors.text,
  },
});

export default AnalyticsScreen;