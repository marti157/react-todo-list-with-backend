import express from 'express';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import sql from '../db.js';

const loginRouter = express.Router();

loginRouter.post(
  '',
  body('username').not().isEmpty(),
  body('password').not().isEmpty(),
  body('remember').not().isEmpty().toBoolean(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next({ status: 400, message: errors.array()[0].msg });
    }

    const { username, password, remember } = req.body;

    sql.query('SELECT uuid FROM users WHERE BINARY username = ? AND password = ?', [username, password], (err, values) => {
      if (err) {
        return next({ status: 500, message: 'SQL Error', info: err });
      }

      if (values.length === 0) {
        return next({ status: 400, message: 'Incorrect username or password' });
      }

      const { uuid } = values[0];

      crypto.randomBytes(24, (err2, buffer) => {
        const token = buffer.toString('hex');

        let extend = '1 0:0:0';
        if (remember) {
          extend = '30 0:0:0';
        }

        sql.query('UPDATE users SET token = ?, expiration = ADDTIME(NOW(), ?) WHERE username = ?', [token, extend, username], (err3) => {
          if (err3) {
            return next({ status: 500, message: 'SQL Error', info: err3 });
          }

          res.status(200).json({ token, uuid });
        });
      });
    });
  },
);

loginRouter.all('*', (req, res, next) => {
  next({ status: 403 });
});

export default loginRouter;
