import React from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import Appbar from './components/Appbar';
import Drawer from './components/Drawer';

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

const App = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ExpoStatusBar style="auto" />
            <Appbar />
            <Drawer />
            <Calendar events={events} date={new Date()} mode='week' height={1} />
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