const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserSchema = require('../models/User');
const MessageSchema = require('../models/Message');
const UserController = require('../controllers/UserController'); //Importando el controlador
const multer = require('multer');
const userController = new UserController(); // creando una instancia del controlador

// Middleware para analizar el cuerpo de las solicitudes como JSON
router.use(express.json());

router.get('/user', async (req, res) => {
    try {
        //Traer todos los usuarios
        let users = await UserSchema.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener los usuarios' });
    }
});

router.get('/user/:id', async (req, res) => {
    try {
        //Traer un usuario específico pasando el ID
        const id = req.params.id;
        const user = await UserSchema.findById(id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener el usuario' });
    }
});

router.post('/user', async (req, res) => {
    try {
        //Crear un usuario
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new UserSchema({
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            id: req.body.id,
            password: hashedPassword
        });

        const result = await user.save();
        res.json(result);
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ status: 'error', message: 'El correo ya fue registrado' });
        } else {
            res.status(500).json({ status: 'error', message: err.message });
        }
    }
});

router.patch('/user/:id', userController.validateToken, async (req, res) => {
    try {
        //Actualizar un usuario
        const id = req.params.id;
        const updateUser = {
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            id: req.body.id
        };

        const result = await UserSchema.findByIdAndUpdate(id, updateUser, { new: true });
        if (!result) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Error al actualizar el usuario' });
    }
});

router.delete('/user/:id', userController.validateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const result = await UserSchema.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }
        res.json({ status: 'success', message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Error al eliminar el usuario' });
    }
});

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const result = await userController.login(email, password);
        if (result.status === 'error') {
            res.status(401).json(result);
        } else {
            res.json(result);
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al iniciar sesión' });
    }
});

//Configuración de la librería multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('El archivo no es una imagen'));
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Servicio web para el almacenamiento de archivos
router.post('/upload/:id/user', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'No se proporcionó ningún archivo' });
    }

    try {
        const id = req.params.id;
        const updateUser = {
            avatar: req.file.path
        };

        const result = await UserSchema.findByIdAndUpdate(id, updateUser, { new: true });
        if (!result) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }
        res.json({ status: 'success', message: 'Archivo subido correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Error al actualizar el registro' });
    }
});

module.exports = router;    