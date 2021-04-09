import React,{useEffect} from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Drawer as PaperDrawer } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import Appbar from './components/Appbar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { connect } from 'react-redux';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('db.db');

const addAppointment = (appointment) =>{
    db.transaction( tx => {
        tx.executeSql(`insert into appointment (title, startdate ,enddate,description) values (${appointment.title},${appointment.startdate},${appointment.enddate},${appointment.description} )`,[], ()=> console.log('sucess'),()=>console.log('add fail'))
        tx.executeSql('select * from appointment', [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
    })
}

const events = [
    {
        title: 'Meeting',
        start: new Date(2021, 3, 9, 10, 0),
        end: new Date(2021, 3, 9, 10, 30),
        description: 'Hello'
    },
    {
        title: 'Coffee break',
        start: new Date(2021, 3, 9, 15, 45),
        end: new Date(2021, 3, 9, 16, 30),
        description: 'Hello'
    },
];

const Drawer = createDrawerNavigator();

const App = (props) => {
    // Create DB and Table for local storeage when the app start
    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                'create table if not exists appointment (id integer primary key not null, title text, startdate text, enddate text, description text);',[], () => console.log(`Create Database sucess`),()=> console.log(`Create DataBase Fail`)
            )

        })
    },[])

    const routes = ['day', '3days', 'week'].map(mode => {
        const renderScreen = ({ navigation }) => (
            <SafeAreaView style={styles.container}>
                <Appbar navigation={navigation} />
                <Calendar
                    events={events}
                    date={props.currentDate}
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

    const Home = ({ navigation }) => (
        <SafeAreaView style={styles.container}>
            <Appbar navigation={navigation} />
            <Calendar
                events={events}
                date={props.currentDate}
                mode={props.currentView}
                height={1}
            />
        </SafeAreaView >
    );

    return (
        <NavigationContainer>
            <ExpoStatusBar style='auto' />
            <Drawer.Navigator initialRouteName='TimeFlex'>
                <Drawer.Screen name='TimeFlex' component={Home} />
            </Drawer.Navigator>
            {/* <Drawer.Navigator initialRouteName="week">
                {routes}
            </Drawer.Navigator> */}
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
    currentView: state.calendar.currentView,
});

export default connect(mapStateToProps)(App);