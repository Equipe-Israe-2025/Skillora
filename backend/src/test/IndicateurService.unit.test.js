import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createIndicateur } from './IndicateurService.js';
import { Indicateur, Competence } from '../sync.js';

// Mock du module sync.js
vi.mock('../sync.js', () => ({
  Indicateur: {
    create: vi.fn(),
  },
  Competence: {
    findByPk: vi.fn(),
  },
}));

describe('createIndicateur - test unitaire', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait créer un indicateur si la compétence existe', async () => {
    // Données d'entrée simulées
    const data = {
      libelle: 'Prise d\'initiative',
      description: 'Capacité à proposer et démarrer des idées sans être poussé',
      Id_C: 3,
    };

    // Mock : la compétence existe
    Competence.findByPk.mockResolvedValue({ Id_C: 3, nom: 'Compétence Test' });
    // Mock : création réussie
    Indicateur.create.mockResolvedValue({ id: 1, ...data });

    // Appel de la fonction à tester
    const result = await createIndicateur(data);

    // Assertions
    expect(Competence.findByPk).toHaveBeenCalledWith(3);
    expect(Indicateur.create).toHaveBeenCalledWith(data);
    expect(result).toEqual({ id: 1, ...data });
  });

  it('devrait lancer une erreur si la compétence est introuvable', async () => {
    Competence.findByPk.mockResolvedValue(null);

    await expect(createIndicateur({
      libelle: 'Prise d\'initiative',
      description: 'Capacité à proposer',
      Id_C: 999,
    })).rejects.toThrow('Compétence non trouvée');
  });
});
