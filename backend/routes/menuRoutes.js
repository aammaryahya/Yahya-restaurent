const express = require('express');
const router = express.Router();
const { getMenu, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, getMenu);

router.post('/', auth, role(['admin']), createMenuItem);
router.put('/:id', auth, role(['admin']), updateMenuItem);
router.delete('/:id', auth, role(['admin']), deleteMenuItem);


module.exports = router;