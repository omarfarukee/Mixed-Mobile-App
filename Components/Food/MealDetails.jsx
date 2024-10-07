import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";

export default function MealDetails({ route }) {
  const { mealId } = route.params; // Get the mealId from route parameters
  const [mealDetails, setMealDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMealDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        setMealDetails(data.meals[0]);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchMealDetails();
  }, [mealId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#245501" style={styles.loader}/>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {mealDetails && (
        <>
          <Image
            source={{ uri: mealDetails.strMealThumb }}
            style={styles.image}
          />
          <Text style={styles.title}>{mealDetails.strMeal}</Text>
          <Text style={styles.subtitle}>Category: {mealDetails.strCategory}</Text>
          <Text style={styles.subtitle}>Area: {mealDetails.strArea}</Text>
          <Text style={styles.instructions}>{mealDetails.strInstructions}</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 5,
  },
  instructions: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
