import {
  getMoyenneParCompetence,
  getRapportParCompetence,
} from '../services/StatistiqueService.js';
import { generatePDFReport } from '../services/pdfService.js';

export const moyenneParCompetenceController = async (req, res) => {
  try {
    const result = await getMoyenneParCompetence();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const rapportJSONController = async (req, res) => {
  try {
    const rapport = await getRapportParCompetence();
    res.status(200).json(rapport);
  } catch (err) {
    res.status(500).json({
      message: 'Erreur lors de la récupération du rapport',
      error: err.message,
    });
  }
};

export const rapportPDFController = async (req, res) => {
  try {
    const rapport = await getRapportParCompetence();
    const filePath = './rapport.pdf';
    await generatePDFReport(rapport, filePath);
    res.download(filePath, 'rapport_evaluations.pdf');
  } catch (err) {
    res.status(500).json({
      message: 'Erreur lors de la génération du PDF',
      error: err.message,
    });
  }
};
