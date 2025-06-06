// tests/services.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProfilEncadrant } from './encadrantService.js'; 

// Mocker le modèle Encadrant
vi.mock('../sync.js', () => {
  return {
    Encadrant: {
      findOne: vi.fn()
    },
    Utilisateur: {}, // peut être vide si non utilisé directement
  };
});

import { Encadrant } from '../sync.js';

describe('getProfilEncadrant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renvoie le profil de l\'encadrant s\'il existe', async () => {
    const fakeUser = { Id_U: 1, utilisateur: { nom: 'Dupont' } };
    Encadrant.findOne.mockResolvedValue(fakeUser);

    const result = await getProfilEncadrant(1);
    expect(result).toEqual(fakeUser);
    expect(Encadrant.findOne).toHaveBeenCalledWith({
      where: { Id_U: 1 },
      include: [
        {
          model: expect.anything(),
          as: 'utilisateur',
          attributes: ['nom', 'prenom', 'email', 'image', 'role']
        }
      ]
    });
  });

  it('lance une erreur si l\'encadrant n\'existe pas', async () => {
    Encadrant.findOne.mockResolvedValue(null);
    await expect(getProfilEncadrant(1)).rejects.toThrow('Encadrant non trouvé');
  });
});
