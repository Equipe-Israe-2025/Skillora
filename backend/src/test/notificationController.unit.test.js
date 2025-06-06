import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  getNotifications,
  deleteNotification
} from './notificationController.js';

// Mock des services
vi.mock('../services/notificationService.js', () => ({
  getNotificationsService: vi.fn(),
  deleteNotificationService: vi.fn()
}));

import {
  getNotificationsService,
  deleteNotificationService
} from '../services/notificationService.js';

describe('NotificationController - Tests Unitaires', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('devrait retourner les notifications avec succès', async () => {
      const mockNotifications = [
        { id: 1, message: 'Notif 1', userId: '123' },
        { id: 2, message: 'Notif 2', userId: '123' }
      ];
      getNotificationsService.mockResolvedValue(mockNotifications);

      const req = { params: { userId: '123' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await getNotifications(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockNotifications
      });
      expect(getNotificationsService).toHaveBeenCalledWith('123');
    });

    it('devrait gérer les erreurs du service', async () => {
      const error = new Error('Erreur DB');
      getNotificationsService.mockRejectedValue(error);

      const req = { params: { userId: '123' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await getNotifications(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error fetching notifications',
        error: 'Erreur DB'
      });
    });
  });

  describe('deleteNotification', () => {
    it('devrait supprimer une notification avec succès', async () => {
      deleteNotificationService.mockResolvedValue();

      const req = { params: { notificationId: '456' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await deleteNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Notification deleted successfully'
      });
      expect(deleteNotificationService).toHaveBeenCalledWith('456');
    });

    it('devrait gérer les erreurs de suppression', async () => {
      const error = new Error('Erreur suppression');
      deleteNotificationService.mockRejectedValue(error);

      const req = { params: { notificationId: '456' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await deleteNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error deleting notification',
        error: 'Erreur suppression'
      });
    });
  });
});