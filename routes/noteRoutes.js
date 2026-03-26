const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/notesGET' ,authenticateToken, noteController.getAllNotes);
router.get('/nota/:id', authenticateToken, noteController.getNoteById);



router.post('/notes',authenticateToken, noteController.createNote);

router.put('/notes/:id',authenticateToken, noteController.updateNote);

router.delete('/notesRIM/:id',authenticateToken, noteController.deleteNote);

router.get('/notes/last', authenticateToken, noteController.getLastNote);




module.exports = router;
