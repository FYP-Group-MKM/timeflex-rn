import format from 'date-fns/format';
import React, { useState } from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { FAB, Portal, Appbar as PaperAppbar } from 'react-native-paper';
import { Calendar } from 'react-native-big-calendar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { connect } from 'react-redux';
import { setCurrentDate } from '../actions';

const events = [
    {
        title: 'Meeting',
        start: new Date(2021, 3, 9, 10, 0),
        end: new Date(2021, 3, 9, 10, 30),
    },
    {
        title: 'Coffee break',
        start: new Date(2021, 3, 9, 15, 45),
        end: new Date(2021, 3, 9, 16, 30),
    },
];

const HomeScreen = (props) => {
    const [fabOpen, setFabOpen] = useState(false);
    const dateString = format(props.currentDate, 'MMM yyyy');

    return (
        <SafeAreaView style={styles.container}>
            <PaperAppbar.Header style={styles.appbar}>
                <PaperAppbar.Action icon={'menu'} onPress={props.navigation.toggleDrawer} />
                <PaperAppbar.Content title={dateString} />
                <PaperAppbar.Action icon={'calendar-today'} onPress={() => setCurrentDate(new Date())} />
            </PaperAppbar.Header >
            <Calendar
                events={events}
                date={props.currentDate}
                mode={props.mode}
                height={1}
            />
            <Portal>
                <FAB.Group
                    open={fabOpen}
                    icon={fabOpen ? 'close' : 'plus'}
                    actions={[]}
                    onStateChange={() => setFabOpen(!fabOpen)}
                    onPress={() => {
                        if (fabOpen) {
                            // do something if the speed dial is open
                        }
                    }}
                />
            </Portal>
        </SafeAreaView >
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    appbar: {
        elevation: 0,
        backgroundColor: '#fff',
    },
});

const mapStateToProps = (state) => ({
    currentDate: state.calendar.currentDate,
});

export default connect(mapStateToProps)(HomeScreen);