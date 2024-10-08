import { TextInput, View, StyleSheet, Image, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import Icon from "react-native-vector-icons/MaterialIcons";
export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State for managing the loader

  const onPressSignUp = () => {
    navigation.navigate('Signup');
  };

  const handleLogin = async () => {
    if (email && password) {
      try {
        setLoading(true);
       await auth().signInWithEmailAndPassword(email, password);
        setTimeout(() => {
          setLoading(false);
          navigation.navigate('Home');
        }, 2000);
      } catch (err) {
        setLoading(false);
        Alert.alert(err.message);
      }
    } else {
      Alert.alert('Please fill all the input fields');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#245501" />
        <Text>Logging in...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 8, flex: 1 }}>
      <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 80 }}>
        <View style={{alignItems:"center"}}>
            <Image source={require('../assets/logo.png')} style={{width:200, height:200}} />
        <Text style={{fontSize:30, fontWeight:500, color:"green"}}>Journals Login</Text>
        </View>
      </View>
      <TextInput
        onChangeText={(text) => {
          setEmail(text);
        }}
        placeholder="Email"
        style={styles.inputs}
      />
      <TextInput
        onChangeText={(text) => {
          setPassword(text);
        }}
        placeholder="Password"
        style={styles.inputs}
        secureTextEntry={true}
      />



      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={{ color: "#fff", fontSize:20 }}>Login</Text>
        <Icon name="login" size={30} color="#fff" />
      </TouchableOpacity>
      <View style={{flexDirection:"row", gap:5, alignItems:"center", justifyContent:"center", marginTop:20}}>
        <Text style={{fontSize:20}}>Already have Account ?</Text>
        <TouchableOpacity onPress={onPressSignUp}>
        <Text style={{ fontSize:20, fontWeight:800 }}>Go to sign up</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputs: {
    borderWidth: 1,
    borderColor: 'green',
    height: 60,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#245501',
    borderRadius: 8,
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
    flexDirection:"row",
    gap:10,
    justifyContent:"center"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
