import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Student({ navigation }) {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://resolute-school-server.vercel.app/students");
        const data = await response.json();
        // console.log("API Data:", data);
        setStudents(data); // Check if data.students exists
        setLoading(false);
        
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);
  console.log(students)

  const indexOfLastStudents = currentPage * itemsPerPage;
  const indexOfFirstStudents = indexOfLastStudents - itemsPerPage;
  const currentStudents = students?.slice(indexOfFirstStudents, indexOfLastStudents);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(students?.length / itemsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
console.log(currentStudents)
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#245501" style={styles.loader} />
      ) : (
        <>
          <ScrollView>
            {currentStudents?.map((Students) => (
              <View key={Students?._id} style={styles.StudentsItem}>
                <Image
                  source={{ uri: Students?.image }}
                  style={{ width: 350, height: 200, borderRadius: 20 }}
                />
                <Text>Name: {Students?.firstName} {Students?.lastName}</Text>

                {/* TouchableOpacity for "See Details" */}
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => navigation.navigate('StudentDetails', { StudentsId: Students?._id })}
                ><Icon name="remove-red-eye" size={30} color={currentPage === 1 ? "#ccc" : "#000"} />
                  <Text style={styles.detailsButtonText}> See Details</Text>
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
              disabled={currentPage === Math.ceil(students?.length / itemsPerPage)}
            >
              <Icon
                name="chevron-right"
                size={30}
                color={currentPage === Math.ceil(students?.length / itemsPerPage) ? "#ccc" : "#000"}
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
  StudentsItem: {
    marginBottom: 20,
    alignItems: "center",
    borderRadius: 10,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  StudentsTitle: {
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
    flexDirection:"row",
    alignItems:"center"
  },
  detailsButtonText: {
    color: "#fff",
    fontWeight: "bold",
    
  },
});
