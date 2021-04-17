import React, { useState, useEffect, useRef } from 'react';
import { Button, View } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import { connect } from 'react-redux';
import { fetchAppointments,fetchAppointmentsSuccess, setUser, fetchCloudAppointments, fectchLocalData } from './actions';

import HomeScreen from './screens/HomeScreen';
import LogoutScreen from './screens/LogoutScreen';
import LoginScreen from './screens/LoginScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { not } from 'react-native-reanimated';

const Drawer = createDrawerNavigator();

const loadLocalAppointments = async () => {
    const mainStorageJSON = await AsyncStorage.getItem('timeflexAppointments')
    const mainStorageArray = JSON.parse(mainStorageJSON).data
    const tooAddJSON = await AsyncStorage.getItem('timeflexAppointmemntsToPost')
    const tooAddArray = JSON.parse(tooAddJSON).data
    const data = [...mainStorageArray,...tooAddArray]
    console.log('Here is the data from the loadcalAppointements',data)
    return data
}

//onlineAppointments is an array retrive from fetch 
//loxal appointmentss is an array retrive from local storage
const sych = async (onlineAppointments,localAppointments,toAdd,toDelete) => {
    //Todelete //to addd // mainStorage
    //download all the stuff from cloud download to the local storage
    const jsonOnline = onlineAppointments.map((appointment) => {
        return JSON.stringify(appointment)
    })
    const jsonLocal = localAppointments.map((appointment) => {
        return JSON.stringify(appointment)
    })

    const appointmentsAddToLocal = onlineAppointments.map((appointment) => {
        if(!(JSON.stringify(appointment) in jsonLocal) ){
            return JSON.parse(appointment)
        }
    })
    
    //Add this to local main storage
    let orginalData = []
    await AsyncStorage.getItem('timeflexAppointments')
                        .then(appointmentsJSON => { if (appointmentsJSON) return JSON.parse(appointmentsJSON).data })
                        .then(data => { if (data) orginalData = [...data] })
                        .catch(error => console.log(error))

    const updatedAppointments = [...orginalData, ... appointmentsAddToLocal];
    const appointmentsJSON = { data: updatedAppointments };
    await AsyncStorage.setItem('timeflexAppointmemnts', JSON.stringify(appointmentsJSON))

    //Send toAdd update to the server.
    const toaddArray = []
    await AsyncStorage.getItem('timeflexAppointmentsToPost')
                        .then(appointmentsJSON => { if (appointmentsJSON) return JSON.parse(appointmentsJSON).data })
                        .then(data => { if (data) toaddArray = [...data] })



    //Add 
    toaddArray.forEach( (element) => {
        await fetch('https://timeflex-web.herokuapp.com/appointments', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(element),
        credentials: 'include',
    }
    )

    }
        )

    const emptyObj = {data:[]}
    await AsyncStorage.setItem('timeflexSppointmentsToPost',JSON.stringify(emptyObj))
    



    //Send to delete request to the server



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
    changeUI:(data) => dispatch(fetchAppointmentsSuccess(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);