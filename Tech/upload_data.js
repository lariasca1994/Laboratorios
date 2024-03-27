const xlsx = require('xlsx'); // Importamos la librería para leer archivos Excel
require('dotenv').config(); // Obtenemos las variables de entorno
const bcrypt = require('bcrypt'); // Importamos la librería bcrypt para hashear contraseñas

const DB_URL = process.env.DB_URL || ''; // Obtener la variable de entorno de la conexión a la BD
const mongoose = require('mongoose'); // Importamos la librería mongoose
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }) // Creamos la conexión con MongoDB
    .then(() => console.log('Conexión a MongoDB exitosa'))
    .catch(err => console.error('Error al conectar con MongoDB:', err));

const UserSchema = require('./models/User'); // Importamos el modelo de usuarios

/** Leer el archivo Excel */
const workbook = xlsx.readFile('datos.xlsx'); // Leemos el archivo Excel
const sheet_list = workbook.SheetNames; // Obtenemos la lista de hojas del Excel
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_list[0]]); // Convertimos la información de la hoja en JSON

/** Transformamos la información de cada usuario del Excel */
for (const user of data) {
    // Hasheamos la clave
    user.email = user.email.trim().toLowerCase();
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    // Seteamos la contraseña con la nueva hasheada
    user.password = hashedPassword;

    const newUser = new UserSchema({
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        id: user.id,
        password: hashedPassword
    });

    newUser.save()
        .then(() => {
            console.log("Usuario subido:", user.name);
        })
        .catch(err => {
            console.error("Error subiendo el usuario", user.name, err);
        });
}