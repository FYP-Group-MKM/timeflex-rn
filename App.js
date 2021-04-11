import React ,{useState , useEffect}from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { connect } from 'react-redux';
import HomeScreen from './screens/HomeScreen';
import {db,createTable, resetTable} from './db'
import { fetchAppointments } from './actions';
import * as sqlite from 'expo-sqlite';
const testCase = [
    {
        title: 'Meeting',
        start: new Date(2021, 3, 12, 9, 0),
        end: new Date(2021, 3, 12, 10, 30),
      },
      {
        title: 'Coffee break',
        start: new Date(2021, 3, 13, 15, 45),
        end: new Date(2021, 3, 13, 16, 30),
      },
]

const Drawer = createDrawerNavigator();

const App = (props) => {
    const routes = ['week', '3days', 'day'].map(mode => {
        const renderScreen = ({ navigation }) => <HomeScreen navigation={navigation} mode={mode} appointments={testCase}/>
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
            fectchData(db);
            console.log('The appointment are ', appointment)
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
});

export default connect(mapStateToProps)(App);