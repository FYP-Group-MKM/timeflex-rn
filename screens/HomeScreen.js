import format from 'date-fns/format';
import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { FAB, Portal, Appbar as PaperAppbar, TextInput, Button, Switch } from 'react-native-paper';
import { Calendar } from 'react-native-big-calendar';
import { connect } from 'react-redux';
import { setCurrentDate } from '../actions';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

import SimpleEventForm from './Forms/SimpleEventForm';

const HomeScreen = (props) => {
    const sheetRef = React.useRef(null);
    const [fabOpen, setFabOpen] = useState(false);
    const dateString = format(props.currentDate, 'MMM yyyy');

    return (
        <SafeAreaView style={styles.container}>
            <PaperAppbar.Header style={styles.appbar}>
                <PaperAppbar.Action icon={'menu'} onPress={props.navigation.toggleDrawer} />
                <PaperAppbar.Content title={dateString} />
                <PaperAppbar.Action icon={'calendar-today'} onPress={() => props.setCurrentDate(new Date())} />
            </PaperAppbar.Header >
            <Calendar
                events={props.appointments}
                date={props.currentDate}
                mode={props.mode}
                height={1}
            />
            <Portal>
                <SimpleEventForm sheetRef={sheetRef} />
                <FAB.Group
                    open={fabOpen}
                    icon={fabOpen ? 'close' : 'plus'}
                    fabStyle={styles.fab}
                    actions={[
                        {
                            icon: 'school',
                            label: 'Class',
                            onPress: () => console.log('Pressed star'),
                        },
                        {
                            icon: 'calendar-search',
                            label: 'Smart Planning',
                            onPress: () => console.log('Pressed star'),
                        },
                        {
                            icon: 'calendar-edit',
                            label: 'Simple Event',
                            onPress: () => {
                                sheetRef.current.snapTo(0);
                            },
                        },
                    ]}
                    animated
                    onStateChange={() => setFabOpen(!fabOpen)}
                    onPress={() => setFabOpen(!fabOpen)}
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
    fab: {
        backgroundColor: '#1e88e5',
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: { width: -1, height: -5 },
        shadowRadius: 3,
        shadowOpacity: 0.2,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 50,
        height: 5,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    root: {
        backgroundColor: 'white',
        padding: 16,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    row: {
        // display: 'flex',
        // flexDirection: 'row',
        // minWidth: 200,

    },
});

const mapStateToProps = (state) => ({
    currentDate: state.calendar.currentDate,
    appointments: state.data.appointments,
});

const mapDispatchToProps = (dispatch) => ({
    setCurrentDate: (date) => dispatch(setCurrentDate(date)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);