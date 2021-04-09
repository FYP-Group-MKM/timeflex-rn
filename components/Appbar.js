import format from 'date-fns/format';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { State } from 'react-native-gesture-handler';
import { Appbar as PaperAppbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { setCurrentDate } from '../actions';

const Appbar = ({ navigation, currentDate, setCurrentDate }) => {
    const dateString = format(currentDate, 'MMM yyyy');

    return (
        <PaperAppbar.Header style={styles.root}>
            <PaperAppbar.Action icon={'menu'} onPress={navigation.toggleDrawer} />
            <PaperAppbar.Content title={dateString} />
            <PaperAppbar.Action icon={'calendar-today'} onPress={() => setCurrentDate(new Date())} />
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

const mapStateToProps = (state) => ({
    currentDate: state.calendar.currentDate,
});

const mapDispatchToProps = (dispatch) => ({
    setCurrentDate: (date) => dispatch(setCurrentDate(date)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);