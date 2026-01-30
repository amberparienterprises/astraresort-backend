
// require('dotenv').config();
// const cors = require("cors");
// const express = require('express');
// const mongoose = require('mongoose');
// const authRoutes = require('./routes/authRoutes');
// const uploadRoutes = require('./routes/uploadRoutes');
// const blogRoutes = require('./routes/blogRoutes');
// const galleryRoutes = require('./routes/galleryRoutes');
// const enquiryRoutes = require('./routes/enquiryRoutes');


// const app = express();
// app.use(cors({ origin: "http://localhost:3000" }));
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// app.use('/auth', authRoutes);
// app.use('/blogs', blogRoutes);
// app.use('/files', uploadRoutes);
// app.use('/gallery', galleryRoutes); 
// app.use('/enquiries', enquiryRoutes);  // ✅ NEW
// app.use("/api/upload", uploadRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
require('dotenv').config();
const cors = require("cors");
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const blogRoutes = require('./routes/blogRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const calanderRoutes = require('./routes/calanderRoutes');
const slideRoutes = require('./routes/slideRoutes');
const videoRoutes = require('./routes/videoRoutes');
const popupRoutes = require('./routes/popupRoutes');

const app = express();

// Parse allowed origins from .env
const allowedOrigins = process.env.CORS_ORIGIN.split(",").map(o => o.trim());

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);
app.use('/files', uploadRoutes);
app.use('/gallery', galleryRoutes);
app.use('/enquiries', enquiryRoutes);
app.use("/api/upload", uploadRoutes);
app.use('/api/slides', slideRoutes);
app.use('/videos', videoRoutes);
app.use('/api/popup', popupRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on ${PORT}`));
