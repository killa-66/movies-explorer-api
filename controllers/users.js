const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const EmailError = require('../errors/EmailError');

const NO_ERROR = 200;

const updateUser = (req, res, next) => {
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { email: req.body.email, name: req.body.name }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.status(NO_ERROR).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Невалидный идентификатор пользователя.'));
      } if (err.code === 11000) {
        return next(new EmailError('Пользователь с таким email уже существует'));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const {
    _id,
  } = req.user;
  User.findById({ _id })
    .then((userData) => {
      if (userData) {
        res.status(200).send({ userData });
      } else {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
    })
    .catch(
      (err) => {
        next(err);
      },
    );
};

const signout = (req, res) => {
  res.clearCookie('token');
  res.status(NO_ERROR).send('Выход выполнен успешно');
};

module.exports = {
  updateUser,
  getCurrentUser,
  signout,
};
