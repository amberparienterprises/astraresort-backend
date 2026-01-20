// // routes/uploadRoutes.js
// const express = require('express');
// const auth = require('../middleware/authMiddleware');
// const upload = require('../middleware/upload');
// const { uploadImageToS3, uploadPdfToS3, deleteObjectFromS3 } = require('../utils/uploadToS3');

// const router = express.Router();

// // POST /api/upload/image  (form-data: image)
// router.post('/image', auth, upload.single('image'), async (req, res) => {
//   try {
//     const { url, key } = await uploadImageToS3(req.file);
//     res.json({ url, key });
//   } catch (e) {
//     res.status(400).json({ error: e.message });
//   }
// });

// // POST /api/upload/pdf  (form-data: file)
// router.post('/pdf', auth, upload.single('file'), async (req, res) => {
//   try {
//     const { url, key } = await uploadPdfToS3(req.file);
//     res.json({ url, key });
//   } catch (e) {
//     res.status(400).json({ error: e.message });
//   }
// });

// // DELETE /api/upload?url=<encodedUrl>
// router.delete('/', auth, async (req, res) => {
//   try {
//     const { url } = req.query;
//     if (!url) return res.status(400).json({ error: 'url is required' });
//     await deleteObjectFromS3(url);
//     res.json({ message: 'Deleted' });
//   } catch (e) {
//     res.status(400).json({ error: e.message });
//   }
// });

// module.exports = router;
const express = require('express');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // multer memoryStorage
const { uploadImageToS3 } = require('../utils/uploadToS3');

const router = express.Router();

router.post('/image', auth, upload.single('image'), async (req, res) => {
  try {
    const { filename, overwrite } = req.body; // optional
    const { url, key } = await uploadImageToS3(req.file, filename, { overwrite: overwrite === 'true' });
    res.json({ url, key });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;