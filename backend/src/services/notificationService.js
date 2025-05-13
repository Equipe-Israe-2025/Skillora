import { Notification } from '../sync.js';

export async function getNotificationsService(userId) {
  return await Notification.findAll({
    where: { Id_U: userId },
    order: [['date', 'DESC']],
  });
}

export async function deleteNotificationService(notificationId) {
  const notification = await Notification.findByPk(notificationId);
  
  if (!notification) {
    throw new Error('Notification not found');
  }

  await notification.destroy();
  return notification;
}
