import Resource from "../models/Resource.js";

// Create resource (protected)
export const createResource = async (req, res, next) => {
  try {
    const { title, description, fileUrl } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });

    const resource = await Resource.create({
      title,
      description,
      fileUrl,
      uploadedBy: req.user._id
    });

    res.status(201).json(resource);
  } catch (err) {
    next(err);
  }
};

// List resources (public)
export const listResources = async (req, res, next) => {
  try {
    const resources = await Resource.find().populate("uploadedBy", "name email");
    res.json(resources);
  } catch (err) {
    next(err);
  }
};

// Get single
export const getResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).populate("uploadedBy", "name email");
    if (!resource) return res.status(404).json({ message: "Not found" });
    res.json(resource);
  } catch (err) {
    next(err);
  }
};
