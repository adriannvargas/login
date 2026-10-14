import { Router } from 'express';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
// El email identifica la cuenta: no se acepta desde el body (evita asignación masiva)
const EDITABLE = ['name', 'bio', 'phone', 'city'];

router.use(requireAuth);

router.get('/', async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user.toProfile());
});

router.put('/', async (req, res) => {
  const updates = {};
  for (const field of EDITABLE) {
    if (typeof req.body?.[field] === 'string') updates[field] = req.body[field].trim();
  }
  if ('name' in updates && !updates.name) {
    return res.status(400).json({ error: 'El nombre no puede estar vacío' });
  }
  const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user.toProfile());
});

export default router;
