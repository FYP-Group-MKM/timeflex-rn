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

export const fetchAppointmentsRequest = () => {
    return {
        type: 'FETCH_APPOINTMENTS_REQUEST',
    };
};

export const fetchAppointmentsSuccess = appointments => {
    return {
        type: 'FETCH_APPOINTMENTS_SUCCESS',
        payload: appointments
    };
};

export const fetchAppointmentsFailure = error => {
    return {
        type: 'FETCH_APPOINTMENTS_FAILURE',
        payload: error
    };
};

export const fetchAppointments = () => {
    return async (dispatch, getState) => {
        dispatch(fetchAppointmentsRequest());
        const googleId = getState().data.user.googleId;
        await fetch('https://timeflex-web.herokuapp.com/appointments/' + googleId, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(appointments => dispatch(fetchAppointmentsSuccess(appointments)))
            .catch(error => dispatch(fetchAppointmentsFailure(error.message)));
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

export const postAppointment = appointment => {
    return async (dispatch) => {
        dispatch(postAppointmentRequest());
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
    };
};

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

export const deleteAppointment = appointmentId => {
    return async (dispatch, getState) => {
        dispatch(deleteAppointmentRequest());
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
    };
};

export const setUser = (user) => {
    return {
        type: 'SET_USER',
        payload: user
    };
};
// The below is the action for adding the appointment to the redux appopintment
//data should interms of array with all appointment subject
export const fectchLocalData = (data) => {
    return {
        type:'FECTCH_LOCAL',
        payload:data,
    }
}
//This will pass the local apppointment to the redux
export const createLocalData =  (appointment) => {
    return {
        type:'CREATE_LOCAL',
        payload:appointment,
    }
}

//This will require the appointment id  to delete the appoint in the redux
export const deleteLocalData = (id) => {
    return {
        type:'DELETE_LOCAL',
        payload:id,
    }
}