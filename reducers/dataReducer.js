const initialState = {
    user: {},
    authenticated: false,
    appointments: [
        {
            title: 'Meeting',
            start: new Date(2021, 3, 9, 10, 0),
            end: new Date(2021, 3, 9, 10, 30),
        },
        {
            title: 'Coffee break',
            start: new Date(2021, 3, 9, 15, 45),
            end: new Date(2021, 3, 9, 16, 30),
        },
    ],
    loading: false,
    error: ""
}

const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_APPOINTMENTS_REQUEST':
            return {
                ...state,
                loading: true
            };
        case 'FETCH_APPOINTMENTS_SUCCESS':
            return {
                ...state,
                loading: false,
                appointments: action.payload,
                error: ""
            };
        case 'FETCH_APPOINTMENTS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'POST_APPOINTMENT_REQUEST':
            return {
                ...state,
                loading: true
            };
        case 'POST_APPOINTMENT_SUCCESS':
            return {
                ...state,
                loading: false,
                error: ""
            };
        case 'POST_APPOINTMENT_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'DELETE_APPOINTMENT_REQUEST':
            return {
                ...state,
                loading: true
            };
        case 'DELETE_APPOINTMENT_SUCCESS':
            return {
                ...state,
                loading: false,
                error: "",
            };
        case 'DELETE_APPOINTMENT_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'SET_USER':
            return {
                ...state,
                user: { ...action.payload }
            };
        default:
            return state;
    };
};

export default dataReducer;