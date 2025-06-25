import User from '../models/User.js';

// console.log('User controller loaded');
// Save user after Google login
export const saveUser = async (req, res) => {
  // console.log('Received request to save user:', req.body);
  try {
    const { name, email, photo } = req.body;
    // console.log('Saving user:', { name, email, photo });
    if (!email) return res.status(400).json({ error: 'Email required' });

    let user = await User.findOne({ email });
    // console.log('Creating new user:', user);

    if (!user) {
      user = new User({ name, email, photo }); // default role = 'user'
      await user.save();
      // console.log('New user created:', user);
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
    console.log('Fetched users:', users);
    res.status(200).json(users); // Return the users as JSON response
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}