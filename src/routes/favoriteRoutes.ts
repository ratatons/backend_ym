import { Router } from 'express';
import { FavoriteController } from '../controllers/FavoriteController';
import { authenticate } from '../middleware/auth';

const favoriteRouter = Router();

favoriteRouter.post('/', authenticate, FavoriteController.addFavorite);
favoriteRouter.get('/', authenticate, FavoriteController.getFavorites);
favoriteRouter.delete('/:id', authenticate, FavoriteController.deleteFavorite);

export default favoriteRouter;
