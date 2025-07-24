const express = require('express');
const router = express.Router();
const { addDocument, deleteDocument, getUserDocuments} = require('../controllers/documentController');
const isLoggedIn = require('../middlewares/isLoggedIn');

router.post('/add', isLoggedIn, addDocument);
router.get('/all', isLoggedIn, getUserDocuments);
router.delete('/:id', isLoggedIn, deleteDocument);

module.exports = router;
