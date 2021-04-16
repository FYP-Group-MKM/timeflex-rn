import addHours from 'date-fns/addHours';
import setMinutes from 'date-fns/setMinutes';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Switch, Snackbar, Headline, Subheading, ActivityIndicator } from 'react-native-paper';
import BottomSheet from 'reanimated-bottom-sheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ButtonDateTimePicker from './ButtonDateTimePicker';

import { connect } from 'react-redux';
import { postAppointment, fetchAppointments, loadLocalAppointments } from '../../actions';

const SimpleEventForm = (props) => {
    const [appointment, setAppointment] = useState({
        title: '',
        startDate: setMinutes(addHours(new Date(), 1), 0),
        endDate: setMinutes(addHours(new Date(), 2), 0),
        allDay: false,
        description: ''
    });
    const [validity, setValidity] = useState({});
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [invalidDateMsg, setInvalidDateMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTitleInput = (text) => setAppointment({ ...appointment, title: text });
    const handleDescriptionInput = (text) => setAppointment({ ...appointment, description: text });
    const handleAllDaySwitchToggle = () => setAppointment({ ...appointment, allDay: !appointment.allDay });
    const handleStartDateInput = (date) => setAppointment({ ...appointment, startDate: date });
    const handlEendDateInput = (date) => setAppointment({ ...appointment, endDate: date });

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
        </View>
    );

    const handleSubmit = async () => {
        if (!appointmentIsValid()) return;
        setLoading(true);
        await props.postAppointment(appointment)
            .then(props.loadLocalAppointments())
            .catch(error => console.log(error));
        resetAppointment();
        props.sheetRef.current.snapTo(1);
        setLoading(false);
    };

    const resetAppointment = () => {
        setAppointment({
            title: '',
            startDate: setMinutes(addHours(new Date(), 1), 0),
            endDate: setMinutes(addHours(new Date(), 2), 0),
            allDay: false,
            description: ''
        });
        resetSnackbar();
    }

    const resetSnackbar = () => {
        setSnackbarVisible(false);
        setInvalidDateMsg('');
    };

    const appointmentIsValid = () => {
        const { title, startDate, endDate } = appointment;
        let newValidity = {};
        let isValid = true;

        if (!title) {
            newValidity.titleIsEmpty = true;
            isValid = false;
        }

        if (startDate < new Date()) {
            newValidity.invalidDate = true;
            isValid = false;
            setInvalidDateMsg('An event cannot be in the past');
            setSnackbarVisible(true);
        }

        if (endDate < new Date()) {
            newValidity.invalidDate = true;
            isValid = false;
            setInvalidDateMsg('An event cannot be in the past');
            setSnackbarVisible(true);
        }

        if (startDate > endDate) {
            newValidity.invalidDate = true;
            isValid = false;
            setInvalidDateMsg('An event cannot start later than it ends');
            setSnackbarVisible(true);
        }

        setValidity(newValidity);
        return isValid;
    };

    return (
        <BottomSheet
            ref={props.sheetRef}
            initialSnap={1}
            snapPoints={['95%', 0]}
            onCloseStart={Keyboard.dismiss}
            onCloseEnd={resetAppointment}
            renderHeader={renderHeader}
            renderContent={() => !loading ? (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <KeyboardAwareScrollView style={styles.root}>
                        <View style={styles.formTitle}>
                            <Headline>Simple Event</Headline>
                            <Button onPress={handleSubmit}>Create</Button>
                        </View>
                        <TextInput
                            mode='outlined'
                            dense
                            label="Title"
                            value={appointment.title}
                            style={styles.eventTitle}
                            error={validity.titleIsEmpty}
                            onChangeText={handleTitleInput}
                        />
                        <View>
                            <View style={styles.switch}>
                                <Switch value={appointment.allDay} onValueChange={handleAllDaySwitchToggle} />
                                <Subheading>All Day</Subheading>
                            </View>
                            <View style={styles.datePickerRow}>
                                <Subheading>From</Subheading>
                                <ButtonDateTimePicker date={appointment.startDate} handleDateSelect={handleStartDateInput} />
                            </View>
                            <View style={styles.datePickerRow}>
                                <Subheading>Until</Subheading>
                                <ButtonDateTimePicker date={appointment.endDate} handleDateSelect={handlEendDateInput} />
                            </View>
                        </View>
                        <TextInput
                            mode='outlined'
                            label="Description"
                            value={appointment.description}
                            multiline
                            numberOfLines={2}
                            style={styles.description}
                            onChangeText={handleDescriptionInput}
                        />

                        <View style={styles.dummy} />

                        <Snackbar
                            visible={snackbarVisible}
                            onDismiss={resetSnackbar}
                            style={styles.snackbar}
                        >
                            {invalidDateMsg}
                        </Snackbar>
                    </KeyboardAwareScrollView >
                </TouchableWithoutFeedback>
            ) : <View style={styles.loading} >
                <ActivityIndicator animating={true} />
                <Subheading>Loading...</Subheading>
            </View>}
        />
    );
};

const styles = StyleSheet.create({
    loading: {
        height: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    root: {
        backgroundColor: 'white',
        padding: 16,
        height: 800,
        display: 'flex',
    },
    formTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 10,
    },
    eventTitle: {
        marginBottom: 20,
    },
    switch: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 120,
        marginBottom: 20,
    },
    datePickerRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    description: {
        marginTop: 15,
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
    snackbar: {
        marginTop: 25,
        position: 'absolute',
    },
    // dummy: {
    //     height: 200,
    //     backgroundColor: 'white'
    // }
});

const mapStateToProps = state => ({
    user: state.data.user,
});

const mapDispatchToProps = dispatch => ({
    postAppointment: (appointment) => dispatch(postAppointment(appointment)),
    fetchAppointments: () => dispatch(fetchAppointments()),
    loadLocalAppointments: dispatch(loadLocalAppointments()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SimpleEventForm);
