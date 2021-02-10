import sql from '../db.js';

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next({ status: 401, message: 'No token provided' });
  }

  const token = authHeader.replace('Bearer ', '');

  sql.query('SELECT uuid, TIMESTAMPDIFF(SECOND, expiration, NOW()) > 0 AS expired FROM users WHERE token = ?', token, (err, values) => {
    if (err) {
      return next({ status: 500, message: 'SQL Error', info: err });
    }

    if (values.length === 0 || values[0].expired === 1) {
      return next({ status: 401 });
    }

    if (req.params.uuid !== values[0].uuid) {
      return next({ status: 401 });
    }

    return next();
  });
};

export default auth;
