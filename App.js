import React from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import Appbar from './components/Appbar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { connect } from 'react-redux';

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

const App = (props) => {
    const routes = ['day', '3days', 'week'].map(mode => {
        const renderScreen = ({ navigation }) => (
            <SafeAreaView style={styles.container}>
                <Appbar navigation={navigation} />
                <Calendar
                    events={events}
                    date={currentDate}
                    mode={mode}
                    height={1}
                />
            </SafeAreaView >
        );
        let name;
        if (mode === 'day') name = 'Days';
        if (mode === '3days') name = '3 Days';
        if (mode === 'week') name = 'Week';
        return <Drawer.Screen key={mode} name={name} component={renderScreen} />;
    });

    return (
        <NavigationContainer>
            <ExpoStatusBar style='auto' />
            <Drawer.Navigator initialRouteName="week">
                {routes}
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
});

const mapStateToProps = (state) => ({
    currentDate: state.calendar.currentDate,
});

export default connect(mapStateToProps)(App);