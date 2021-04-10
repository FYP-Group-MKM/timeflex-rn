
import { id } from 'date-fns/locale';
import * as SQLite from 'expo-sqlite';

//This JavaScript is usefor stroing the function of database manipulation
//db is the database object created by SQLite from expo-sqlite libray.
export const createTable = (db) => {
    db.transaction(tx => {
        tx.executeSql(
            'create table if not exists appointment (id integer primary key not null, title text, startdate text, enddate text, description text);',[], () => console.log(`Create Database sucess`),()=> console.log(`Create DataBase Fail`)
        )
    })
    
}
//Add item to the table, db is the database object created by SQLite db.openDatabase, appointment is a object.
export const addAppointment = (db,appointment) =>{
    db.transaction( tx => {
        tx.executeSql(`insert into appointment (title, startdate ,enddate,description) values (${appointment.title},${appointment.startdate},${appointment.enddate},${appointment.description} )`,[], ()=> console.log('sucess'),()=>console.log('add fail'))
        tx.executeSql('select * from appointment', [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
    })
}

export const updateAppointment = (db,id,appointment) => {
    db.transaction(tx => {
        tx.executeSql(`update appointment SET title = ${appointment.title}, startdate = ${appointment.startdate},enddate = ${appointment.enddate},description = ${appointment.description} where id = ?` ,[id])
    })

}

export const deleteAppointment = (db,id) => {
    db.transaction(tx => {
        tx.executeSql('delete from appointment where id = ?',[id])
    } )
}

export const fetchAppointment = (db) =>{
    db.transaction(tx => {
        tx.executeSql('select * from appointment', [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
    
    } )
}
export const readOneAppointment = (db) => {
    db.transaction(tx => {
        tx.executeSql('select * from appointment where id = ?', [id], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
    
    } )
}