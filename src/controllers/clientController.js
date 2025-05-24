const { Client } = require('../models');
const { Op } = require('sequelize');

exports.create = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error creating client', error: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { name, email } = req.query;
    const filters = {};
    if (name) filters.name = { [Op.iLike]: `%${name}%` };
    if (email) filters.email = { [Op.iLike]: `%${email}%` };

    const clients = await Client.findAll({ 
      where: filters,
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [{
        association: 'sales',
        required: false,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'clientId'],
        },
      }],
    });
    
    // Ensure sales is an array for each client
    const clientsWithSales = clients.map(client => {
      const plainClient = client.get({ plain: true });
      if (!plainClient.sales) plainClient.sales = [];
      return plainClient;
    });
    
    res.status(200).json(clientsWithSales);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [{
        association: 'sales',
        required: false,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'clientId'],
        },
      }],
    });
    
    if (!client) return res.status(404).json({ message: 'Cliente não encontrado.' });

    const plainClient = client.get({ plain: true });
    if (!plainClient.sales) plainClient.sales = [];
    
    res.json(plainClient);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching client', error: error.message });
  }
}

exports.update = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Cliente não encontrado.' });

    await client.update(req.body);
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error updating client', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Cliente não encontrado.' });

    await client.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting client', error: error.message });
  }
};
