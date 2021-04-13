import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import addWeeks from 'date-fns/addWeeks';
import React, { useState } from 'react';
import { StyleSheet, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { TextInput, Button, Switch, Snackbar, Subheading, Headline, Paragraph } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BottomSheet from 'reanimated-bottom-sheet';

import ButtonDateTimePicker from './ButtonDateTimePicker';


const SmartPlanningForm = (props) => {
    const [appointment, setAppointment] = useState({
        title: '',
        deadline: addWeeks(setMinutes(setHours(new Date(), 0), 0), 1),
        exDuration: null,
        divisible: true,
        minSession: 1,
        maxSession: '',
        description: '',
    });
    const [validity, setValidity] = useState({});
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [invalidDateMsg, setInvalidDateMsg] = useState('');

    const handleTitleInput = (text) => setAppointment({ ...appointment, title: text });
    const handleDescriptionInput = (text) => setAppointment({ ...appointment, description: text });
    const handleDivisibleSwitchToggle = () => setAppointment({ ...appointment, divisible: !appointment.divisible });
    const handleDeadlineInput = (date) => setAppointment({ ...appointment, deadline: date });
    const handleExDurationInput = (val) => setAppointment({ ...appointment, exDuration: Number(val) });
    const handleMinSessionInput = (val) => setAppointment({ ...appointment, minSession: Number(val) });
    const handleMaxSessionInput = (val) => setAppointment({ ...appointment, maxSession: Number(val) });

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
        </View>
    );

    const handleSubmit = async () => {
        if (!appointmentIsValid()) return;

        if (!appointment.divisible) {
            setAppointment({
                ...appointment,
                maxSession: appointment.exDuration,
                minSession: appointment.exDuration,
            });
        }

        // await fetch('https://jsonplaceholder.typicode.com/posts', {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         ...appointment
        //     }),
        // });

        props.sheetRef.current.snapTo(1);
        resetAppointment();
    };

    const resetAppointment = () => setAppointment({
        title: '',
        deadline: addWeeks(setMinutes(setHours(new Date(), 0), 0), 1),
        exDuration: null,
        divisible: true,
        minSession: 1,
        maxSession: '',
        description: '',
    });

    const appointmentIsValid = () => {
        const { title, deadline, exDuration, divisible, minSession, maxSession } = appointment;
        let newValidity = {};
        let isValid = true;

        if (!title) {
            newValidity.titleIsEmpty = true;
            isValid = false;
        }

        if (deadline < new Date()) {
            newValidity.invalidDeadline = true;
            isValid = false;
            setInvalidDateMsg("The deadline cannot be in the past");
            setSnackbarVisible(true);
        }

        if (!exDuration) {
            newValidity.exDurationIsEmpty = true;
            isValid = false;
        }

        if (divisible && !maxSession) {
            newValidity.maxSessionIsEmpty = true;
            isValid = false;
        }

        if (divisible && !minSession) {
            newValidity.minSessionIsEmpty = true;
            isValid = false;
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
            renderContent={() => (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <KeyboardAwareScrollView style={styles.root} >
                        <View style={styles.formTitle}>
                            <Headline>Smart Planning</Headline>
                            <Button onPress={handleSubmit}>Create</Button>
                        </View>
                        <Paragraph>There is a smart planning algorithm in TimeFlex, which will help you find a timeslot for your task.</Paragraph>
                        <TextInput
                            mode='outlined'
                            dense
                            label="Title"
                            value={appointment.title}
                            style={styles.eventTitle}
                            error={validity.titleIsEmpty}
                            onChangeText={handleTitleInput}
                        />
                        <View style={styles.deadline}>
                            <Subheading>Deadline</Subheading>
                            <ButtonDateTimePicker date={appointment.deadline} handleDateSelect={handleDeadlineInput} />
                        </View>
                        <View style={styles.switch}>
                            <Switch value={appointment.divisible} onValueChange={handleDivisibleSwitchToggle} />
                            <Subheading>Divisible</Subheading>
                        </View>
                        <TextInput
                            mode='outlined'
                            label="Expected Duration"
                            value={appointment.exDuration ? appointment.exDuration.toString() : ''}
                            error={validity.exDurationIsEmpty}
                            dense
                            keyboardType='numeric'
                            onChangeText={handleExDurationInput}
                        />


                        {appointment.divisible ? <View style={styles.sessionTextInputRow}>
                            <TextInput
                                mode='outlined'
                                label="Minimum Session"
                                value={appointment.minSession ? appointment.minSession.toString() : ''}
                                error={validity.minSessionIsEmpty}
                                dense
                                keyboardType='numeric'
                                style={styles.sessionTextInput}
                                onChangeText={handleMinSessionInput}
                            />
                            <TextInput
                                mode='outlined'
                                label="Maximum Session"
                                value={appointment.maxSession ? appointment.maxSession.toString() : ''}
                                error={validity.maxSessionIsEmpty}
                                dense
                                keyboardType='numeric'
                                style={styles.sessionTextInput}
                                onChangeText={handleMaxSessionInput}
                            />
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
            )}
        />
    );
};

const styles = StyleSheet.create({
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
        marginTop: 10,
        marginBottom: 20,
    },
    deadline: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '100%',
        marginBottom: 20,
    },
    switch: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 130,
        marginBottom: 20,
    },
    datePicker: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    description: {
        marginTop: 15,
    },
    snackbar: {
        width: '104%'
    },
    sessionTextInputRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    sessionTextInput: {
        marginTop: 15,
        width: '48%'
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
    dummy: {
        height: 200,
        backgroundColor: 'white'
    }
});


export default SmartPlanningForm;
