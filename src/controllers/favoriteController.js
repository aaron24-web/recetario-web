const recipeService = require('../services/recipeService');

const getMyFavorites = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const favoriteRecipes = await recipeService.getFavoriteRecipes(userId);
        res.status(200).json(favoriteRecipes);
    } catch (error) {
        // En lugar de res.status(500)...
        // lo pasamos al manejador de errores central
        next(error);
    }
};

module.exports = {
    getMyFavorites,
};