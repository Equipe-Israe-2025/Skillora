import {
    affecterFilieresAEncadrant,
    getFilieresByEncadrant,
    retirerFiliereAEncadrant
  } from '../services/EnseigneService.js';
  
  // POST : Affecter des filières à un encadrant
  export const assignerFilieres = async (req, res) => {
    const { numSum, listeIdFiliere } = req.body;
  
    try {
      const result = await affecterFilieresAEncadrant(numSum, listeIdFiliere);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // GET : Récupérer les filières d’un encadrant
  export const recupererFilieresEncadrant = async (req, res) => {
    const { numSum } = req.params;
  
    try {
      const filieres = await getFilieresByEncadrant(numSum);
      res.status(200).json(filieres);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // DELETE : Retirer une filière à un encadrant
  export const retirerFiliere = async (req, res) => {
    const { numSum, idFiliere } = req.params;
  
    try {
      const result = await retirerFiliereAEncadrant(numSum, idFiliere);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };