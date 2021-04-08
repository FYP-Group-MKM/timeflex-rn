import format from 'date-fns/format';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Appbar as PaperAppbar } from 'react-native-paper';

const Appbar = (props) => {
    const dateString = format(new Date(), 'MMM yyyy');

    return (
        <PaperAppbar.Header style={styles.root}>
            <PaperAppbar.Action icon={'menu'} onPress={() => { }} />
            <PaperAppbar.Content title={dateString} />
            <PaperAppbar.Action icon={'calendar-today'} onPress={() => { }} />
        </PaperAppbar.Header >
    );
}

const styles = StyleSheet.create({
    root: {
        elevation: 0,
        backgroundColor: '#fff',
    },
    header: {
        elevation: 0,
        backgroundColor: '#fff',
        display: 'flex',
    },
    title: {
        textAlign: 'center'
    }
});

export default Appbar;