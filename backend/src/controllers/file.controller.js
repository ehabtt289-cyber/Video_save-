const cloudinary = require("../config/cloudinary");
const File = require("../models/File");

function uploadBufferToCloudinary(buffer, resourceType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: "video-drop" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

exports.uploadFiles = async (req, res, next) => {
  try {
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ error: "No files provided" });

    const saved = [];
    for (const f of files) {
      const resourceType = f.mimetype.startsWith("video/") ? "video" : "image";
      const result = await uploadBufferToCloudinary(f.buffer, resourceType);

      const doc = await File.create({
        originalName: f.originalname,
        publicId: result.public_id,
        cloudinaryUrl: result.url,
        secureUrl: result.secure_url,
        fileType: resourceType,
        resourceType,
        fileSize: f.size,
      });
      saved.push(doc);
    }

    res.status(201).json({ files: saved });
  } catch (err) {
    next(err);
  }
};

exports.listFiles = async (_req, res, next) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    res.json({ files });
  } catch (err) {
    next(err);
  }
};

exports.deleteFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    await cloudinary.uploader.destroy(file.publicId, {
      resource_type: file.resourceType,
    });
    await file.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
