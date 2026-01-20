import mysql from "mysql2/promise";

export const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Reinan@021",
    database: "cadastro"
});