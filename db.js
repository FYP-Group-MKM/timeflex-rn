import * as sqlite from 'expo-sqlite';

export const db = sqlite.openDatabase('appointments');

//This JavaScript is usefor stroing the function of database manipulation
//db is the database object created by SQLite from expo-sqlite libray.
export const createTable = (db) => {
    db.transaction(tx => {
        tx.executeSql(
            'create table if not exists appointment (id INT primary key not null unique, title text, startdate text, enddate text, description text);'
            , [], () => console.log(`Create Database sucess`), () => console.log(`Create Database Fail`)
        )
    })
}
//Add item to the table, db is the database object created by SQLite db.openDatabase, appointment is a object.
export const addAppointment = (db, appointment,id) => {
    db.transaction(tx => {
        tx.executeSql('insert into appointment ( id,title, startdate ,enddate, description) values (?,?,?,?,?);', [id,appointment.title, appointment.startdate, appointment.enddate, appointment.description], () => console.log('ADD Appointment sucess'), (error) => console.log('Error'))
    })
}

export const updateAppointment = (db, id, appointment) => {
    db.transaction(tx => {
        tx.executeSql('update appointment SET title = ?, startdate = ?,enddate = ?,description = ? where id = ?;', [appointment.title, appointment.startdate, appointment.enddate, appointment.description, id], () => console.log('Update Sucess'), () => console.log('Update Fail'))
    })
}

export const deleteAppointment = (db, id) => {
    db.transaction(tx => {
        tx.executeSql('delete from appointment where id = ?', [id], () => console.log('Delete Sucess'), () => console.log('Delete Fail'))
    })
}

export const fetchAppointments = (db) => {
    let data
    data = db.transaction(tx => {
        tx.executeSql('select * from appointment', [], (_, { rows }) =>
            data = rows, () => console.log('error')
        );
    })
    return data
}

export const readOneAppointment = (db, id) => {
    db.transaction(tx => {
        tx.executeSql('select * from appointment where id = ?', [id], (_, { rows }) =>
            console.log('read one data sucess', JSON.stringify(rows))
        );
    })
}

export const resetTable = (db) => {
    db.transaction(tx => {
        tx.executeSql('DROP TABLE appointment',[], () => console.log('drop sucess'), () => console.log('Fail')
        );
    })

}