exports.uploadPhoto = async (req, res) => {
  try {
    const { title, description, imageUrl, yourName, category } = req.body;

    let status = "pending";
    let uploadedByRole = "user";
    let uploadedBy = null;

    if (req.user) {
      uploadedBy = req.user.id;
      uploadedByRole = req.user.role;
      if (req.user.role === "admin") status = "published";
    }

    // Ensure category is always an array, even if frontend sends a single string
    const categoryArray = Array.isArray(category) ? category : [category];

    const photo = new Gallery({
      title,
      description,
      imageUrl,
      category: categoryArray, // Save as array
      yourName,
      uploadedBy,
      uploadedByRole,
      status,
    });

    await photo.save();
    res.status(201).json(photo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload photo", error: err.message });
  }
};