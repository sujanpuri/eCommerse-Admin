import Item from '../models/Item.js';
import cloudinary from '../utils/cloudinary.js';

// Item Intractions

export const createItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      quantity,
    } = req.body;

    const soldout = quantity <= 0;

    const newItem = await Item.create({
      name,
      description,
      price,
      image,
      category,
      quantity,
      soldout,
      restockHistory: [{ quantity }],
    });

    res.status(201).json({ message: 'Item created', item: newItem });
  } catch (err) {
    console.error('Create Item Error:', err);
    res.status(500).json({ error: 'Failed to create item' });
  }
};

export const restockItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.quantity += quantity;
    item.soldout = item.quantity === 0;
    item.restockHistory.push({ quantity });

    await item.save();

    res.json({ message: 'Restocked successfully', item });
  } catch (err) {
    res.status(500).json({ error: 'Restock failed' });
  }
};

export const recordSale = async (req, res) => {
  try {
    const { quantity } = req.body;

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (item.quantity < quantity)
      return res.status(400).json({ error: 'Not enough stock' });

    item.quantity -= quantity;
    item.soldCount += quantity;
    item.soldout = item.quantity === 0;
    item.salesHistory.push({ quantity });

    await item.save();

    res.json({ message: 'Sale recorded', item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record sale' });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find(); // most recent first
    res.status(200).json(items);
    console.log('Items fetched successfully');
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items', error: err.message });
    console.error('Error fetching items:', err);
  }
};

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
