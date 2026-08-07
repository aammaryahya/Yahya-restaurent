const express = require('express');
const router = express.Router();
const { getTables, createTable, updateTable, deleteTable } = require('../controllers/tableController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, getTables);

router.post('/', auth, role(['admin']), createTable);
router.put('/:id', auth, role(['admin']), updateTable);
router.delete('/:id', auth, role(['admin']), deleteTable);


module.exports = router;