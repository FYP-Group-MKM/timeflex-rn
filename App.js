import React, { useState, useEffect } from 'react';
import { Button, View } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { connect } from 'react-redux';
import { setUser } from './actions';

import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser';
import HomeScreen from './screens/HomeScreen';

const Drawer = createDrawerNavigator();

const App = (props) => {
    const [authResult, setAuthResult] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            await fetch('http:localhost:5000/auth/login/success', { credentials: 'include' })
                .then(res => res.json())
                .then(user => { if (user.googleId) props.setUser(user) })
        };
        fetchUser();
    }, [])

    const routes = ['week', '3days', 'day'].map(mode => {
        const renderScreen = ({ navigation }) => <HomeScreen navigation={navigation} mode={mode} />
        let name;
        if (mode === 'day') name = 'Days';
        if (mode === '3days') name = '3 Days';
        if (mode === 'week') name = 'Week';
        return <Drawer.Screen key={mode} name={name} component={renderScreen} />;
    });

    const handleRedirect = async event => {
        WebBrowser.dismissBrowser()
    }
    const handleOAuthLogin = async () => {
        // gets the app's deep link
        let redirectUrl = await Linking.getInitialURL()
        // this should change depending on where the server is running
        addLinkingListener()
        try {
            let authResult = await WebBrowser.openAuthSessionAsync(`http://localhost:5000/auth/google`, redirectUrl)
            console.log(authResult);
            setAuthResult(authResult);
        } catch (err) {
            console.log('ERROR:', err)
        }
        removeLinkingListener()
    }
    const addLinkingListener = () => {
        Linking.addEventListener('url', handleRedirect)
    }
    const removeLinkingListener = () => {
        Linking.removeEventListener('url', handleRedirect)
    }

    return (
        <NavigationContainer>
            <ExpoStatusBar style='auto' />
            {authResult?.type === 'success' ? <Drawer.Navigator>
                {routes}
            </Drawer.Navigator> : <SafeAreaView>
                <Button title='login' onPress={handleOAuthLogin}>Login</Button>
            </SafeAreaView >}
        </NavigationContainer>
    );
};

const mapStateToProps = (state) => ({
    currentDate: state.calendar.currentDate,
    user: state.data.user,
});

const mapDispatchToProps = (dispatch) => ({
    setUser: (user) => dispatch(setUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);