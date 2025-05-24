const { Sale } = require('../models');

exports.create = async (req, res) => {
  try {
    const { clientId, amount, date } = req.body;
    if (!clientId || !amount) {
      return res.status(400).json({ message: 'Client ID and amount are required.' });
    }
    if( date && isNaN(new Date(date).getTime())) {
      return res.status(400).json({ message: 'Invalid date format.' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero.' });
    }
    
    const saleData = { clientId, amount };
    if (date) {
      saleData.date = new Date(date);
    }
    const sale = await Sale.create(saleData);
    res.status(201).json(sale);
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ message: 'Error creating sale', error: error.message });
  }
};