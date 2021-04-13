import addHours from 'date-fns/addHours';
import setMinutes from 'date-fns/setMinutes';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Switch, Snackbar, Headline, Subheading } from 'react-native-paper';
import BottomSheet from 'reanimated-bottom-sheet';
import ButtonDateTimePicker from './ButtonDateTimePicker';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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

        props.sheetRef.current.snapTo(1);
        resetAppointment();
    };

    const resetAppointment = () => setAppointment({
        title: '',
        startDate: setMinutes(addHours(new Date(), 1), 0),
        endDate: setMinutes(addHours(new Date(), 2), 0),
        allDay: false,
        description: ''
    });

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
            renderContent={() => (
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
        height: '100%',
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
    snackbar: {
        width: '104%'
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

});


export default SimpleEventForm;
