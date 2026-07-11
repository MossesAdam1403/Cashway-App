import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from "react";
import {
  registerForPushNotifications,
  setupNotificationListener
} from "../config/notification";

export default function RootLayout() {

  useEffect(() => {
    registerForPushNotifications();
    setupNotificationListener();
  }, []);
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}