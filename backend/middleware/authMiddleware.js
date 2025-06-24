import User from '../models/User.js';

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

// not in use yet, but can be used to verify user.