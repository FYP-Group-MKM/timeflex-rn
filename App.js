import React from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { connect } from 'react-redux';
import HomeScreen from './screens/HomeScreen';

const Drawer = createDrawerNavigator();

const App = (props) => {
    const routes = ['week', '3days', 'day'].map(mode => {
        const renderScreen = ({ navigation }) => <HomeScreen navigation={navigation} mode={mode} />
        let name;
        if (mode === 'day') name = 'Days';
        if (mode === '3days') name = '3 Days';
        if (mode === 'week') name = 'Week';
        return <Drawer.Screen key={mode} name={name} component={renderScreen} />;
    });

    return (
        <NavigationContainer>
            <ExpoStatusBar style='auto' />
            <Drawer.Navigator>
                {routes}
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

const mapStateToProps = (state) => ({
    currentDate: state.calendar.currentDate,
});

export default connect(mapStateToProps)(App);