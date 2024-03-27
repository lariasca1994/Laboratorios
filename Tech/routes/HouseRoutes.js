const express = require('express');
const router = express.Router();
const HouseSchema = require('../models/House');

// Middleware para analizar el cuerpo de las solicitudes como JSON
router.use(express.json());

router.post('/house', async (req, res) => {
    try {
        // Crear una nueva casa
        const house = new HouseSchema({
            state: req.body.state,
            city: req.body.city,
        });

        const result = await house.save();
        res.json(result);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

module.exports = router;