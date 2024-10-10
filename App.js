import { StyleSheet, Text, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Home from "./Components/Home";
import { GetUser } from "./Hooks/GetUser";
import User from "./Components/User";
import Food from "./Components/Food/Food";
import MealDetails from "./Components/Food/MealDetails";
import Student from "./Components/Students/Students";
import StudentDetails from "./Components/Students/StudentsDetails";
import EditStudent from "./Components/Students/EditStudent";
import AddStudent from "./Components/Students/AddStudent";
import Info from "./Components/Info";

const Stack = createNativeStackNavigator();

export default function App() {
  const { user, initializing } = GetUser();

  if (initializing) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: "#adc178" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: "#dde5b6" },
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontWeight: "bold", fontSize: 18, color: "#fff", marginRight: 10 }}>
                {route.name}
              </Text>
              <Image
                source={require("./assets/logo2.png")}
                style={{ width: 50, height: 50, borderWidth:2, marginBottom:8 }} 
              />
            </View>
          ),
        })}
      >
        {!user ? (
          <>
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Login" component={Login} />
          </>
        ) : (
          <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="User-Profile" component={User} />
          <Stack.Screen name="Food" component={Food} />
          <Stack.Screen name="MealDetails" component={MealDetails} />
          <Stack.Screen name="Student" component={Student} />
          <Stack.Screen name="StudentDetails" component={StudentDetails} />
          <Stack.Screen name="EditStudent" component={EditStudent} />
          <Stack.Screen name="AddStudent" component={AddStudent} />
          <Stack.Screen name="Info" component={Info} />
          </>
        
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
