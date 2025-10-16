const recipeService = require('../services/recipeService');

const getMyFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const favoriteRecipes = await recipeService.getFavoriteRecipes(userId);
        res.status(200).json(favoriteRecipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getMyFavorites,
};
