// tests/encadrantController.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as encadrantService from '../../src/services/encadrantService.js';
import { getMonProfil } from './encadrantController.js';

vi.mock('../../src/services/encadrantService.js', () => ({
  getProfilEncadrant: vi.fn()
}));

describe('getMonProfil', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { Id_U: 1, role: 'Encadrant' }
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    vi.clearAllMocks();
  });

  it('devrait retourner le profil de l\'encadrant', async () => {
    const fakeProfil = { nom: 'Encadrant', email: 'encadrant@test.com' };
    encadrantService.getProfilEncadrant.mockResolvedValue(fakeProfil);

    await getMonProfil(req, res);

    expect(encadrantService.getProfilEncadrant).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(fakeProfil);
  });

  it('devrait gérer une erreur et retourner un statut 404', async () => {
    encadrantService.getProfilEncadrant.mockRejectedValue(new Error('Erreur'));

    await getMonProfil(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erreur' });
  });
});
