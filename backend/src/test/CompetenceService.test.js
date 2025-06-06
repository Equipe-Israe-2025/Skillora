import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as CompetenceService from './CompetenceService.js';

vi.mock('../sync.js', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const CompetenceMock = dbMock.define('Competence', {
    Id_C: 'C001',
    nom: 'Algorithmique',
    description: 'Description de test'
  });

  const IndicateurMock = dbMock.define('Indicateur', {
    Id_C: 'C001',
    libelle: 'Indicateur de test'
  });

  // Association simulée (mockée)
  CompetenceMock.$indicateurs = [IndicateurMock.build()];

  CompetenceMock.findOne = vi.fn(({ where }) => {
    if (where.Id_C === 'C001') {
      return Promise.resolve(CompetenceMock.build({
        Id_C: 'C001',
        nom: 'Algorithmique',
        description: 'Description de test',
        Indicateurs: [IndicateurMock.build()],
      }));
    }
    return Promise.resolve(null);
  });

  CompetenceMock.findByPk = vi.fn((id) => {
    if (id === 'C001') return Promise.resolve(CompetenceMock.build());
    return Promise.resolve(null);
  });

  return {
    Competence: CompetenceMock,
    Indicateur: IndicateurMock,
  };
});

describe('CompetenceService Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a competence', async () => {
    const data = { Id_C: 'C002', nom: 'Maths', description: 'Logique mathématique' };
    const result = await CompetenceService.createCompetence(data);
    expect(result.nom).toBe('Maths');
  });

  it('should return all competences (only Id_C and nom)', async () => {
    const result = await CompetenceService.getAllCompetences();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should get competence by Id with its indicators', async () => {
    const result = await CompetenceService.getCompetenceById('C001');
    expect(result.Id_C).toBe('C001');
    expect(result.Indicateurs).toBeDefined();
  });

  it('should throw if competence not found by Id', async () => {
    await expect(CompetenceService.getCompetenceById('INVALID')).rejects.toThrow('Compétence non trouvée');
  });

  it('should update a competence', async () => {
    const result = await CompetenceService.updateCompetence('C001', { nom: 'Algo Avancé' });
    expect(result.nom).toBe('Algo Avancé');
  });

  it('should throw if updating non-existing competence', async () => {
    await expect(CompetenceService.updateCompetence('INVALID', { nom: 'X' })).rejects.toThrow('Competence not found');
  });

  it('should delete a competence', async () => {
    const result = await CompetenceService.deleteCompetence('C001');
    expect(result.message).toBe('Compétence supprimée avec succès');
  });

  it('should throw if deleting non-existing competence', async () => {
    await expect(CompetenceService.deleteCompetence('INVALID')).rejects.toThrow('Compétence non trouvée');
  });
});
