import React, { useState, useEffect, useRef } from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import { connect } from 'react-redux';
import { setUser } from './actions';

import HomeScreen from './screens/HomeScreen';
import LogoutScreen from './screens/LogoutScreen';
import LoginScreen from './screens/LoginScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

const App = (props) => {
    useEffect(() => {
        AsyncStorage.getItem('timeflexUser')
            .then(user => { if (user) props.setUser(JSON.parse(user)) })
            .catch(error => console.log(error));
    }, []);

    const routes = ['week', '3days', 'day'].map(mode => {
        const renderScreen = ({ navigation }) => <HomeScreen navigation={navigation} mode={mode} />
        let name;
        if (mode === 'day') name = 'Days';
        if (mode === '3days') name = '3 Days';
        if (mode === 'week') name = 'Week';
        return <Drawer.Screen key={mode} name={name} component={renderScreen} />;
    });

    return props.user.googleId ?
        <NavigationContainer >
            <ExpoStatusBar style='auto' />
            <Drawer.Navigator>
                {routes}
                <Drawer.Screen name='Logout' component={LogoutScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
        : <LoginScreen />;
};

const mapStateToProps = (state) => ({
    user: state.data.user,
});

const mapDispatchToProps = (dispatch) => ({
    setUser: (user) => dispatch(setUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);