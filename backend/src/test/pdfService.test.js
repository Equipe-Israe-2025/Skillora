import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generatePDFReport, createPDF } from './pdfService';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Mock des dépendances
vi.mock('pdfkit', () => {
  return {
    default: vi.fn(() => ({
      pipe: vi.fn().mockReturnThis(),
      fontSize: vi.fn().mockReturnThis(),
      fillColor: vi.fn().mockReturnThis(),
      text: vi.fn().mockReturnThis(),
      moveDown: vi.fn().mockReturnThis(),
      font: vi.fn().mockReturnThis(),
      end: vi.fn(),
    }))
  };
});

vi.mock('fs', () => ({
  default: {
    createWriteStream: vi.fn(() => ({
      on: vi.fn((event, callback) => {
        if (event === 'finish') callback();
        return { on: vi.fn() };
      }),
      write: vi.fn(),
      end: vi.fn(),
    })),
    existsSync: vi.fn().mockReturnValue(false),
    mkdirSync: vi.fn(),
    statSync: vi.fn().mockReturnValue({ size: 2048 }),
    readFileSync: vi.fn().mockReturnValue(Buffer.from('PDF content mock')),
  }
}));

vi.mock('path', () => ({
  default: {
    join: vi.fn((...args) => args.join('/')),
    dirname: vi.fn((p) => p.split('/').slice(0, -1).join('/')),
  }
}));

describe('PDF Generation with Vitest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generatePDFReport', () => {
    it('should generate a PDF report with correct content', async () => {
      const testData = {
        'Compétence Test': [{
          indicateur: 'Test',
          note: 4,
          commentaire: 'Bon travail',
          evaluateur: 'Testeur',
          role: 'Manager',
          date: '2023-01-01T00:00:00.000Z'
        }]
      };

      const result = await generatePDFReport(testData);
      
      expect(result).toBe('public/reports/rapport.pdf');
      
      // Vérifie que PDFDocument a été appelé correctement
      expect(PDFDocument).toHaveBeenCalledWith({ autoFirstPage: true });
      
      // Vérifie les appels aux méthodes du PDF
      const mockDoc = PDFDocument.mock.results[0].value;
      expect(mockDoc.fontSize).toHaveBeenCalledWith(20);
      expect(mockDoc.text).toHaveBeenCalledWith("Rapport d'Évaluation", { align: 'center' });
    });
  });

  describe('createPDF', () => {
    it('should create a badge PDF with correct structure', async () => {
      const testData = {
        studentName: 'Étudiant Test',
        competence: 'Compétence Test',
        note: 5,
        commentaire: 'Excellent travail',
        evaluateur: 'Testeur',
        date: '2023-01-01'
      };

      const result = await createPDF(testData);
      
      expect(result).toMatch(/public\/badges\/badge_\d+\.pdf/);
      expect(fs.mkdirSync).toHaveBeenCalled();
      
      const mockDoc = PDFDocument.mock.results[0].value;
      expect(mockDoc.fontSize).toHaveBeenCalledWith(24);
      expect(mockDoc.text).toHaveBeenCalledWith('Attestation de Compétence', { align: 'center' });
    });
  });
});