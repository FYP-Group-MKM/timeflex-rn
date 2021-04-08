const initialState = {
    currentDate: new Date(),
    currentView: "Week"
}

const calendarReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_DATE':
            return {
                ...state,
                currentDate: action.payload
            };
        case 'SET_CURRENT_VIEW':
            return {
                ...state,
                currentView: action.payload
            };
        default:
            return state;
    };
};

export default calendarReducer;