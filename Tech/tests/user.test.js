const request = require('supertest'); // Librería para probar APIs
const app = require('../index.js'); // importando todas las rutas

const objectToTest = {
    "id": 7845454,
    "name": "Brad",
    "lastname": "Pitt",
    "email": "brad-pitt@correo.com",
    "password": "SoyBrad"
}
let userId;
let token;

/** Descripción de la Prueba */
describe('GET /', () => {
    /** Descripción específica del caso a probar */
    it('responde con el estado 200', async () => {
        /** Simulando la solicitud HTTP */
        const response = await request(app).get('/');
        /** Defino los valores esperados */
        expect(response.status).toBe(200);
    })
    it('responde con el texto "Hello world"', async () => {
        const response = await request(app).get('/');
        expect(response.text).toBe('Hello world');
    })
})

describe('POST /user', () => {
    it('crea un nuevo usuario en la DB y responde con los datos', async () => {
        const response = await request(app).post('/user').send(objectToTest)
        /** Asignando el _id del usuario nuevo a la variable userId
         *  para ser usado en las otras pruebas */
        userId = response.body._id;

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('_id')
        expect(response.body.name).toBe(objectToTest.name)
        expect(response.body.lastname).toBe(objectToTest.lastname)
        expect(response.body.email).toBe(objectToTest.email)
    })
})

describe('GET /user/:id', () => {
    it('responde con un objeto que contiene un usuario específico', async () => {
        const response = await request(app).get('/user/' + userId);
        expect(response.status).toBe(200);
        expect(typeof response.body === "object").toBe(true);
        expect(response.body).toHaveProperty('_id')
        expect(response.body.name).toBe(objectToTest.name)
        expect(response.body.lastname).toBe(objectToTest.lastname)
        expect(response.body.email).toBe(objectToTest.email)
    })
})

describe('POST /login', () => {
    it('Inicio de sesión exitoso con email y contraseña', async () => {
        const response = await request(app).post('/login').send(objectToTest)

        token = response.body.token;
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('token')
        expect(response.body.status).toBe("success")
    })

    it('Error de inicio de sesión con email y contraseña', async () => {
        const user = {
            "email": "lucia-pardo10@correo.com",
            "password": "UsuarioDePrueba1111"
        }

        const response = await request(app).post('/login').send(user)

        expect(response.statusCode).toBe(401)
        expect(response.body).not.toHaveProperty('token')
        expect(response.body.status).toBe("error")
    })
})

describe('DELETE /user/:id', () => {
    it('Eliminar usuario exitosamente con _id', async () => {
        const response = await request(app).delete('/user/' + userId)
            .set('Authorization', 'Bearer ' + token)
        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe("success")
    })
})