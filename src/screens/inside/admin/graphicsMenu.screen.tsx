import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'native-base';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationRoutes } from '../../../types/navigationRoutes.type';

const screenWidth = Dimensions.get('window').width;

const dataLineChart = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      strokeWidth: 2
    }
  ],
  legend: ["Rainy Days"]
};

const dataBarChart = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43]
    }
  ]
};

const dataPieChart = [
  {
    name: "Seoul",
    population: 21500000,
    color: "rgba(131, 167, 234, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Toronto",
    population: 2800000,
    color: "#F00",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Beijing",
    population: 527612,
    color: "red",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "New York",
    population: 8538000,
    color: "#ffffff",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Moscow",
    population: 11920000,
    color: "rgb(0, 0, 255)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  }
];

const dataProgressChart = {
  labels: ["Swim", "Bike", "Run"], 
  data: [0.4, 0.6, 0.8]
};

const dataContributionGraph = [
  { date: "2017-01-01", count: 1 },
  { date: "2017-01-02", count: 2 },
  { date: "2017-01-03", count: 3 },
  { date: "2017-01-04", count: 4 },
  { date: "2017-01-05", count: 5 },
  { date: "2017-01-06", count: 2 },
  { date: "2017-01-07", count: 3 },
  { date: "2017-01-08", count: 4 },
  { date: "2017-01-09", count: 4 },
  { date: "2017-01-10", count: 4 },
  { date: "2017-01-11", count: 4 }
];

const GraphicsMenuScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gráficos</Text>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Line Chart</Text>
        <LineChart
          data={dataLineChart}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
        />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Bar Chart</Text>
        <BarChart
          data={dataBarChart}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          yAxisLabel="$"
          yAxisSuffix="k"
        />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Pie Chart</Text>
        <PieChart
          data={dataPieChart}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Progress Chart</Text>
        <ProgressChart
          data={dataProgressChart}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
        />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Contribution Graph</Text>
        <ContributionGraph
          values={dataContributionGraph}
          endDate={new Date("2017-04-01")}
          numDays={105}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          tooltipDataAttrs={() => ({ fill: 'black' })}
        />
      </View>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, 
  barPercentage: 0.5,
  useShadowColorFromDataset: false
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  chartContainer: {
    marginBottom: 30,
    alignItems: 'center'
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  }
});

export default GraphicsMenuScreen;
