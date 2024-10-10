import React from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'

export default function Info() {
  return (
    <View style={styles.info}>
      <Text style={{ fontSize: 50, fontWeight:500 }}>This page is</Text>
      <Image
        source={{ uri: "https://cdn.shopify.com/s/files/1/2132/5055/files/underconstruction.gif?v=1526071974" }} 
        style={styles.image}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  info: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#fff"
  },
  image: {
    width: 400, 
    height: 400, 
    resizeMode: "cover"
  }
});
