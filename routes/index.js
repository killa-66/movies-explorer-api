const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

const userRoutes = require('./users');
const moviesRoutes = require('./movies');
const {
  login,
  createUser,
} = require('../controllers/auth');

router.use('/movies', auth, moviesRoutes);
router.use('/users', auth, userRoutes);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);
router.use(auth, (req, res, next) => next(new NotFoundError('Проверьте корректность пути запроса')));

module.exports = {
  router,
};
