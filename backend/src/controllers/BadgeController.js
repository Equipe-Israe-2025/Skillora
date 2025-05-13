import * as badgeService from '../services/BadgeService.js';

export const generateBadge = async (req, res) => {
  try {
    const badge = await badgeService.generateBadge(req.params.evaluationId);
    res.status(201).json(badge);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getBadgeByEvaluation = async (req, res) => {
  try {
    const badge = await badgeService.getBadgeByEvaluation(
      req.params.evaluationId,
    );
    if (!badge) return res.status(404).json({ message: 'Badge non trouvé' });
    res.json(badge);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const downloadBadge = async (req, res) => {
  try {
    const filePath = await badgeService.downloadBadge(req.params.badgeId);
    res.download(filePath); // Téléchargement du fichier
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
