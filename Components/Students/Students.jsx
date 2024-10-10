import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Octicons";

export default function Student({ navigation }) {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://resolute-school-server.vercel.app/students"
      );
      const data = await response.json();
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Student",
      "Are you sure you want to delete this student?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => deleteStudent(id),
        },
      ],
      { cancelable: true }
    );
  };

  const deleteStudent = async (id) => {
    try {
      setDeleting(id); // Start loading for the delete action
      const response = await fetch(
        `https://resolute-school-server.vercel.app/students/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setDeleting(null); // Stop loading
        fetchStudents(); // Refresh the student list after deletion
      } else {
        console.error("Failed to delete the student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    } finally {
      setDeleting(null); // Ensure the loader stops
    }
  };

  const indexOfLastStudents = currentPage * itemsPerPage;
  const indexOfFirstStudents = indexOfLastStudents - itemsPerPage;
  const currentStudents = students?.slice(
    indexOfFirstStudents,
    indexOfLastStudents
  );

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

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#245501" style={styles.loader} />
      ) : (
        <>
          <ScrollView>
            {currentStudents?.map((student) => (
              <View key={student?._id} style={styles.StudentsItem}>
                <Image
                  source={{ uri: student?.image }}
                  style={{ width: 350, height: 200, borderRadius: 20 }}
                />
                <Text>
                  Name: {student?.firstName} {student?.lastName}
                </Text>
                <View style={{ flexDirection: "row", gap: 20 }}>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() =>
                      navigation.navigate("StudentDetails", {
                        StudentsId: student?._id,
                      })
                    }
                  >
                    <Icon
                      name="eye"
                      size={30}
                      color={currentPage === 1 ? "#fff" : "#fff"}
                    />
                    <Text style={styles.detailsButtonText}> See Details</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.detailsButtonDelete}
                    onPress={() => handleDelete(student?._id)}
                  >
                    {deleting === student?._id ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Icon
                          name="trash"
                          size={30}
                          color={currentPage === 1 ? "#fff" : "#fff"}
                        />
                        <Text style={styles.detailsButtonText}>Delete Student</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Pagination Controls */}
          <View style={styles.pagination}>
            <TouchableOpacity
              onPress={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <Icon
                name="chevron-left"
                size={30}
                color={currentPage === 1 ? "#ccc" : "#000"}
              />
            </TouchableOpacity>

            <Text style={styles.pageNumber}>{currentPage}</Text>

            <TouchableOpacity
              onPress={handleNextPage}
              disabled={
                currentPage === Math.ceil(students?.length / itemsPerPage)
              }
            >
              <Icon
                name="chevron-right"
                size={30}
                color={
                  currentPage === Math.ceil(students?.length / itemsPerPage)
                    ? "#ccc"
                    : "#000"
                }
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
    flexDirection: "row",
    alignItems: "center",
  },
  detailsButtonDelete: {
    marginTop: 10,
    backgroundColor: "#FAA0A0",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  detailsButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
