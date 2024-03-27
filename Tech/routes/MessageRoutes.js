const express = require('express');
const router = express.Router();
const MessageSchema = require('../models/Message');

// Middleware para analizar el cuerpo de las solicitudes como JSON
router.use(express.json());

router.get('/message', async (req, res) => {
    try {
        // Traer todos los mensajes con información del remitente y destinatario
        const messages = await MessageSchema.find()
            .populate({
                path: 'from',
                select: '-password'
            })
            .populate({
                path: 'to',
                select: '-password'
            });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener los mensajes' });
    }
});

router.post('/message', async (req, res) => {
    try {
        // Crear un nuevo mensaje
        const message = new MessageSchema({
            body: req.body.body,
            from: req.body.from,
            to: req.body.to
        });

        const result = await message.save();
        res.json(result);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

module.exports = router;    