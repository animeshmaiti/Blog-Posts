import Notification from '../Schema/Notification.js';


export const getNewNotifications = async (req, res) => {
    const user_id = req.user._id;
    try {
        const response = await Notification.exists({ notification_for: user_id, seen: false, user: { $ne: user_id } });
        if (!response) {
            return res.status(200).json({ new_notification_available: false });
        }
        return res.status(200).json({ new_notification_available: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getNotifications = async (req, res) => {
    const user_id = req.user._id;
    const { page, filter, deleteDocCount } = req.body;
    const limit = 10;
    const findQuery = {
        notification_for: user_id,
        user: { $ne: user_id }
    }
    const skip = (page - 1) * limit;
    if (filter !== 'all') {
        findQuery.type = filter;
    }
    if (deleteDocCount) {
        skip -= deleteDocCount;
    }
    try {
        const notifications = await Notification.find(findQuery)
            .skip(skip)
            .limit(limit)
            .populate('blog', 'title blog_id author')
            .populate('user', 'personal_info.profile_img personal_info.fullname personal_info.username')
            .populate('comment', 'comment')
            .populate('replied_on_comment', 'comment')
            .populate('reply', 'comment')
            .sort({ createdAt: -1 })
            .select('createdAt type seen reply');

        await Notification.updateMany(findQuery, { $set: { seen: true } })
            .skip(skip)
            .limit(limit);
            
        return res.status(200).json({ notifications })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const allNotificationsCount = async (req, res) => {
    const user_id = req.user._id;
    const { filter } = req.body;
    const findQuery = {
        notification_for: user_id,
        user: { $ne: user_id }
    }
    if (filter !== 'all') {
        findQuery.type = filter;
    }
    try {
        const count = await Notification.countDocuments(findQuery);
        return res.status(200).json({ totalDocs: count });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}