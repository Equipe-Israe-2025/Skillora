import { createAdmin, authenticateAdmin } from '../services/adminService.js';

export async function register(req, res) {
  const { nom, prenom, email, password, role } = req.body;
  try {
    const admin = await createAdmin({ nom, prenom, email, password, role });
    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function login(req, res) {
  const { email, password, role } = req.body;
  try {
    const { token, admin } = await authenticateAdmin({ email, password, role });
    res.json({ token, admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

