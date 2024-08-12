import express from 'express'
import cors from 'cors';
import { AppRoutes } from './presentation/routes.js';
import { StorageAdapter } from './config/storage.adapter.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

StorageAdapter.initStorage({ bucket_name: 'erppay' });

// Rutas
app.use(AppRoutes.routes);


app.get('/', (req, res) => {
  res.send('Hola Mundo!');
});


app.listen(port, () => {
  console.log(`App escuchando en el puerto ${port}`);
});
