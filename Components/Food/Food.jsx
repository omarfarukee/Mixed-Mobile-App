import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Food({ navigation }) {
  const [meals, setMeals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=beef");
        const data = await response.json();
        setMeals(data.meals);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const indexOfLastMeal = currentPage * itemsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - itemsPerPage;
  const currentMeals = meals.slice(indexOfFirstMeal, indexOfLastMeal);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(meals.length / itemsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#245501" style={styles.loader} />
      ) : (
        <>
          <ScrollView>
            {currentMeals.map((meal) => (
              <View key={meal.idMeal} style={styles.mealItem}>
                <Image
                  source={{ uri: meal.strMealThumb }}
                  style={{ width: 350, height: 200, borderRadius: 20 }}
                />
                <Text style={styles.mealTitle}>{meal.strMeal}</Text>
                <Text>Category: {meal.strCategory}</Text>
                <Text>Area: {meal.strArea}</Text>

                {/* TouchableOpacity for "See Details" */}
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => navigation.navigate('MealDetails', { mealId: meal.idMeal })}
                >
                  <Text style={styles.detailsButtonText}>See Details</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Pagination Controls */}
          <View style={styles.pagination}>
            <TouchableOpacity onPress={handlePreviousPage} disabled={currentPage === 1}>
              <Icon name="chevron-left" size={30} color={currentPage === 1 ? "#ccc" : "#000"} />
            </TouchableOpacity>

            <Text style={styles.pageNumber}>{currentPage}</Text>

            <TouchableOpacity
              onPress={handleNextPage}
              disabled={currentPage === Math.ceil(meals.length / itemsPerPage)}
            >
              <Icon
                name="chevron-right"
                size={30}
                color={currentPage === Math.ceil(meals.length / itemsPerPage) ? "#ccc" : "#000"}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  mealItem: {
    marginBottom: 20,
    alignItems: "center",
    borderRadius: 10,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  pageNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsButton: {
    marginTop: 10,
    backgroundColor: "#245501",
    padding: 10,
    borderRadius: 5,
  },
  detailsButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
