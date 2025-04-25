
// middlewares/auth.js
import jwt from 'jsonwebtoken';
import { Utilisateur } from '../models/index.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Authentification requise" });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await Utilisateur.findByPk(decoded.userId, {
      include: [{ model: Encadrant, as: 'encadrant' }]
    });

    if (!user) return res.status(401).json({ message: "Utilisateur non trouvé" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Accès refusé. Rôle requis: ${roles.join(', ')}` 
      });
    }
    next();
  };
}; 