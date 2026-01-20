const express = require('express');
const {
  createBlog,
  getBlogBySlug,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  approveBlog,
  adminList,
  getAllBlogsAdmin
} = require('../controllers/blogController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

// Public
router.get('/', getAllBlogs);
router.post('/', auth, createBlog);


// Admin only
router.put('/:id', auth, role('admin'), updateBlog);
router.delete('/:id', auth, role('admin'), deleteBlog);
router.put('/:id/approve', auth, role('admin'), approveBlog);

router.get('/admin/list', auth, role('admin'), adminList);
router.get('/admin/list/all', auth, role('admin'), getAllBlogsAdmin);

router.get('/:slug', getBlogBySlug);

module.exports = router;
