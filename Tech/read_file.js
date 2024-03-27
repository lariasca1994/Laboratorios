const fs = require('fs');
const express = require('express');
const router = express.Router();

// Middleware para analizar el cuerpo de las solicitudes como JSON
router.use(express.json());

router.get('/departments', (req, res) => {
    fs.readFile('department.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send({ 'status': "error", "message": "Error al obtener la información" });
            return;
        }
        try {
            const departments = JSON.parse(data);
            res.json(departments);
        } catch (error) {
            res.status(500).send({ 'status': "error", "message": "Error al analizar el archivo JSON" });
        }
    });
});

router.post('/department', (req, res) => {
    fs.readFile('department.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send({ 'status': "error", "message": "Error al leer el archivo" });
            return;
        }

        try {
            var departments = JSON.parse(data);
            departments.push(req.body);
            fs.writeFile('department.json', JSON.stringify(departments), (err) => {
                if (err) {
                    res.status(500).send({ 'status': "error", "message": "Error al escribir el archivo" });
                    return;
                }
                res.json(req.body);
            });
        } catch (error) {
            res.status(500).send({ 'status': "error", "message": "Error al analizar el archivo JSON" });
        }
    });
});

module.exports = router;