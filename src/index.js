import express from 'express'
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware para validar el token


const validateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
      return res.status(403).json({ error: 'No token provided' });
    }
    
    // Aquí deberías añadir la lógica para verificar el token
    // Por ejemplo, si estás usando JWT, podrías usar la biblioteca jsonwebtoken
    // jwt.verify(token, 'secret_key', (err, decoded) => {
    //   if (err) {
    //     return res.status(403).json({ error: 'Invalid token' });
    //   }
    //   req.user = decoded;
    //   next();
    // });
  
    // Para este ejemplo, simplemente verificamos si el token es 'mi_token'
    if (token === 'mercately_erppay_caco') {
      next();
    } else {
      return res.status(403).json({ error: 'Invalid token' });
    }
  };
  




app.get('/', (req, res) => {
  res.send('Hola Mundo!');
});

app.get('/api', (req, res) => {
  res.json({ message: 'Hola desde la API!' });
});

app.post('/api/generate-edocta', validateToken, (req, res) => {
    res.status(200).json({
        message: 'Hola desde el endpoint'
    })
})

app.listen(port, () => {
  console.log(`App escuchando en el puerto ${port}`);
});
