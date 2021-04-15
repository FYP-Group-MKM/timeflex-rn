import React, { useState, useEffect, useRef } from 'react';
import { Button, View } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import { connect } from 'react-redux';
import { fetchAppointments, setUser } from './actions';

import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser';

import HomeScreen from './screens/HomeScreen';
import LogoutScreen from './screens/LogoutScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

const App = (props) => {
    useEffect(() => {
        AsyncStorage.getItem('timeflexUser')
            .then(user => props.setUser(JSON.parse(user)))
            .then(props.fetchAppointments());
    }, []);

    const handleRedirect = async event => {
        WebBrowser.dismissBrowser();
    };

    const handleOAuthLogin = async () => {
        let redirectUrl = await Linking.getInitialURL();
        Linking.addEventListener('url', handleRedirect);
        try {
            let authResult = await WebBrowser.openAuthSessionAsync(`https://timeflex-web.herokuapp.com/expo-auth/google`, redirectUrl);
            const userURIComponent = authResult.url.replace('exp://exp.host/@darren1208/timeflex-rn/', '');
            const userJSON = decodeURIComponent(userURIComponent);
            await AsyncStorage.setItem('timeflexUser', userJSON)
                .then(props.setUser(JSON.parse(userJSON)))
                // .then(props.fetchAppointments())
                .catch(error => console.log(error));
        } catch (err) {
            console.log('ERROR:', err);
        }
        Linking.removeEventListener('url', handleRedirect);
    };

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
        : <SafeAreaView>
            <Button title='login' onPress={handleOAuthLogin}>Login</Button>
        </SafeAreaView >;
};

const mapStateToProps = (state) => ({
    user: state.data.user,
});

const mapDispatchToProps = (dispatch) => ({
    setUser: (user) => dispatch(setUser(user)),
    fetchAppointments: () => dispatch(fetchAppointments()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);