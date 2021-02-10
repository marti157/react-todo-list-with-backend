import express from 'express';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import sql from '../db.js';

const registerRouter = express.Router();

registerRouter.post(
  '',
  body('username').isLength({ min: 4, max: 20 }),
  //change pass length depending on hash
  body('password').isLength({ min: 7, max: 64 }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next({ status: 400, message: errors.array()[0].msg });
    }

    const { username, password } = req.body;

    sql.query('SELECT NULL FROM users WHERE username = ?', username, (err, values) => {
      if (err) {
        return next({ status: 500, message: 'SQL Error', info: err });
      }

      if (values.length !== 0) {
        return next({ status: 400, message: 'Username taken' });
      }

      crypto.randomBytes(10, (err2, buffer) => {
        const uuid = buffer.toString('hex');

        sql.query('INSERT INTO users (username, password, uuid) VALUES (?, ?, ?)', [username, password, uuid], (err3) => {
          if (err3) {
            return next({ status: 500, message: 'SQL Error', info: err3 });
          }

          return next({ status: 201 });
        });
      });
    });
  },
);

registerRouter.all('*', (req, res, next) => {
  next({ status: 403 });
});

export default registerRouter;
