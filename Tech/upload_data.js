const xlsx = require('xlsx'); // Importamos la libreria para leer excel
require('dotenv').config() // Obetenmos las variables de entorno
const bcrypt = require('bcrypt'); // Importamos la libreria bcrypt para hashear la contraseña

const DB_URL = process.env.DB_URL || ''; // Obtener la variable de entorno de la conexion a la BD
const mongoose = require('mongoose'); // Importo la libreria mongoose
mongoose.connect(DB_URL) // Creo la cadena de conexion
const UserSchema = require('./models/User'); // Importamos el modelo de usuarios

/** Leer el archivo excel */
const workbook = xlsx.readFile('datos.xlsx') // Leer el archivo
const sheet_list = workbook.SheetNames // Obtenemos la lista de hojas del excel
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_list[0]]) // Convertimos la informacion de la hoja en JSON

/** Tranformamos la informacion de cada usuario del excel */
for(const user of data){
    // Hasheamos la clave
    user.email = user.email.trim().toLowerCase()
    const hashedPassword = bcrypt.hashSync(user.password, 10)
    // Seteamos la contraseña con la nueva hasheada
    user.password = hashedPassword

    UserSchema({
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        id: user.id,
        password: hashedPassword
    }).save().then((result) => {
        console.log("Usuario subido:", user.name)
    }).catch((err) => {
        console.log("Error subiendo el usuario", user.name)
    })
}

/** Subimos la informacion a la base de datos pasandole el array */
// UserSchema.insertMany(data).then(() => {
//     console.log("Informacion subida exitosamente")
// }).catch(err => console.log("Error subiendo la informacion", err))