const Blog = require('../models/Blog');
const { deleteObjectFromS3 } = require("../utils/uploadToS3");

// GET /blogs → list published blogs
exports.getAllBlogs = async (req, res) => {
  const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 });
  res.json(blogs);
};

// GET /blogs/:slug → single published blog
exports.getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' });
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
};

// POST /blogs → public submit (goes to pending unless admin);
// POST /blogs → public submit (goes to pending unless admin)
const createBlog = async (req, res) => {
  try {
    const { title, slug, meta, content, yourName } = req.body; // 👈 include yourName

    // Default values
    let status = "pending";
    let submittedByRole = "guest";
    let submittedBy = null;

    if (req.user) {
      submittedBy = req.user._id || req.user.id;  // handle both
      submittedByRole = req.user.role || "user";

      if (req.user.role === "admin") {
        status = "published";
      }
    }

    const blog = new Blog({
      title,
      slug,
      meta,
      content,
      author: submittedBy,     // 👈 still ObjectId if user logged in
      yourName,                // 👈 new optional field
      submittedBy,
      submittedByRole,
      status
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create blog" });
  }
};

  


// Admin-only

// PUT /blogs/:id → update
exports.updateBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(blog);
};

// DELETE /blogs/:id
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // 1. Collect all S3 URLs to delete
    const urlsToDelete = [];

    // Add meta image if it exists
    if (blog.meta && blog.meta.image) {
      urlsToDelete.push(blog.meta.image);
    }

    // Loop through content array to find body images
    if (blog.content && blog.content.length > 0) {
      blog.content.forEach(item => {
        if (item.type === 'image' && item.value) {
          urlsToDelete.push(item.value);
        }
      });
    }

    // 2. Perform deletions in S3
    // We use Promise.allSettled so one failed S3 delete doesn't stop the others
    await Promise.allSettled(
      urlsToDelete.map(url => deleteObjectFromS3(url))
    );

    // 3. Delete the Blog record from MongoDB
    await Blog.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true, 
      message: `Blog and ${urlsToDelete.length} associated S3 objects deleted.` 
    });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: 'Failed to delete blog', error: error.message });
  }
};

// PUT /blogs/:id/approve → approve pending
exports.approveBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, { status: 'published' }, { new: true });
  res.json(blog);
};

// GET /blogs/admin/list → list pending blogs
exports.adminList = async (req, res) => {
  const blogs = await Blog.find({ status: 'pending' }).sort({ createdAt: -1 });
  res.json(blogs);
};

// GET /blogs/admin/list/all → list all blogs
exports.getAllBlogsAdmin = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
};

exports.createBlog = createBlog;
