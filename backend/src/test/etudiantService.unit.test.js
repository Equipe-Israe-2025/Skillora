// tests/etudiantService.unit.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMesGroupes } from './etudiantService.js';

vi.mock('../../src/sync.js', () => ({
  Etudiant: {
    findOne: vi.fn()
  },
  Forme: {
    findAll: vi.fn()
  },
  Groupe: {}
}));

import { Etudiant, Forme } from '../../src/sync.js';

describe('getMesGroupes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait retourner les groupes de l’étudiant', async () => {
    Etudiant.findOne.mockResolvedValue({ CNE: 'CNE123' });

    Forme.findAll.mockResolvedValue([
      { groupe: { Id_G: 1, nom_Groupe: 'G1' } },
      { groupe: { Id_G: 2, nom_Groupe: 'G2' } }
    ]);

    const groupes = await getMesGroupes(123);
    expect(groupes).toEqual([
      { Id_G: 1, nom_Groupe: 'G1' },
      { Id_G: 2, nom_Groupe: 'G2' }
    ]);
  });

  it('devrait lancer une erreur si l’étudiant est introuvable', async () => {
    Etudiant.findOne.mockResolvedValue(null);

    await expect(getMesGroupes(999)).rejects.toThrow('Etudiant non trouvé');
  });
});
