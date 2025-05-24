const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const salesRoutes = require('./routes/salesRoutes');
const statsRoutes = require('./routes/statsRoutes');

app.use(express.json());

app.use('/api/login', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/statistics', statsRoutes);
app.use('/api/ping', (req,res) => {
    res.status(200).json({ message: 'pong' });
})

// tests routes
app.get('/api/protected', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Não autorizado.' });
  }
  // Simulate token verification
  if (token === 'Bearer valid_token') {
    return res.status(200).json({ message: 'Autorizado' });
  }
  return res.status(401).json({ message: 'Não autorizado.' });
});

module.exports = app;
