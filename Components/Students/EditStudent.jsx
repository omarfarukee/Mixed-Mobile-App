import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const EditStudent = ({ route, navigation }) => {
  const { StudentsId } = route.params;
  const [StudentsDetails, setStudentsDetails] = useState({
    firstName: "",
    lastName: "",
    class: "",
    division: "",
    roll: "",
    address1: "",
  });
  const [originalDetails, setOriginalDetails] = useState(null); // To store original data for comparison
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // Loader for update button

  useEffect(() => {
    const fetchStudentsDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://resolute-school-server.vercel.app/students/${StudentsId}`
        );
        const data = await response.json();
        setStudentsDetails(data[0]); // Set the fetched data as initial state
        setOriginalDetails(data[0]); // Save original data for comparison
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchStudentsDetails();
  }, [StudentsId]);

  const handleChange = (key, value) => {
    setStudentsDetails((prevDetails) => ({
      ...prevDetails,
      [key]: value,
    }));
  };
const handleUpdate = async () => {
    if (JSON.stringify(StudentsDetails) === JSON.stringify(originalDetails)) {
      Alert.alert("No Changes", "You haven't updated any information.");
      return;
    }
  
    try {
      setUpdating(true);
      const response = await fetch(
        `https://resolute-school-server.vercel.app/studentsEdit/${StudentsId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(StudentsDetails),
        }
      );
      const data = await response.json();
      setUpdating(false);
      if (data.modifiedCount > 0) {
        Alert.alert("Success", "Student information updated successfully");
        navigation.navigate("StudentDetails", { StudentsId, refresh: true });
      }
    } catch (error) {
      console.error("Update error:", error);
      setUpdating(false);
      Alert.alert("Error", "Failed to update student information");
    }
  };
  

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#245501" style={styles.loader} />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Update {StudentsDetails.firstName} {StudentsDetails.lastName}'s Info
      </Text>

      <Image source={{ uri: StudentsDetails.image }} style={styles.image} />

      <View style={styles.inputContainer}>
        <View style={{ width: 180 }}>
          <Text>First Name</Text>
          <TextInput
            onChangeText={(text) => handleChange("firstName", text)}
            value={StudentsDetails.firstName}
            placeholder="First Name"
            style={styles.input}
          />
        </View>
        <View style={{ width: 180 }}>
          <Text>Last Name</Text>
          <TextInput
            onChangeText={(text) => handleChange("lastName", text)}
            value={StudentsDetails.lastName}
            placeholder="Last Name"
            style={styles.input}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={{ width: 180 }}>
          <Text>Class</Text>
          <Picker
            selectedValue={StudentsDetails.class}
            onValueChange={(value) => handleChange("class", value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Class" value="" />
            {Array.from({ length: 12 }, (_, i) => i + 1).map((cls) => (
              <Picker.Item
                key={cls}
                label={`Class ${cls}`}
                value={cls.toString()}
              />
            ))}
          </Picker>
        </View>
        <View style={{ width: 180 }}>
          <Text>Division</Text>
          <Picker
            selectedValue={StudentsDetails.division}
            onValueChange={(value) => handleChange("division", value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Division" value="" />
            {["A", "B", "C", "D", "E"].map((div) => (
              <Picker.Item key={div} label={div} value={div} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 5 }}>
        <View style={{ width: 180 }}>
          <Text>Roll</Text>
          <TextInput
            onChangeText={(text) => handleChange("roll", text)}
            value={StudentsDetails.roll}
            placeholder="Roll"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <View style={{ width: 180 }}>
          <Text>Address</Text>
        <TextInput
          onChangeText={(text) => handleChange("address1", text)}
          value={StudentsDetails.address1}
          placeholder="Address 1"
          style={styles.input}
        />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={updating ? "Updating..." : "Update"}
          onPress={handleUpdate}
          color="#245501"
        />
        {updating && (
          <ActivityIndicator
            size="small"
            color="#245501"
            style={styles.loaderInline}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#245501",
    marginBottom: 16,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "green",
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    width: 180,
  },
  picker: {
    width: 180,
    height: 50,
    borderColor: "#D1FFBD",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "#D1FFBD",
  },
  buttonContainer: {
    marginTop: 30,
    width: "70%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderInline: {
    marginLeft: 10, // Space between button text and loader
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EditStudent;
