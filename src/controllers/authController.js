const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erro ao processar login.' });
  }
};

exports.logout = async (req, res) => {
  try {
    // JWT is stateless, so we can't invalidate the token on the server
    // Client should discard the token
    res.status(200).json({ message: 'Logout realizado com sucesso.' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Erro ao processar logout.' });
  }
};
