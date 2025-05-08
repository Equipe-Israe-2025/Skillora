import { Filiere } from '../sync.js';

export const createFiliere = async (filiereData) => {
  return await Filiere.create(filiereData);
};

export const updateFiliere = async (id, data) => {
  const filiere = await Filiere.findByPk(id);
  if (!filiere) throw new Error('Filière non trouvée');
  return await filiere.update(data);
};

export const deleteFiliere = async (id) => {
  const filiere = await Filiere.findByPk(id);
  if (!filiere) throw new Error('Filière non trouvée');
  await filiere.destroy();
  return { message: 'Filière supprimée avec succès' };
};
