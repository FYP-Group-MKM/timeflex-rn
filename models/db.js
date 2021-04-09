import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('db.db');
module.exports = db;
