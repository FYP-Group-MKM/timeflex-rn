import format from 'date-fns/format';
import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { FAB, Portal, Appbar as PaperAppbar } from 'react-native-paper';
import { Calendar } from 'react-native-big-calendar';
import { connect } from 'react-redux';
import { setCurrentDate, fetchAppointments, setUser, mutateAppointments } from '../actions';

import SimpleEventForm from './Forms/SimpleEventForm';
import SmartPlanningForm from './Forms/SmartPlanningForm';
import EditEventForm from './Forms/EditEventForm'

import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = (props) => {
    const simpleEventFormRef = React.useRef(null);
    const smartPlanningFormRef = React.useRef(null);
    const eventFormRef = React.useRef(null);
    const [fabOpen, setFabOpen] = useState(false);
    const [eventPressed, setEvent] = useState({});
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);

    const dateString = format(props.currentDate, 'MMM yyyy');

    useEffect(() => {
        let isMounted = true;
        fetchAppointments();
        return () => isMounted = false;
    }, []);

    const checkInternetReachable = async () => await NetInfo.fetch().then(state => state.isInternetReachable);

    const fetchAppointments = async () => {
        if (!checkInternetReachable()) {
            await fetch('https://timeflex-web.herokuapp.com/appointments/' + props.user.googleId)
                .then(res => res.json())
                .then(res => setAppointments(res))
                .catch(error => console.log(error))
        } else {
            // await AsyncStorage.removeItem('timeflexAppointments');
            await AsyncStorage.getItem('timeflexAppointments')
                .then(appointmentsJSON => {
                    if (appointmentsJSON) setAppointments(JSON.parse(appointmentsJSON).data)
                    // console.log(appointments)
                });
        }
    }

    const translatedAppointments = appointments.map(appointment => {
        const translatedAppointment = {
            ...appointment,
            start: appointment.startDate,
            end: appointment.endDate
        }
        delete translatedAppointment.startDate;
        delete translatedAppointment.endDate;
        return translatedAppointment;
    });

    const handleMenuButtonPress = () => {
        props.navigation.toggleDrawer();
        fetchAppointments();
    };

    const handleTodayButtonPress = () => {
        props.setCurrentDate(new Date());
        // logout();
    };

    const logout = async () => {
        try {
            props.setUser({});
            props.fetchAppointments();
            await AsyncStorage.removeItem('timeflexUser');
            console.log('removed user from async storage');
        } catch (e) {
            // remove error
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <PaperAppbar.Header style={styles.appbar}>
                <PaperAppbar.Action icon={'menu'} onPress={handleMenuButtonPress} />
                <PaperAppbar.Content title={dateString} />
                <PaperAppbar.Action icon={'calendar-today'} onPress={handleTodayButtonPress} />
            </PaperAppbar.Header >
            <Calendar
                events={translatedAppointments}
                date={props.currentDate}
                mode={props.mode}
                height={1}
                onPressEvent={(event) => {
                    setEvent(event)
                    eventFormRef.current.snapTo(0)
                }}
            />
            <Portal>
                <SimpleEventForm sheetRef={simpleEventFormRef} fetchAppointments={fetchAppointments} />
                <SmartPlanningForm sheetRef={smartPlanningFormRef} fetchAppointments={fetchAppointments} />
                <EditEventForm sheetRef={eventFormRef} appointment={eventPressed} fetchAppointments={fetchAppointments} />
                <FAB.Group
                    open={fabOpen}
                    icon={fabOpen ? 'close' : 'plus'}
                    fabStyle={styles.fab}
                    actions={[
                        {
                            icon: 'school',
                            label: 'Class',
                            onPress: () => { },
                        },
                        {
                            icon: 'calendar-search',
                            label: 'Smart Planning',
                            onPress: () => smartPlanningFormRef.current.snapTo(0),
                        },
                        {
                            icon: 'calendar-edit',
                            label: 'Simple Event',
                            onPress: () => simpleEventFormRef.current.snapTo(0),
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
        shadowRadius: 1,
        shadowOpacity: 0.1,
        paddingTop: 15,
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
    user: state.data.user,
});

const mapDispatchToProps = (dispatch) => ({
    setCurrentDate: (date) => dispatch(setCurrentDate(date)),
    fetchAppointments: () => dispatch(fetchAppointments()),
    setUser: (user) => dispatch(setUser(user)),
    mutateAppointments: (appointments) => dispatch(mutateAppointments(appointments))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);