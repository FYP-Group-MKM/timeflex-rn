import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, Button, Switch } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
// import DateTimePickerModal from "react-native-modal-datetime-picker";

const SimpleEventForm = () => {
    // const [datePickerOpen, setDatePickerOpen] = useState(false);

    return (
        <View style={styles.root}>
            <Text>Simple Event</Text>
            <TextInput
                label="Title"
                value=''
                onChangeText={() => { }}
            />
            <View>
                <Text>Simple Event</Text>
                <DateTimePicker
                    value={new Date()}
                    mode='date'
                    display='default'
                    is24Hour={true}
                    onChange={() => { }}
                />
                <DateTimePicker
                    value={new Date()}
                    mode='time'
                    display='default'
                    is24Hour={true}
                    onChange={() => { }}
                />
                <DateTimePicker
                    value={new Date()}
                    mode='time'
                    display='default'
                    is24Hour={true}
                    onChange={() => { }}
                />
                {/* <DateTimePickerModal
                    isVisible={datePickerOpen}
                    mode='date'
                    onConfirm={() => { }}
                    onCancel={() => setDatePickerOpen(false)}
                /> */}
            </View>
            <View style={styles.row}>
                <Switch value={true} onValueChange={() => { }} />
                <Text>All Day</Text>
            </View>
            <TextInput
                label="Description"
                value=''
                multiline
                numberOfLines={2}
                onChangeText={() => { }}
            />
            <Button>Create</Button>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
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


export default SimpleEventForm;
