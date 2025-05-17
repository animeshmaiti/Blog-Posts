import jwt from 'jsonwebtoken';
import User from '../Schema/User.js';

const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded) {
                const user = await User.findById(decoded.userId).select('-password');
                if (user) {
                    req.user = user;
                }
            }
        }
    } catch (error) {
        // ignore any auth errors silently
    }
    next(); // always proceed
};

export default optionalAuth;
