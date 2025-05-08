import { getNotificationsService, 
   deleteNotificationService } from '../services/notificationService.js';

export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await getNotificationsService(userId);

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await deleteNotificationService(notificationId);

    return res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message,
    });
  }
};
