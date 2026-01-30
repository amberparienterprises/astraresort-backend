// const express = require('express');
// const router = express.Router();
// const { 
//   createVideo, 
//   getVideos, 
//   deleteVideo 
// } = require('../controllers/videoController');

// // Define routes
// router.route('/')
//   .get(getVideos)
//   .post(createVideo);

// router.route('/:id')
//   .delete(deleteVideo);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { 
  createVideo, 
  getVideos, 
  deleteVideo 
} = require('../controllers/videoController');

// Import your middlewares
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Route to get videos (Public - guests can view)
router.get('/', getVideos);

// Route to add a video (Admin only)
router.post('/', auth, role("admin"), createVideo);

// Route to delete a video (Admin only)
router.delete('/:id', auth, role("admin"), deleteVideo);

module.exports = router;