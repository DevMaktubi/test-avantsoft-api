const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/statsController');

router.use(auth);
router.get('/most-volume', controller.mostVolume);
router.get('/biggest-sale-mean', controller.biggestSaleMean);
router.get('/biggest-sale-frequency', controller.biggestSaleFrequency);

module.exports = router;
