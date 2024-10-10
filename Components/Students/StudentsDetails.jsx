import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
export default function StudentDetails({ route, navigation }) {
  const { StudentsId } = route.params;
  const [StudentsDetails, setStudentsDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentsDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://resolute-school-server.vercel.app/students/${StudentsId}`
        );
        const data = await response.json();
        setStudentsDetails(data[0]);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchStudentsDetails();
    const unsubscribe = navigation.addListener("focus", () => {
      const { refresh } = route.params || {};
      if (refresh) {
        fetchStudentsDetails();
      }
    });
    return unsubscribe;
  }, [StudentsId, navigation, route.params]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#245501" style={styles.loader} />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {StudentsDetails && (
        <>
          <Image source={{ uri: StudentsDetails.image }} style={styles.image} />
          <Text style={styles.title}>
            Name: {StudentsDetails.firstName} {StudentsDetails.lastName}
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={styles.subtitle}>Class: {StudentsDetails.class}</Text>
            <Text style={styles.subtitle}>
              Class: {StudentsDetails.division}
            </Text>
            <Text style={styles.subtitle}>Roll: {StudentsDetails.roll}</Text>
          </View>
          <Text style={styles.address}>
            Address: {StudentsDetails?.address1}
          </Text>
          <View style={{ flexDirection: "row", gap: 20, marginTop: 20 }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("EditStudent", {
                  StudentsId: StudentsDetails?._id,
                })
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                padding: 10,
                borderRadius: 5,
                backgroundColor: "#28652e",
                color: "#fff",
              }}
            >
              <Icon name="user-edit" size={30} color="#fff" />
              <Text style={{ fontSize: 25, color: "#fff" }}>Edit</Text>
            </TouchableOpacity>
          </View>
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
  address: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "700",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
