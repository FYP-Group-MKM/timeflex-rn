import React from 'react';
import { StyleSheet, SafeAreaView, Image } from 'react-native';
import { Button, Paragraph, Title, Subheading } from 'react-native-paper';

import { connect } from 'react-redux';
import { setUser } from '../actions';

import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = (props) => {

    const handleRedirect = async event => {
        WebBrowser.dismissBrowser();
    };

    const handleOAuthLogin = async () => {
        let redirectUrl = await Linking.getInitialURL();
        Linking.addEventListener('url', handleRedirect);
        try {
            let authResult = await WebBrowser.openAuthSessionAsync(`https://timeflex-web.herokuapp.com/expo-auth/google`, redirectUrl);
            const userURIComponent = authResult.url.replace('exp://exp.host/@darren1208/timeflex-rn/', '');
            const userJSON = decodeURIComponent(userURIComponent);
            await AsyncStorage.setItem('timeflexUser', userJSON)
                .then(props.setUser(JSON.parse(userJSON)))
                .catch(error => console.log(error));
        } catch (err) {
            console.log('ERROR:', err);
        }
        Linking.removeEventListener('url', handleRedirect);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Title style={styles.title}>TimeFlex</Title>
            <Subheading style={styles.subheading}>Calendar for Academia</Subheading>
            <Image source={require('../assets/HKU.jpg')} style={styles.logo} />
            <Button
                title='login'
                onPress={handleOAuthLogin}
                mode='contained'
                uppercase={false}
                style={styles.button}
            >Login with Google</Button>
            <Paragraph>*Only available to HKU connect accounts</Paragraph>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        color: '#616161'
    },
    subheading: {
        fontSize: 18,
        color: '#616161'
    },
    logo: {
        width: 748 / 5,
        maxHeight: 845 / 5,
        margin: 20,
    },
    button: {
        marginBottom: 10,
    }
});

const mapStateToProps = (state) => ({
    user: state.data.user,
});

const mapDispatchToProps = (dispatch) => ({
    setUser: (user) => dispatch(setUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);