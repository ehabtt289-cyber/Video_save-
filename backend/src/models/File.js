const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  publicId: { type: String, required: true },
  cloudinaryUrl: { type: String, required: true },
  secureUrl: { type: String, required: true },
  fileType: { type: String, required: true }, // "image" | "video"
  resourceType: { type: String, required: true }, // cloudinary resource_type
  fileSize: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", FileSchema);
