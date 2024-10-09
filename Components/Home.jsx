import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/FontAwesome5";
export default function Home({ navigation }) {
  const onPressUserPage = () => {
    navigation.navigate("User-Profile")
  }
  const onPressFoodPage = () => {
    navigation.navigate("Food")
  }
  const onPressStudentPage = () => {
    navigation.navigate("Student")
  }
  const onPressAddStudentPage = () => {
    navigation.navigate("AddStudent")
  }
  return (
    <View>
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.homeOption}>
        <Icon name="home" size={50} color="#4a7c59" />
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressFoodPage} style={styles.homeOption}>
        <Icon name="hamburger" size={50} color="#4a7c59" />
        <Text>Food</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressUserPage} style={styles.homeOption}>
        <Icon
          name="user-alt"
          size={50}
          color="#4a7c59"
        />
        <Text>User</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressStudentPage} style={styles.homeOption}>
        <Icon name="user-graduate" size={50} color="#4a7c59" />
        <Text>Students</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressAddStudentPage} style={styles.homeOption}>
        <Icon name="user-plus" size={50} color="#4a7c59" />
        <Text>Add Student</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressStudentPage} style={styles.homeOption}>
        <Icon name="user-graduate" size={50} color="#4a7c59" />
        <Text>Students</Text>
      </TouchableOpacity>
    </View>

  
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row", // or "column" based on how you want items to flow
    flexWrap: "wrap", // Enables wrapping of items
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
});
