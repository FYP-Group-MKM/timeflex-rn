const initialState = {
    open: false
};

const appointmentFormReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_APPOINTMENT_FORM':
            return {
                ...state,
                open: action.payload,
            }
        default:
            return state;
    };
};

export default appointmentFormReducer;