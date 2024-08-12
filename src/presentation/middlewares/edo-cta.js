
// Middleware para validar el token

export class EdoCtaMiddleware {

    static validateToken = (req, res, next) => {

        const token = req.headers['authorization'];

        if (!token) {
            return res.status(403).json({ error: 'No token provided' });
        }

        if (token === 'cdeccac7dc6a6d1412808a4') {
            next();
        } else {
            return res.status(403).json({ error: 'Invalid token' });
        }

    };

}