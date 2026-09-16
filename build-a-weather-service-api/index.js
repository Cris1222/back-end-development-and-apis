import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import weatherRouter from './weather.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Explicit GET / route serving index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET /api/info route returning an endpoints array
app.get('/api/info', (req, res) => {
  res.status(200).json({
    endpoints: [
      '/api/info',
      '/api/weather',
      '/api/weather/:city',
      '/api/data'
    ]
  });
});

app.use('/api/weather', weatherRouter);

app.route('/api/data')
  .get((req, res) => {
    res.status(200).json({ success: true, data: [] });
  })
  .post((req, res) => {
    res.status(201).json({ success: true, message: 'Data created' });
  });

app.listen(PORT);