const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  creatMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/^https?:\/\/[\w\\-]+(\.[\w\\-]+)+[/#?]?.*$/),
    trailerLink: Joi.string().required().regex(/^https?:\/\/[\w\\-]+(\.[\w\\-]+)+[/#?]?.*$/),
    thumbnail: Joi.string().required().regex(/^https?:\/\/[\w\\-]+(\.[\w\\-]+)+[/#?]?.*$/),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), creatMovie);
router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().regex(/^[a-f\d]{24}$/i),
  }),
}), deleteMovie);

module.exports = router;
