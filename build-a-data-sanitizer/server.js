const express = require('express');
const path = require('path');
const { inputCleaner, inputValidator } = require('./middleware.js');

const app = express();

app.use(express.urlencoded({ extended: true }));

// 1. Redirección explícita de la raíz a /form
app.get('/', (req, res) => {
  res.redirect('/form');
});

// 2. Archivos estáticos deshabilitando la entrega automática de index.html
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// 3. Ruta para entregar el formulario estático
app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 4. Ruta POST /submit
app.post('/submit', inputCleaner, inputValidator, (req, res) => {
  res.json({
    username: req.body.username,
    comment: req.body.comment
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});