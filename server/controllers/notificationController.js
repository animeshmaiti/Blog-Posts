import Notification from "../Schema/Notification.js";


export const getNewNotifications = async (req, res) => {
    const user_id = req.user._id;
    try {
        const response=await Notification.exists({ notification_for: user_id, seen: false, user: { $ne: user_id } });
        if (!response) {
            return res.status(200).json({ new_notification_available: false });
        }
        return res.status(200).json({new_notification_available: true});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
} 