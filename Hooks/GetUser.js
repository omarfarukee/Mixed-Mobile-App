import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';

export function GetUser() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Function to handle the authentication state change
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  // useEffect to subscribe to the Firebase auth state change
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Unsubscribe on unmount
  }, []);

  return { user, initializing };
}
