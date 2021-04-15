import format from 'date-fns/format';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button, Switch, Title, Text } from 'react-native-paper';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

const ButtonDateTimePicker = (props) => {
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [timePickerOpen, setTimePickerOpen] = useState(false);

    const handleConfirm = (date) => {
        props.handleDateSelect(date);
        setDatePickerOpen(false);
        setTimePickerOpen(false);
    }

    return (
        <View style={styles.root}>
            <Button onPress={() => setDatePickerOpen(true)}>{format(props.date, 'eee, dd/M/yyyy')}</Button>
            <Button onPress={() => setTimePickerOpen(true)}>{((props.date.getHours() < 10) && (props.date.getHours() > 0) ? '0' : '') + format(props.date, 'p')}</Button>
            <DateTimePickerModal
                isVisible={datePickerOpen}
                mode='date'
                date={props.date}
                onConfirm={handleConfirm}
                onCancel={() => setDatePickerOpen(false)}
            />
            <DateTimePickerModal
                isVisible={timePickerOpen}
                mode='time'
                date={props.date}
                headerTextIOS='Pick a time'
                onConfirm={handleConfirm}
                onCancel={() => setTimePickerOpen(false)}
            />
        </View >
    );
};

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default ButtonDateTimePicker;

