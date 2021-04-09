import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { connect } from 'react-redux';
import SimpleEventForm from './SimpleEventForm';

const Tab = createMaterialTopTabNavigator();
function HomeScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home!</Text>
        </View>
    );
}
function SettingsScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Settings!</Text>
        </View>
    );
}
const AppointmentForm = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Simple Event" component={SimpleEventForm} />
            <Tab.Screen name="Smart Planning" component={SettingsScreen} />
            <Tab.Screen name="Class" component={SettingsScreen} />
        </Tab.Navigator>
    );
};

const mapStateToProps = (state) => ({
    currentDate: state.calendar.currentDate,
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    }
});


export default connect(mapStateToProps)(AppointmentForm);
