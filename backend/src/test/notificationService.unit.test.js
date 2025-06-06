import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getNotificationsService, deleteNotificationService } from './notificationService.js';
import { Notification } from '../sync.js';

vi.mock('../sync.js', () => ({
  Notification: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
  },
}));

describe('Notification Service - tests unitaires', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNotificationsService', () => {
    it('devrait retourner les notifications pour un utilisateur donné', async () => {
      const userId = 123;
      const mockData = [
        { id: 1, Id_U: userId, date: new Date('2025-06-04') },
      ];

      Notification.findAll.mockResolvedValue(mockData);

      const result = await getNotificationsService(userId);

      expect(Notification.findAll).toHaveBeenCalledWith({
        where: { Id_U: userId },
        order: [['date', 'DESC']],
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('deleteNotificationService', () => {
    it('devrait supprimer une notification existante', async () => {
      const notificationId = 45;
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

    it('devrait lancer une erreur si la notification n\'existe pas', async () => {
      Notification.findByPk.mockResolvedValue(null);

      await expect(deleteNotificationService(999)).rejects.toThrow('Notification not found');
    });
  });
});
