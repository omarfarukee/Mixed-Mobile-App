import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
export default function AddStudent() {
  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
    class: "",
    division: "",
    roll: "",
    address1: "",
  });
  const [selectedImage, setSelectedImage] = useState(null); // To store the base64 image
  const [uploading, setUploading] = useState(false); // For the loader

  const handleInputChange = (key, value) => {
    setStudent((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true, // Use base64 to upload to Imgur
    });

    if (
      !pickerResult.canceled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      const base64Image = pickerResult.assets[0].base64;
      setSelectedImage(base64Image); // Store base64 image
    } else {
      Alert.alert("No image selected!");
    }
  };

  const handleSubmit = async () => {
    const { firstName, lastName, class: studentClass, division, roll, address1 } = student;
  
    // Validate that all fields and the image are filled out
    if (!firstName || !lastName || !studentClass || !division || !roll || !address1 || !selectedImage) {
      Alert.alert("Error", "Please fill out all fields and select an image.");
      return;
    }
  
    try {
      setUploading(true);
  
      // Upload image to Imgur
      const clientID = "a723e0ed7f90e75"; // Imgur Client ID
      const response = await axios.post(
        "https://api.imgur.com/3/image",
        {
          image: selectedImage,
          type: "base64", // Base64 image upload
        },
        {
          headers: {
            Authorization: `Client-ID ${clientID}`,
          },
        }
      );
  
      const imageUrl = response.data.data.link; // Imgur URL of the uploaded image
  
      // Send student data along with the Imgur image URL
      const studentResponse = await fetch(
        "https://resolute-school-server.vercel.app/students",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...student,
            image: imageUrl, // Include the uploaded image URL in the student data
          }),
        }
      );
  
      const data = await studentResponse.json();
      setUploading(false);
  
      if (data.insertedId) {
        Alert.alert("Success", "Student added successfully!");
        // Reset form after success
        setStudent({
          firstName: "",
          lastName: "",
          class: "",
          division: "",
          roll: "",
          address1: "",
        });
        setSelectedImage(null);
      } else {
        Alert.alert("Error", "Failed to add student.");
      }
    } catch (error) {
      setUploading(false);
      console.error(error);
      Alert.alert("Error", "Something went wrong.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Student</Text>

<View style={{ flexDirection: "row",
    marginBottom: 16,
    gap: 6,}}>
   <TextInput
        placeholder="First Name"
        value={student.firstName}
        onChangeText={(text) => handleInputChange("firstName", text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Last Name"
        value={student.lastName}
        onChangeText={(text) => handleInputChange("lastName", text)}
        style={styles.input}
      />
</View>
     
      <View style={styles.pickerContainer}>
        {/* Class Picker */}
        <Picker
          selectedValue={student.class}
          onValueChange={(value) => handleInputChange("class", value)}
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

        {/* Division Picker */}
        <Picker
          selectedValue={student.division}
          onValueChange={(value) => handleInputChange("division", value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Division" value="" />
          {["A", "B", "C", "D", "E"].map((div) => (
            <Picker.Item key={div} label={div} value={div} />
          ))}
        </Picker>
      </View>
      <View style={{ flexDirection: "row",
    marginBottom: 16,
    gap: 6,}}>
      <TextInput
        placeholder="Roll"
        value={student.roll}
        onChangeText={(text) => handleInputChange("roll", text)}
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Address"
        value={student.address1}
        onChangeText={(text) => handleInputChange("address1", text)}
        style={styles.input}
      />
      </View>
      <TouchableOpacity
        onPress={pickImage}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          padding: 10,
          borderRadius: 5,
          backgroundColor: "#28652e",
          color: "#fff",
          justifyContent: "center",
        }}
      >
        <Icon name="image-plus" size={30} color="#fff" />
        <Text style={{ fontSize: 25, color: "#fff" }}>Image</Text>
      </TouchableOpacity>

      {selectedImage && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${selectedImage}` }}
          style={styles.image}
        />
      )}

      <TouchableOpacity
        style={[styles.button, uploading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={uploading}
      >
        {uploading ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text>Adding Student...</Text>
            <ActivityIndicator size="large" color="#245501" />
          </View>
        ) : (
          <View style={{flexDirection:"row", alignItems:"center", gap:10}}>
            <Text style={styles.buttonText}>Add Student</Text>
            <Icon name="plus-box-multiple-outline" size={30} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop:50
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "green",
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    width:180
  },
  pickerContainer: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 6,
  },
  picker: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 5,
    padding: 10,
    width: 180,
    backgroundColor: "#D1FFBD",
  },
  image: {
    width: 300,
    height: 200,
    marginTop: 16,
    alignSelf: "center",
    borderRadius:20
  },
  button: {
    backgroundColor: "#28652e",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#D1FFBD",
  },
});
