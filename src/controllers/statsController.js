const { Client, Sale, db } = require("../models");
const { QueryTypes } = require("sequelize");

exports.mostVolume = async (req, res) => {
  // Return the client with the most sales volume, being the length of the sales array
  try {
    const clients = await Client.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          association: "sales",
          required: false,
          attributes: {
            exclude: ["createdAt", "updatedAt", "clientId"],
          },
        },
      ],
    });

    const clientsWithSales = clients.map((client) => {
      const plainClient = client.get({ plain: true });
      if (!plainClient.sales) plainClient.sales = [];
      return plainClient;
    });

    const mostVolumeClient = clientsWithSales.reduce((prev, current) => {
      return prev.sales.length > current.sales.length ? prev : current;
    });

    res.json({
      ...mostVolumeClient,
      salesCount: mostVolumeClient.sales.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching most volume client",
      error: error.message,
    });
  }
};

exports.biggestSaleMean = async (req, res) => {
  // Return the client with the biggest sale value mean
  try {
    const clients = await Client.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          association: "sales",
          required: false,
          attributes: {
            exclude: ["createdAt", "updatedAt", "clientId", "date"],
          },
        },
      ],
    });

    const clientsWithSales = clients.map((client) => {
      const plainClient = client.get({ plain: true });
      if (!plainClient.sales) plainClient.sales = [];
      return plainClient;
    });

    const clientsWithMean = clientsWithSales.map((client) => {
      const salesValue = client.sales.reduce((acc, sale) => {
        return (acc += Number(sale.amount));
      }, 0);
      const salesLength = client.sales.length;
      const mean = salesLength > 0 ? salesValue / client.sales.length : 0;

      return { ...client, mean };
    });

    const biggerSaleMeanClient = clientsWithMean.sort(
      (a, b) => b.mean - a.mean
    )[0];

    res.json(biggerSaleMeanClient);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching bigger sale mean client",
      error: error.message,
    });
  }
};

exports.biggestSaleFrequency = async (req, res) => {
  // Return the client with the biggest sale frequency
  try {
    const clients = await Client.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          association: "sales",
          required: false,
          attributes: {
            exclude: ["createdAt", "updatedAt", "clientId", "date"],
          },
        },
      ],
    });

    const clientsWithSales = clients.map((client) => {
      const plainClient = client.get({ plain: true });
      if (!plainClient.sales) plainClient.sales = [];
      return plainClient;
    });

    const clientsWithFrequency = clientsWithSales.map((client) => {
      // create a set of unique dates
      const salesWithUniqueDates = client.sales.reduce((acc, sale) => {
        const dateAlreadyInArray = acc.find((date) => date === sale.date);
        if (!dateAlreadyInArray) {
          acc.push(sale.date);
        }
        return acc;
      }, []);
      const salesLength = salesWithUniqueDates.length;
      return { ...client, frequency: salesLength };
    });

    const biggerSaleFrequencyClient = clientsWithFrequency.sort(
      (a, b) => b.frequency - a.frequency
    )[0];

    res.status(200).json(biggerSaleFrequencyClient);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching bigger sale frequency client",
      error: error.message,
    });
  }
};
