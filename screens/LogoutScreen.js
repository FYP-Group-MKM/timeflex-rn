import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { ActivityIndicator, Paragraph } from 'react-native-paper';

import { connect } from 'react-redux';
import { fetchAppointments, setUser } from '../actions';

import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutScreen = (props) => {
    useEffect(() => {
        props.setUser({});
        clearAppData();
    }, []);

    const clearAppData = async () => {
        await AsyncStorage.removeItem('timeflexUser');
        await AsyncStorage.removeItem('timeflexAppointments');
    }

    return (
        <SafeAreaView style={styles.container}>
            <ActivityIndicator style={styles.indicator} />
            <Paragraph>Logging out...</Paragraph>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicator: {
        marginBottom: 15,
    }
});

const mapStateToProps = (state) => ({
    appointments: state.data.appointments,
    user: state.data.user,
});

const mapDispatchToProps = (dispatch) => ({
    setUser: (user) => dispatch(setUser(user)),
    fetchAppointments: () => dispatch(fetchAppointments()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LogoutScreen);