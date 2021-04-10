import addHours from 'date-fns/addHours';
import setMinutes from 'date-fns/setMinutes';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button, Switch, Title, Text, Snackbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import BottomSheet from 'reanimated-bottom-sheet';

import ButtonDateTimePicker from './ButtonDateTimePicker';



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
        console.log(appointment)
        if (!appointmentIsValid()) return;

        await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...appointment
            }),
        });
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
            initialSnap={2}
            snapPoints={['95%', '50%', 0]}
            renderHeader={renderHeader}
            renderContent={() => (
                <View style={styles.root}>
                    <View style={styles.formTitle}>
                        <Title>Simple Event</Title>
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
                            <Text>All Day</Text>
                        </View>
                        <ButtonDateTimePicker date={appointment.startDate} handleDateSelect={handleStartDateInput} />
                        <ButtonDateTimePicker date={appointment.endDate} handleDateSelect={handlEendDateInput} />
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
                </View >
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
        maxWidth: 110,
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
