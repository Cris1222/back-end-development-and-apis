// Middleware para sanitizar las entradas del body
const inputCleaner = (req, res, next) => {
  if (req.body && req.body.username) {
    req.body.username = req.body.username.toLowerCase();
  }

  if (req.body && req.body.comment) {
    // Elimina las etiquetas HTML usando una expresión regular
    req.body.comment = req.body.comment.replace(/<[^>]*>/g, '');
  }

  next();
};

// Middleware para validar la longitud del nombre de usuario
const inputValidator = (req, res, next) => {
  const username = req.body ? req.body.username : '';

  if (username && username.length >= 3) {
    next();
  } else {
    res.redirect('/form?error=Username must be at least 3 characters');
  }
};

export default {
  inputCleaner,
  inputValidator
};