import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar as PaperAppbar } from 'react-native-paper';

const Appbar = (props) => {
    return (
        <PaperAppbar style={styles.root}>
            <PaperAppbar.Header style={styles.header}>
                <PaperAppbar.Content title='TimeFlex' color='red' />
            </PaperAppbar.Header>
        </PaperAppbar >
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
    },
    content: {
        color: 'red'
    }
});

export default Appbar;