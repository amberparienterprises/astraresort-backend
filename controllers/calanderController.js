// Updated Controller
const Calander = require("../models/Calander");

// Public - list all published events in the desired format
exports.getAllPhotos = async (req, res) => {
  try {
    const events = await Calander.find({ status: "published" }).sort({ fromdate: 1 }); // Sort by event date
    
    // Transform the data to match your desired format
    const formattedEvents = events.map(event => ({
      id: event._id.toString(),
      title: event.title,
      date: event.fromdate.toISOString(), // Convert to ISO string format
      location: event.location || "Location TBD",
      description: event.description || "",
      image: event.imageUrl
    }));
    
    res.json(formattedEvents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// Single event by ID
exports.getPhotoById = async (req, res) => {
  try {
    const event = await Calander.findOne({ _id: req.params.id, status: "published" });
    if (!event) return res.status(404).json({ error: "Event not found" });
    
    // Transform single event to match format
    const formattedEvent = {
      id: event._id.toString(),
      title: event.title,
      date: event.fromdate.toISOString(),
      location: event.location || "Location TBD",
      description: event.description || "",
      image: event.imageUrl
    };
    
    res.json(formattedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch event" });
  }
};

// Upload event (admin = published, user = pending)
exports.uploadPhoto = async (req, res) => {
  try {
    const { title, description, imageUrl, yourName, fromdate, todate, location } = req.body;

    // Validate required fields
    if (!title || !imageUrl || !fromdate) {
      return res.status(400).json({ 
        message: "Title, image URL, and from date are required" 
      });
    }

    let status = "pending";
    let uploadedByRole = "user";
    let uploadedBy = null;

    if (req.user) {
      uploadedBy = req.user.id;
      uploadedByRole = req.user.role;

      if (req.user.role === "admin") {
        status = "published";
      }
    }

    const event = new Calander({
      title,
      description,
      imageUrl,
      yourName,
      fromdate: new Date(fromdate), // Ensure it's a Date object
      todate: todate ? new Date(todate) : null,
      location,
      uploadedBy,
      uploadedByRole,
      status,
    });

    await event.save();
    
    // Return formatted response
    const formattedEvent = {
      id: event._id.toString(),
      title: event.title,
      date: event.fromdate.toISOString(),
      location: event.location || "Location TBD",
      description: event.description || "",
      image: event.imageUrl
    };
    
    res.status(201).json(formattedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create event" });
  }
};

// Admin - delete event
exports.deletePhoto = async (req, res) => {
  try {
    const deletedEvent = await Calander.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete event" });
  }
};
