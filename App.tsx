import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from './src/Navigation/RootNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator></RootNavigator>
    </NavigationContainer>
  );
}
