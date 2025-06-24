import User from '../models/User.js';

// Save user after Google login
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
  }
};