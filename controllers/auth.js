const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const EmailError = require('../errors/EmailError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { JWT_SECRET, NODE_ENV } = process.env;

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const sanitizedUser = { ...user.toObject() };
      delete sanitizedUser.password;
      res.send({ user: sanitizedUser });
    })
    .catch(
      (err) => {
        if (err.name === 'ValidationError') {
          return next(new ValidationError('Ошибка валидации запроса'));
        } if (err.code === 11000) {
          return next(new EmailError('Пользователь с таким email уже существует'));
        }
        return next(err);
      },
    );
};

const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;
  User.find({ email }).select('+password')
    .then((userData) => {
      if (!userData[0]) {
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, userData[0].password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError('Неправильные почта или пароль'));
          }
          const jwtToken = jwt.sign(
            { _id: userData[0]._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'secret',
            { expiresIn: '7d' },
          );
          return res.send({ token: jwtToken });
        })
        .catch(
          (err) => {
            next(err);
          },
        );
    });
};

module.exports = {
  createUser,
  login,
};
