import React from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import Appbar from './components/Appbar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';


const events = [
    {
        title: 'Meeting',
        start: new Date(2021, 3, 9, 10, 0),
        end: new Date(2021, 3, 9, 10, 30),
    },
    {
        title: 'Coffee break',
        start: new Date(2021, 3, 9, 15, 45),
        end: new Date(2021, 3, 9, 16, 30),
    },
];

const Drawer = createDrawerNavigator();

const App = () => {
    const renderHomeScreen = ({ navigation }) => {
        return <HomeScreen navigation={navigation} />;
    };

    return (
        <SafeAreaView style={styles.container}>
            <NavigationContainer>
                <Drawer.Navigator initialRouteName="week">
                    <Drawer.Screen name="week" component={renderHomeScreen} />
                </Drawer.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
});

export default App;