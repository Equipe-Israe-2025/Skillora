import { describe, it, expect, vi, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock des services
vi.mock('../services/notificationService.js', () => ({
  getNotificationsService: vi.fn(),
  deleteNotificationService: vi.fn()
}));

import {
  getNotificationsService,
  deleteNotificationService
} from '../services/notificationService.js';

import {
  getNotifications,
  deleteNotification
} from './notificationController.js';

// App Express de test
const app = express();
app.use(express.json());
app.get('/notifications/:userId', getNotifications);
app.delete('/notifications/:notificationId', deleteNotification);

describe('NotificationController - Tests d\'Intégration', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /notifications/:userId', () => {
    it('devrait retourner les notifications de l\'utilisateur (200)', async () => {
      const mockNotifications = [
        { id: 1, message: 'Notif 1', userId: '123' },
        { id: 2, message: 'Notif 2', userId: '123' }
      ];
      getNotificationsService.mockResolvedValue(mockNotifications);

      const res = await request(app).get('/notifications/123');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        data: mockNotifications
      });
      expect(getNotificationsService).toHaveBeenCalledWith('123');
    });

    it('devrait retourner 500 si le service échoue', async () => {
      getNotificationsService.mockRejectedValue(new Error('Erreur DB'));

      const res = await request(app).get('/notifications/123');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        success: false,
        message: 'Error fetching notifications',
        error: 'Erreur DB'
      });
    });
  });

  describe('DELETE /notifications/:notificationId', () => {
    it('devrait supprimer la notification avec succès (200)', async () => {
      deleteNotificationService.mockResolvedValue();

      const res = await request(app).delete('/notifications/456');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: 'Notification deleted successfully'
      });
      expect(deleteNotificationService).toHaveBeenCalledWith('456');
    });

    it('devrait retourner 500 si la suppression échoue', async () => {
      deleteNotificationService.mockRejectedValue(new Error('Erreur suppression'));

      const res = await request(app).delete('/notifications/456');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        success: false,
        message: 'Error deleting notification',
        error: 'Erreur suppression'
      });
    });
  });
});
