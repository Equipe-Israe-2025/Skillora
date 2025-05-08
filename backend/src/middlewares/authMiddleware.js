import jwt from 'jsonwebtoken';
import { Utilisateur } from '../sync.js';

// Middleware : Vérification de l'authentification par JWT
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    console.log("Token décodé :", decoded);

    const user = await Utilisateur.findByPk(decoded.id);

    console.log("Utilisateur trouvé :", user);
    
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    req.user = {
      id: user.Id_U,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

// Middleware : Autorisation par rôle
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        message: `Accès refusé : rôle requis (${allowedRoles.join(', ')})`,
      });
    }

    next();
  };
};

// Middleware : Restriction aux admins
export const restrictToAdmin = (req, res, next) => {
  if (req.user.role !== 'Administrateur') {
    return res.status(403).json({
      message: 'Accès réservé aux administrateurs uniquement',
    });
  }
  next();
};
