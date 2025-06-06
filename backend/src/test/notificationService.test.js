import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getNotificationsService, deleteNotificationService } from './notificationService.js';
import { Notification } from '../sync.js';

vi.mock('../sync.js', () => ({
  Notification: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
  },
}));

describe('Notification Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNotificationsService', () => {
    it('récupère les notifications triées par date décroissante', async () => {
      const userId = 42;
      const mockNotifications = [
        { id: 1, Id_U: userId, date: new Date('2025-01-02') },
        { id: 2, Id_U: userId, date: new Date('2025-01-01') },
      ];

      Notification.findAll.mockResolvedValue(mockNotifications);

      const result = await getNotificationsService(userId);

      expect(Notification.findAll).toHaveBeenCalledWith({
        where: { Id_U: userId },
        order: [['date', 'DESC']],
      });
      expect(result).toEqual(mockNotifications);
    });
  });

  describe('deleteNotificationService', () => {
    it('supprime une notification existante', async () => {
      const notificationId = 5;
      const mockNotification = {
        id: notificationId,
        destroy: vi.fn().mockResolvedValue(),
      };

      Notification.findByPk.mockResolvedValue(mockNotification);

      const result = await deleteNotificationService(notificationId);

      expect(Notification.findByPk).toHaveBeenCalledWith(notificationId);
      expect(mockNotification.destroy).toHaveBeenCalled();
      expect(result).toBe(mockNotification);
    });

    it('lance une erreur si la notification n\'existe pas', async () => {
      Notification.findByPk.mockResolvedValue(null);

      await expect(deleteNotificationService(999)).rejects.toThrow('Notification not found');
    });
  });
});
