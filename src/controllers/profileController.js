// src/controllers/profileController.js
const profileService = require('../services/profileService');

/**
 * Obtiene el perfil del usuario actualmente autenticado.
 */
const getMyProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfileById(req.user.id);
    if (!profile) {
      return res.status(404).json({ error: 'Perfil no encontrado.' });
    }
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene el perfil público de cualquier usuario por su ID.
 */
const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const profile = await profileService.getProfileById(userId);
    if (!profile) {
      return res.status(404).json({ error: 'Perfil no encontrado.' });
    }
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza el perfil del usuario autenticado.
 */
const updateMyProfile = async (req, res, next) => {
  try {
    const updatedProfile = await profileService.updateProfile(req.user.id, req.body);
    res.status(200).json({ message: 'Perfil actualizado con éxito', profile: updatedProfile });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  getUserProfile,
  updateMyProfile,
};