const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Tambahkan log untuk memeriksa apakah createProduct adalah fungsi
console.log('createProduct:', itemController.createProduct);

// Gunakan authMiddleware dan roleMiddleware untuk proteksi route
router.post('/products', authMiddleware, roleMiddleware(['admin']), itemController.createProduct);
router.get('/products', itemController.getAllProducts);
router.get('/products/:id', itemController.getProductById);
router.put('/products/:id', authMiddleware, roleMiddleware(['admin']), itemController.updateProduct);
router.delete('/products/:id', authMiddleware, roleMiddleware(['admin']), itemController.deleteProduct);

module.exports = router;