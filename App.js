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
import {db,createTable, resetTable} from './db'
import { fetchAppointments } from './actions';
import * as sqlite from 'expo-sqlite';
import {setCurrentDate} from './actions'

const Drawer = createDrawerNavigator();

const App = (props) => {
    const [authResult, setAuthResult] = useState({});
    //When appointment is finish then no need the appointment any more and can directly retrive from redux
    const [appointment,setAppointment] = useState(null)
    const fectchData = (db) => {
        db.transaction(tx => {
          tx.executeSql('select * from appointment', null, (_, {rows: { _array }}) =>
              setAppointment(_array), () => console.log('error')
          );
      })
     }
    
    //when open the app see the component have SQL or not
    useEffect(() => {
        const initialization = () => {
            //Reset Table will be delete after Testing
            resetTable(db);
            createTable(db);
            //This will get the appoibntment from the Local Database 
            //It will return a array with an object
            fectchData(db);
            //Then upload the appointment to the redux state
            // props.setAppointment(appointment)
            
        }
        initialization();
    },[]);

    const handleRedirect = async event => {
        WebBrowser.dismissBrowser();
    }
    const handleOAuthLogin = async () => {
        let redirectUrl = await Linking.getInitialURL();
        Linking.addEventListener('url', handleRedirect);
        try {
            // let authResult = await WebBrowser.openAuthSessionAsync(`http://localhost:5000/expo-auth/google`, redirectUrl);
            let authResult = await WebBrowser.openAuthSessionAsync(`https://timeflex-web.herokuapp.com/expo-auth/google`, redirectUrl);
            const userURIComponent = authResult.url.replace('exp://exp.host/@darren1208/timeflex-rn/', '');
            const userJSON = decodeURIComponent(userURIComponent);
            const user = JSON.parse(userJSON);
            props.setUser(user);
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
            {props.user.googleId ? <Drawer.Navigator>
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
      appointments: state.data.appointments,
});

const mapDispatchToProps = (dispatch) => ({
    setCurrentDate: (date) => dispatch(setCurrentDate(date)),
    setUser: (user) => dispatch(setUser(user)),
    // setAppointment: (appointment) => dispatch()
});

export default connect(mapStateToProps,mapDispatchToProps)(App);