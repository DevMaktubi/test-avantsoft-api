const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { create } = require('../controllers/saleController');

router.use(auth);
router.post('/', create);

module.exports = router;
