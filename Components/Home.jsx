import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

const { width } = Dimensions.get("window"); // To get the device width

export default function Home({ navigation }) {
  const images = [
    "https://img.freepik.com/premium-psd/student-banner-back-school-with-pencil_1146-212.jpg",
    "https://img.freepik.com/free-vector/flat-horizontal-sale-banner-template-back-school-season_23-2150548300.jpg?semt=ais_hybrid",
    "https://static.vecteezy.com/system/resources/previews/017/389/259/non_2x/school-eduacation-banner-girls-boys-student-smiling-poster-website-invitation-pupils-illustration-vector.jpg",
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);

  // Automatically change slides every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  // Scroll to the active slide when the activeIndex changes
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: activeIndex * width, animated: true });
    }
  }, [activeIndex]);

  // Manually scroll when a dot is pressed
  const handleDotPress = (index) => {
    setActiveIndex(index);
    scrollViewRef.current.scrollTo({ x: index * width, animated: true });
  };

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.homeOption}>
          <Icon name="home" size={50} color="#4a7c59" />
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Food")} style={styles.homeOption}>
          <Icon name="hamburger" size={50} color="#4a7c59" />
          <Text>Food</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("User-Profile")} style={styles.homeOption}>
          <Icon name="user-alt" size={50} color="#4a7c59" />
          <Text>User</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Student")} style={styles.homeOption}>
          <Icon name="user-graduate" size={50} color="#4a7c59" />
          <Text>Students</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("AddStudent")} style={styles.homeOption}>
          <Icon name="user-plus" size={50} color="#4a7c59" />
          <Text>Add Student</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Student")} style={styles.homeOption}>
          <Icon name="user-graduate" size={50} color="#4a7c59" />
          <Text>Students</Text>
        </TouchableOpacity>
      </View>

      {/* Image Slider */}
      <View style={styles.sliderContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const slideIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
            setActiveIndex(slideIndex);
          }}
        >
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.sliderImage} />
          ))}
        </ScrollView>

        {/* Dot Indicators */}
        <View style={styles.dotContainer}>
          {images.map((_, index) => (
            <TouchableOpacity key={index} onPress={() => handleDotPress(index)}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: index === activeIndex ? "#245501" : "#ccc" },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-around",
    paddingTop: 10,
    gap: 10,
  },
  homeOption: {
    width: 100,
    height: 100,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a1cca5",
    borderRadius: 10,
    elevation: 10,
  },
  sliderContainer: {
    height: 300, // Set height for the slider
    marginTop: 300,
    padding:16
  },
  sliderImage: {
    width: width, // Full width of the device
    height: 200,
    resizeMode: "cover",
    borderRadius:10
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
