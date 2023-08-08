const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

const NO_ERROR = 200;

const getMovies = (req, res, next) => Movie.find({ owner: req.user._id })
  .then((movies) => res.status(NO_ERROR).send(movies))
  .catch(
    (err) => {
      next(err);
    },
  );

const creatMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const ownerId = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: ownerId,
  })
    // вернём записанные в базу данные
    .then((movie) => res.send({ movie }))
    // данные не записались, вернём ошибку
    .catch(
      (err) => {
        if (err.name === 'ValidationError') {
          return next(new ValidationError('Ошибка валидации запроса'));
        }
        return next(err);
      },
    );
};

const deleteMovie = (req, res, next) => {
  const { _id } = req.params;

  Movie.findById(_id)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Запрашиваемый фильм не найден'));
      }
      const { owner } = movie;
      if (owner.toString() === req.user._id.toString()) {
        return Movie.findByIdAndRemove(_id)
          .then(() => res.status(NO_ERROR).send(movie));
      }
      return next(new ForbiddenError('У вас нет прав на удаление этого фильма'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ValidationError('Неверный формат идентификатора фильма');
        return next(error);
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  creatMovie,
  deleteMovie,
};
