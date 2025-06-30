import Item from '../models/Item.js';
import cloudinary from '../utils/cloudinary.js';

// Item Intractions

export const createItem = async (req, res) => {
  try {
    const { name, price, image, description } = req.body;

    if (!name) return res.status(400).json({ message: 'Name is required' });

    const newItem = new Item({
      name,
      price,
      image,
      description,
      createdBy: req.user._id,
    });

    await newItem.save();
    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ message: 'Failed to create item', error: err.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate('createdBy', 'name email');
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items', error: err.message });
  }
};

console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Cloudinary upload function
export const uploadItemImage = async (req, res) => {
  try {
    if (!req.file?.path) return res.status(400).json({ error: 'No file uploaded' });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'ecommerce_items',
    });

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
};
