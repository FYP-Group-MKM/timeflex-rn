import React, { useState, useEffect } from 'react';
import { Button, View } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import { connect } from 'react-redux';
import { fetchAppointments, setUser, setCurrentDate } from './actions';

import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser';
import HomeScreen from './screens/HomeScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

const App = (props) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        props.setUser(user);
        props.fetchAppointments();
    }, [user]);

    const handleRedirect = async event => {
        WebBrowser.dismissBrowser();
    };

    const handleOAuthLogin = async () => {
        let redirectUrl = await Linking.getInitialURL();
        Linking.addEventListener('url', handleRedirect);
        try {
            // let authResult = await WebBrowser.openAuthSessionAsync(`http://localhost:5000/expo-auth/google`, redirectUrl);
            let authResult = await WebBrowser.openAuthSessionAsync(`http://localhost:5000/expo-auth/google`, redirectUrl);
            const userURIComponent = authResult.url.replace('exp://exp.host/@darren1208/timeflex-rn/', '');
            const userJSON = decodeURIComponent(userURIComponent);
            const userObj = JSON.parse(userJSON);
            setUser(userObj);
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

    return (
        <NavigationContainer>
            <ExpoStatusBar style='auto' />
            {
                (props.user.googleId) ?
                    <Drawer.Navigator>
                        {routes}
                    </Drawer.Navigator>
                    : <SafeAreaView>
                        <Button title='login' onPress={handleOAuthLogin}>Login</Button>
                    </SafeAreaView >
            }
        </NavigationContainer>
    );
};

const mapStateToProps = (state) => ({
    currentDate: state.calendar.currentDate,
    user: state.data.user,
    appointments: state.data.appointments,
    loading: state.data.loading,
});

const mapDispatchToProps = (dispatch) => ({
    setCurrentDate: (date) => dispatch(setCurrentDate(date)),
    setUser: (user) => dispatch(setUser(user)),
    fetchAppointments: () => dispatch(fetchAppointments()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);