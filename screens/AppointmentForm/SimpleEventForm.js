import React from 'react';
import { View, Text, SafeAreaView, Button } from 'react-native';
import { TextInput } from 'react-native-paper';
import { connect } from 'react-redux';
import { Formik } from 'formik';

const SimpleEventForm = () => {
    return (
        <SafeAreaView>
            <Text>hi</Text>
            <Formik>

            </Formik>
        </SafeAreaView>
    )
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});


export default connect(mapStateToProps)(SimpleEventForm);
