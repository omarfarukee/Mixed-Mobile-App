import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
export default function AddStudent() {
  const [student, setStudent] = useState({
    firstName: '',
    lastName: '',
    class: '',
    division: '',
    roll: '',
    address1: '',
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
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }
  
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true, // Use base64 to upload to Imgur
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      const base64Image = pickerResult.assets[0].base64;
      setSelectedImage(base64Image); // Store base64 image
    } else {
      Alert.alert("No image selected or an error occurred!");
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      Alert.alert('Please select an image!');
      return;
    }

    try {
      setUploading(true);

      // Upload image to Imgur
      const clientID = 'a723e0ed7f90e75';  // Replace with your Imgur Client ID
      const response = await axios.post(
        'https://api.imgur.com/3/image',
        {
          image: selectedImage,
          type: 'base64',  // Base64 image upload
        },
        {
          headers: {
            Authorization: `Client-ID ${clientID}`,
          },
        }
      );

      const imageUrl = response.data.data.link; // Imgur URL of the uploaded image

      // Now send student data along with the Imgur image URL
      const studentResponse = await fetch('https://resolute-school-server.vercel.app/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...student,
          image: imageUrl, // Include the uploaded image URL in the student data
        }),
      });

      const data = await studentResponse.json();
      setUploading(false);

      if (data.insertedId) {
        Alert.alert('Success', 'Student added successfully!');
        // Reset form after success
        setStudent({
          firstName: '',
          lastName: '',
          class: '',
          division: '',
          roll: '',
          address1: '',
        });
        setSelectedImage(null);
      } else {
        Alert.alert('Error', 'Failed to add student.');
      }
    } catch (error) {
      setUploading(false);
      console.error(error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Student</Text>

      <TextInput
        placeholder="First Name"
        value={student.firstName}
        onChangeText={(text) => handleInputChange('firstName', text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Last Name"
        value={student.lastName}
        onChangeText={(text) => handleInputChange('lastName', text)}
        style={styles.input}
      />

      {/* Class Picker */}
      <Picker
        selectedValue={student.class}
        onValueChange={(value) => handleInputChange('class', value)}
        style={styles.picker}
      >
        <Picker.Item label="Select Class" value="" />
        <Picker.Item label="Class 1" value="1" />
        <Picker.Item label="Class 2" value="2" />
        <Picker.Item label="Class 3" value="3" />
      </Picker>

      {/* Division Picker */}
      <Picker
        selectedValue={student.division}
        onValueChange={(value) => handleInputChange('division', value)}
        style={styles.picker}
      >
        <Picker.Item label="Select Division" value="" />
        <Picker.Item label="A" value="A" />
        <Picker.Item label="B" value="B" />
        <Picker.Item label="C" value="C" />
      </Picker>

      <TextInput
        placeholder="Roll"
        value={student.roll}
        onChangeText={(text) => handleInputChange('roll', text)}
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Address"
        value={student.address1}
        onChangeText={(text) => handleInputChange('address1', text)}
        style={styles.input}
      />

      <Button title="Pick an Image" onPress={pickImage} />
      {selectedImage && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${selectedImage}` }}
          style={styles.image}
        />
      )}

      <Button title={uploading ? 'Adding...' : 'Add Student'} onPress={handleSubmit} disabled={uploading} />

      {uploading && <ActivityIndicator size="large" color="#245501" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
  },
  picker: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 5,
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginTop: 16,
    alignSelf: 'center',
  },
});
