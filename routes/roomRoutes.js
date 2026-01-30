const express = require('express');
const router = express.Router();
const { createRoomCategory, getAllRooms,updateRoomCategory ,deleteRoomCategory} = require('../controllers/roomController');

router.route('/')
    .get(getAllRooms)
    .post(createRoomCategory);
router.route('/:id')
    .patch(updateRoomCategory)
    .delete(deleteRoomCategory);

module.exports = router;