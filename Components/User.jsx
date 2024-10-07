import React from "react";
import { View, Text, StyleSheet , Button, Image, TouchableOpacity } from "react-native";
import { GetUser } from "../Hooks/GetUser";
import auth from '@react-native-firebase/auth';
import Icon from "react-native-vector-icons/MaterialIcons";

export default function User() {
    const { user, initializing } = GetUser(); // Use the custom hook
    if (initializing) {
        // You can show a loading screen or loader here
        return (
          <View style={styles.container}>
            <Text>Loading...</Text>
          </View>
        );
      }
  return (
    <View style={styles.userContainer}>
      <Image source={require('../assets/userpic.jpg')} style={{width:200,   height:200, borderRadius:50, marginTop:50}} />
      <Text style={{fontSize:25, marginTop:20}}>{user?.email}</Text>
      <TouchableOpacity style={styles.button}
        title="Logout"
        onPress={() => {
          auth().signOut();
        }}
      >
        <Text style={{color:"#fff", fontSize:25}}>Log-out</Text>
        <Icon name="logout" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
   userContainer:{
    padding:50,
    flexDirection:"column",
    alignItems:"center"
   },
   button:{
    backgroundColor: '#245501',
    padding:8,
    borderRadius:8,
    alignItems:"center",
    flexDirection:"row",
    justifyContent:"center",
    gap:10,
    width:200,
    marginTop:20
   }
  });
