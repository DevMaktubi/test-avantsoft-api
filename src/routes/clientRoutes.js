const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/clientController');

router.use(auth);
router.post('/', controller.create);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;