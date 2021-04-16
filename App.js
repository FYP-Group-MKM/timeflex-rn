import React, { useState, useEffect, useRef } from 'react';
import { Button, View } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import { connect } from 'react-redux';
import { fetchAppointments, setUser } from './actions';

import HomeScreen from './screens/HomeScreen';
import LogoutScreen from './screens/LogoutScreen';
import LoginScreen from './screens/LoginScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { not } from 'react-native-reanimated';

const Drawer = createDrawerNavigator();

//onlineAppointments is an array retrive from fetch 
//loxal appointmentss is an array retrive from local storage
const sych = (onlineAppointments, localAppointments) => {
    //Make the localAppointments be the string stuff
    //taget pass the local to the Exprees
    const jsonLocal = localAppointments.map((appointment) => {
        return JSON.stringify(appointment)
    })
    const jsonOnline = onlineAppointments.map((appointment) => {
        return JSON.stringify(appointment)
    })

    //if the online one not exist in local one --> store to local
    const diffToExpress = onlineAppointments.map((appointment)=> {
        if(!(JSON.stringify(appointment)  in jsonLocal)){
            return JSON.parse(appointment)
        }
        
    })
    //This array will upload to web
    const diffToLocal = localAppointments.map((appointment) => {
        if(!(JSON.stringify(appointment)  in jsonOnline)){
            return JSON.parse(appointment)    
        }
    })

    //Then upload to online
    diffToLocal.array.forEach( async(element) => {
        await fetch('https://timeflex-web.herokuapp.com/appointments', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(element),
                    credentials: 'include',
                })
    });
    //store to local array
    diffToExpress.array.forEach(async (element) => {
        await AsyncStorage.setItem('timeflexAppointments', JSON.stringify(element))
    })
    

} 

const App = (props) => {
    const [appointment,setAppointments] = useState([])

    useEffect(() => {
        AsyncStorage.getItem('timeflexUser')
            .then(user => props.setUser(JSON.parse(user)))
            .then(props.fetchAppointments());
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
    fetchAppointments: () => dispatch(fetchAppointments()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);