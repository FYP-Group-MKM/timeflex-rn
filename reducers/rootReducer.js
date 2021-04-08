import appointmentFormReducer from './appointmentFormReducer';
import calendarReducer from './calendarReducer';
import dataReducer from './dataReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    calendar: calendarReducer,
    appointmentForm: appointmentFormReducer,
    data: dataReducer
})

export default rootReducer;