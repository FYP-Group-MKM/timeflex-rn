import React ,{useState , useEffect}from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { connect } from 'react-redux';
import HomeScreen from './screens/HomeScreen';
import {db,createTable, resetTable} from './db'
import { fetchAppointments } from './actions';
import * as sqlite from 'expo-sqlite';
import {setCurrentDate} from './actions'
const Drawer = createDrawerNavigator();

const App = (props) => {
    const routes = ['week', '3days', 'day'].map(mode => {
        const renderScreen = ({ navigation }) => <HomeScreen navigation={navigation} mode={mode} />
        let name;
        if (mode === 'day') name = 'Days';
        if (mode === '3days') name = '3 Days';
        if (mode === 'week') name = 'Week';
        return <Drawer.Screen key={mode} name={name} component={renderScreen} />;
    });

    
    //When appointment is finnish then no need the appointment any more and can directly retrive from redux
    const [appointment,setAppointment] = useState(null)
    const fectchData = (db) => {
        db.transaction(tx => {
          tx.executeSql('select * from appointment', null, (_, {rows: { _array }}) =>
              setAppointment(_array), () => console.log('error')
          );
      })
      }
    
    //when open the app see the component have SQL or not
    useEffect(() => {
        const initialization = () => {
            //Reset Table will be delete after Testing
            resetTable(db);
            createTable(db);
            //This will get the appoibntment from the Local Database 
            //It will return a array with an object
            fectchData(db);
            //Then upload the appointment to the redux state
            // props.setAppointment(appointment)
            
        }
        initialization();
    },[])

    return (
        <NavigationContainer>
            <ExpoStatusBar style='auto' />
            <Drawer.Navigator>
                {routes}
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

const mapStateToProps = (state) => ({
    currentDate: state.calendar.currentDate,
    appointments: state.data.appointments,
});

const mapDispatchToProps = (dispatch) => ({
    setCurrentDate: (date) => dispatch(setCurrentDate(date)),
    // setAppointment: (appointment) => dispatch()
});

export default connect(mapStateToProps,mapDispatchToProps)(App);