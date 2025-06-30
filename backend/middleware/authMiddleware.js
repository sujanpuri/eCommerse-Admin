import User from '../models/User.js';

// for updating the user role.
export const verifyAdmin = async (req, res, next) => {
  const requesterEmail = req.headers['x-requester-email'];
  if (!requesterEmail) return res.status(401).json({ error: 'Requester email missing' });

  const user = await User.findOne({ email: requesterEmail });
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  req.requester = user;
  next();
};


// accessing for the admin & staff routes.
export const checkRole = async (req, res, next) => {
  try {
    const email = req.headers['x-requester-email'];

    if (!email) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'admin' || user.role === 'staff') {
      req.user = user;
      next();
    } else {
      return res.status(403).json({ message: 'Access denied: Insufficient role' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};