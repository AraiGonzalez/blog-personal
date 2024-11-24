const express = require('express');
const router = express.Router();

// Ruta de prueba para verificar la sesión
router.get('/test-session', (req, res) => {
  res.json({ session: req.session });
});

module.exports = router;