import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Switch, Snackbar, Headline, Subheading } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BottomSheet from 'reanimated-bottom-sheet';
import ButtonDateTimePicker from './ButtonDateTimePicker';
import { connect } from 'react-redux';
import { updateAppointment, deleteAppointment } from '../../actions';


const EditEventForm = (props) => {
    const [appointment, setAppointment] = useState({})
    const [validity, setValidity] = useState({});
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [invalidDateMsg, setInvalidDateMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTitleInput = (text) => setAppointment({ ...appointment, title: text });
    const handleDescriptionInput = (text) => setAppointment({ ...appointment, description: text });
    const handleAllDaySwitchToggle = () => setAppointment({ ...appointment, allDay: !appointment.allDay });
    const handleStartDateInput = (date) => setAppointment({ ...appointment, startDate: date });
    const handlEendDateInput = (date) => setAppointment({ ...appointment, endDate: date });

    useEffect(() => {
        const formattedAppointment = {
            ...props.appointment,
            startDate: props.appointment.start ? new Date(props.appointment.start) : new Date(),
            endDate: props.appointment.end ? new Date(props.appointment.end) : new Date()
        };
        delete formattedAppointment.start;
        delete formattedAppointment.end;
        setAppointment(formattedAppointment)
    }, [props.appointment.appointmentId]);

    // console.log(appointment)
    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
        </View>
    );

    const handleSubmit = () => {
        if (!appointmentIsValid()) return;
        setLoading(true);
        props.updateAppointment(appointment)
            .then(props.fetchAppointments()
                .then(() => {
                    resetAppointment()
                    setLoading(false)
                }))
            .catch(error => console.log(error))
        props.sheetRef.current.snapTo(1)
    };

    const handleDelete = () => {
        setLoading(true);
        props.deleteAppointment(appointment.appointmentId)
            .then(props.fetchAppointments()
                .then(() => {
                    resetAppointment()
                    setLoading(false);
                    props.sheetRef.current.snapTo(1);
                }))
            .catch(error => console.log(error))
    };

    const resetAppointment = () => {
        const formattedAppointment = {
            ...props.appointment,
            startDate: props.appointment.start ? new Date(props.appointment.start) : new Date(),
            endDate: props.appointment.end ? new Date(props.appointment.end) : new Date()
        };
        delete formattedAppointment.start;
        delete formattedAppointment.end;
        setAppointment(formattedAppointment);
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
            onCloseEnd={resetAppointment}
            renderHeader={renderHeader}
            renderContent={() => !loading ? (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <KeyboardAwareScrollView style={styles.root}>
                        <View style={styles.formTitle}>
                            <Headline>Edit Event</Headline>
                            <View style={styles.options}>
                                <Button onPress={handleSubmit}>Save</Button>
                                <Button onPress={handleDelete}>Delete</Button>
                            </View>
                        </View>
                        <TextInput
                            mode='outlined'
                            dense
                            label='Title'
                            value={appointment.title}
                            style={styles.eventTitle}
                            error={validity.titleIsEmpty}
                            onChangeText={handleTitleInput}
                        />
                        {appointment.startDate && appointment.endDate ?
                            <View>
                                <View style={styles.switch}>
                                    <Switch value={appointment.allDay} onValueChange={handleAllDaySwitchToggle} />
                                    <Subheading>All Day</Subheading>
                                </View>
                                <ButtonDateTimePicker date={appointment.startDate} handleDateSelect={handleStartDateInput} />
                                <ButtonDateTimePicker date={appointment.endDate} handleDateSelect={handlEendDateInput} />
                            </View> : null}
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
                            onDismiss={() => setSnackbarVisible(false)}
                            style={styles.snackbar}
                        >
                            {invalidDateMsg}
                        </Snackbar>
                    </KeyboardAwareScrollView >
                </TouchableWithoutFeedback>
            ) : <View style={styles.root} />}
        />
    );
};

const styles = StyleSheet.create({
    options: {
        display: 'flex',
        flexDirection: 'row'
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
    dummy: {
        height: 200,
        backgroundColor: 'white'
    }
});


const mapStateToProps = (state) => ({
    currentDate: state.calendar.currentDate,
    appointments: state.data.appointments,
});

const mapDispatchToProps = (dispatch) => ({
    setCurrentDate: (date) => dispatch(setCurrentDate(date)),
    updateAppointment: appointment => dispatch(updateAppointment(appointment)),
    deleteAppointment: appointmentId => dispatch(deleteAppointment(appointmentId)),
    // fetchAppointments: () => dispatch(fetchAppointments()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditEventForm);
