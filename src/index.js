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
    
    if (token === 'cdeccac7dc6a6d1412808a4') {
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
    let { account } = req.body;
    res.status(200).json({
        option_name: 'Selección de numero de cuenta',
        message: `Se genero su estado de cuenta correctamente, ya puedes visualizarlo\nhttps://erppay.s3.us-east-1.amazonaws.com/estados_cuenta/84347-2024-08-08T19:42:39.379Z.pdf`,
        options: [
          {
            key: '12345',
            value: 'Opcion1'
          },
          {
            key: '65476',
            value: 'Opcion2'
          }
        ]
    })
})

app.listen(port, () => {
  console.log(`App escuchando en el puerto ${port}`);
});
