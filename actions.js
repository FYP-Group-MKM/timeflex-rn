import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'uuid';

export const setCurrentDate = (date) => {
    return {
        type: 'SET_CURRENT_DATE',
        payload: date,
    };
};

export const setCurrentView = (view) => {
    return {
        type: 'SET_CURRENT_VIEW',
        payload: view,
    };
};

export const setAppointmentForm = (isOpen) => {
    return {
        type: 'SET_SIMPLE_EVENT_FORM',
        payload: isOpen,
    };
};

export const syncAppointments = () => {
    return async (dispatch, getState) => {
        const googleId = getState().data.user.googleId;

        console.log('loading appointmentsToPost...');
        const appointmentsToPost = await AsyncStorage.getItem('timeflexAppointmentsToPost')
            .then(appointmentsJSON => appointmentsJSON ? JSON.parse(appointmentsJSON) : {})
            .then(obj => obj.data ? [...obj.data] : [])
            .catch(error => console.log(error));

        console.log('posting the appointments to server...');
        appointmentsToPost.forEach(appointment => {
            postAppointment(appointment);
        });

        console.log('loading appointmentsToDelete');
        const appointmentsToDelete = await AsyncStorage.getItem('timeflexAppointmentsToDelete')
            .then(appointmentsJSON => appointmentsJSON ? JSON.parse(appointmentsJSON) : {})
            .then(obj => obj.data ? [...appointmentsToDeleteobj.data] : [])
            .catch(error => console.log(error));

        console.log('deleting the appointments from server...');
        appointmentsToDelete.forEach(appointment => {
            deleteAppointment(appointment.appointmentId);
        });

        console.log('clearing the local temporay storage...');
        await AsyncStorage.setItem('timeflexAppointmentsToPost', '');
        await AsyncStorage.setItem('timeflexAppointmentsToDelete', '');

        console.log('fetching data from server...');
        dispatch(fetchAppointmentsRequest());
        const updatedAppointments = await fetch('https://timeflex-web.herokuapp.com/appointments/' + googleId)
            .then(res => res.json())
            .then(fetchAppointmentsSuccess([]));
        const appointmentsJSON = { data: updatedAppointments };

        console.log('inserting the data to local storage...')
        dispatch(postAppointmentRequest());
        await AsyncStorage.setItem('timeflexAppointments', JSON.stringify(appointmentsJSON))
            .then(dispatch(postAppointmentSuccess()))
            .catch(error => dispatch(postAppointmentFailure(error.message)));

        console.log('finished synchronization');
    };
};

export const loadLocalAppointments = () => {
    return async (dispatch) => {
        dispatch(fetchAppointmentsRequest());
        const existingAppointments = await AsyncStorage.getItem('timeflexAppointments')
            .then(appointmentsJSON => appointmentsJSON ? JSON.parse(appointmentsJSON) : {})
            .then(obj => obj.data ? [...obj.data] : [])
            .catch(error => dispatch(fetchAppointmentsFailure(error.message)));
        const appointmentsToPost = await AsyncStorage.getItem('timeflexAppointmentsToPost')
            .then(appointmentsJSON => appointmentsJSON ? JSON.parse(appointmentsJSON) : {})
            .then(obj => obj.data ? [...obj.data] : [])
            .catch(error => dispatch(fetchAppointmentsFailure(error.message)));
        dispatch(fetchAppointmentsSuccess([...existingAppointments, ...appointmentsToPost]));
    };
};

export const postAppointment = (appointment) => {
    return async (dispatch, getState) => {
        dispatch(postAppointmentRequest());
        await NetInfo.fetch().then(async (state) => {
            const googleId = getState().data.user.googleId;
            const newAppointment = { ...appointment, appointmentId: uuid.v4(), googleId: googleId };
            let storageKey = 'timeflexAppointmentsToPost';

            if (state.isInternetReachable) {
                storageKey = 'timeflexAppointments';

                await fetch('https://timeflex-web.herokuapp.com/appointments', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(appointment),
                    credentials: 'include',
                })
                    .then(dispatch(postAppointmentSuccess()))
                    .catch(error => dispatch(postAppointmentFailure(error.message)));
            }
            const appointments = await AsyncStorage.getItem(storageKey)
                .then(appointmentsJSON => appointmentsJSON ? JSON.parse(appointmentsJSON) : {})
                .then(obj => obj.data ? [...obj.data] : [])
                .catch(error => console.log(error));

            const updatedAppointments = [...appointments, newAppointment];
            const appointmentsJSON = { data: updatedAppointments };
            await AsyncStorage.setItem(storageKey, JSON.stringify(appointmentsJSON))
                .then(dispatch(postAppointmentSuccess()))
                .catch(error => dispatch(postAppointmentFailure(error.message)));
        });
    };
};

export const updateAppointment = updatedAppointment => {
    return async (dispatch, getState) => {
        dispatch(updateAppointmentRequest());
        const googleId = getState().data.user.googleId;
        await NetInfo.fetch().then(async (state) => {
            if (state.isInternetReachable) {
                await fetch(`https://timeflex-web.herokuapp.com/appointments/${googleId}/${updatedAppointment.appointmentId}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedAppointment),
                    credentials: 'include'
                })
                    .then(dispatch(updateAppointmentSuccess()))
                    .catch(error => dispatch(updateAppointmentFailure(error.message)));
            } else {
                // try {
                //     console.log(updatedAppointment)
                //     let appointments = [];
                //     await AsyncStorage.getItem('timeflexAppointments')
                //         .then(appointmentsJSON => { if (appointmentsJSON) return appointmentsJSON?JSON.parse(appointmentsJSON):{}.data })
                //         .then(data => { if (data) appointments = [...data] })
                //     const updatedAppointments = [
                //         ...appointments.filter(appointment => appointment.appointmentId !== updatedAppointment.appointmentId),
                //         updatedAppointment
                //     ];
                //     const appointmentsJSON = { data: updatedAppointments };
                //     await AsyncStorage.setItem('timeflexAppointments', JSON.stringify(appointmentsJSON))
                //         .then(dispatch(updateAppointmentSuccess()))
                //         .catch(error => dispatch(updateAppointmentFailure(error.message)));
                // } catch (e) {
                //     console.log(e);
                // }
            }
        });
    };
};

export const deleteAppointment = appointmentId => {
    return async (dispatch, getState) => {
        dispatch(deleteAppointmentRequest());
        await NetInfo.fetch().then(async (state) => {
            if (state.isInternetReachable) {
                const googleId = getState().data.user.googleId;
                await fetch('https://timeflex-web.herokuapp.com/appointments/' + googleId + '/' + appointmentId, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                })
                    .then(dispatch(deleteAppointmentSuccess()))
                    .catch(error => dispatch(deleteAppointmentFailure(error.message)));
            } else {
                const appointments = await AsyncStorage.getItem('timeflexAppointments')
                    .then(appointmentsJSON => appointmentsJSON ? JSON.parse(appointmentsJSON) : {})
                    .then(obj => obj.data ? [...obj.data] : []);

                const updatedAppointments = appointments.filter(appointment => appointment.appointmentId !== appointmentId);
                const updatedAppointmentsJSON = { data: updatedAppointments };

                dispatch(postAppointmentRequest());
                await AsyncStorage.setItem('timeflexAppointments', JSON.stringify(updatedAppointmentsJSON))
                    .then(dispatch(postAppointmentSuccess()))
                    .catch(error => dispatch(postAppointmentFailure(error.message)));

                const appointmentsToDelete = await AsyncStorage.getItem('timeflexAppointmentsToDelete')
                    .then(appointmentsJSON => appointmentsJSON ? JSON.parse(appointmentsJSON) : {})
                    .then(obj => obj.data ? [...obj.data] : []);
                appointmentsToDelete = [...appointmentsToDelete, appointmentId];
                const appointmentsToDeleteJSON = { data: appointmentsToDelete };

                await AsyncStorage.setItem('timeflexAppointmentsToDelete', JSON.stringify(appointmentsToDeleteJSON))

                dispatch(deleteAppointmentSuccess());
            }
        });
    };
};

export const mutateAppointments = appointments => ({
    type: 'MUTATE_APPOINTMENTS',
    payload: appointments,
});

export const setUser = (user) => {
    return {
        type: 'SET_USER',
        payload: { ...user }
    };
};

export const fetchAppointmentsRequest = () => {
    return {
        type: 'FETCH_APPOINTMENTS_REQUEST',
    };
};

export const fetchAppointmentsSuccess = appointments => {
    return {
        type: 'FETCH_APPOINTMENTS_SUCCESS',
        payload: [...appointments]
    };
};

export const fetchAppointmentsFailure = error => {
    return {
        type: 'FETCH_APPOINTMENTS_FAILURE',
        payload: error
    };
};

export const postAppointmentRequest = () => {
    return {
        type: 'POST_APPOINTMENT_REQUEST',
    };
};

export const postAppointmentSuccess = () => {
    return {
        type: 'POST_APPOINTMENT_SUCCESS'
    };
};

export const postAppointmentFailure = error => {
    return {
        type: 'POST_APPOINTMENT_FAILURE',
        payload: error
    };
};

export const updateAppointmentRequest = () => ({
    type: 'UPDATE_APPOINTMENT_REQUEST',
});

export const updateAppointmentSuccess = () => ({
    type: 'UPDATE_APPOINTMENT_SUCCESS',
});

export const updateAppointmentFailure = (error) => ({
    type: 'UPDATE_APPOINTMENT_SUCCESS',
    payload: error
});

export const deleteAppointmentRequest = () => {
    return {
        type: 'DELETE_APPOINTMENT'
    };
};

export const deleteAppointmentSuccess = (appointments) => {
    return {
        type: 'DELETE_APPOINTMENT_SUCCESS',
        payload: appointments
    };
};

export const deleteAppointmentFailure = (error) => {
    return {
        type: 'DELETE_APPOINTMENT_FAILURE',
        payload: error
    };
};

// The below is the action for adding the appointment to the redux appopintment
//data should interms of array with all appointment subject
export const fectchLocalData = (data) => {
    return {
        type: 'FECTCH_LOCAL',
        payload: data,
    }
}
//This will pass the local apppointment to the redux
export const createLocalData = (appointment) => {
    return {
        type: 'CREATE_LOCAL',
        payload: appointment,
    }
}

//This will require the appointment id  to delete the appoint in the redux
export const deleteLocalData = (id) => {
    return {
        type: 'DELETE_LOCAL',
        payload: id,
    }
}

