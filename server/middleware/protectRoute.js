import jwt from 'jsonwebtoken';
import User from '../Schema/User.js';

const protectRoute = async(req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(401).json({ error: 'Unauthorized' });        
    }

    // Exclude password from the user object
    const user = await User.findById(decoded.userId).select('-password -blogs -__v -joinedAt -updatedAt');
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.log(user);
    req.user = user;

    next();
  } catch (error) {
    // console.log('Error in protectRoute: ', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export default protectRoute;