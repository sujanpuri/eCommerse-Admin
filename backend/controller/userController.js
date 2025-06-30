import User from '../models/User.js';
import Item from '../models/Item.js';


// User Intractions
export const saveUser = async (req, res) => {
  try {
    const { name, email, photo } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, photo }); // default role = 'user'
      await user.save();
    }

    res.status(200).json({ message: 'User saved', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save user' });
    console.error('Error saving user:', err);
  }
};

export const getAllUsers = async (req, res)=> {
  try {
    const users = await User.find() // Fetch all users from the database
    // console.log('Fetched users:', users);
    res.status(200).json(users); // Return the users as JSON response
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export const updateUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    const allowedRoles = ["admin", "staff", "user"];
    if (!allowedRoles.includes(newRole)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    );

    res.status(200).json({ message: "Role updated", user: updatedUser });
  } catch (err) {
    console.error("Error updating user role:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateLoggedInUser = async (req, res) => {
  try {
    const { email, name, photo } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { name, photo },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};


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