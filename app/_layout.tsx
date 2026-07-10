import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import "../config/firebase";
import { useEffect } from "react";
import { registerForPushNotifications } from "../config/notification";

export default function RootLayout() {

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}