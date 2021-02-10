import express from 'express';
import auth from '../middleware/auth.js';
import sql from '../db.js';

const tasksRouter = express.Router();

tasksRouter.get('/:uuid', auth, (req, res, next) => {
  const { uuid } = req.params;

  sql.query('SELECT id, data, checked FROM tasks WHERE user = ?', uuid, (err, values) => {
    if (err) {
      return next({ status: 500, message: 'SQL Error', info: err });
    }

    res.status(200).json({ tasks: values });
  });
});

tasksRouter.post('/:uuid', auth, (req, res, next) => {
  const { uuid } = req.params;
  const { data } = req.body;

  if (data === undefined || data.length === 0) {
    return next({ status: 400 });
  }

  sql.query('INSERT INTO tasks (data, user) VALUES (?, ?)', [data, uuid], (err) => {
    if (err) {
      return next({ status: 500, message: 'SQL Error', info: err });
    }

    return next({ status: 201 });
  });
});

tasksRouter.patch('/:uuid/:taskId', auth, (req, res, next) => {
  const taskId = parseInt(req.params.taskId, 10);
  const { checked } = req.body;
  const data = Boolean(checked);
  const { uuid } = req.params;

  sql.query('UPDATE tasks SET checked = ? WHERE user = ? AND id = ?', [data, uuid, taskId], (err, values) => {
    if (err) {
      return next({ status: 500, message: 'SQL Error', info: err });
    }

    if (values.affectedRows === 0) {
      return next({ status: 400, message: 'No existing task with specified ID' });
    }

    return next({ status: 204 });
  });
});

tasksRouter.delete('/:uuid/:taskId', auth, (req, res, next) => {
  const taskId = parseInt(req.params.taskId, 10);
  const { uuid } = req.params;

  sql.query('DELETE FROM tasks WHERE user = ? AND id = ?', [uuid, taskId], (err, values) => {
    if (err) {
      return next({ status: 500, message: 'SQL Error', info: err });
    }

    if (values.affectedRows === 0) {
      return next({ status: 400, message: 'No existing task with specified ID' });
    }

    return next({ status: 204 });
  });
});

tasksRouter.all('*', (req, res, next) => {
  next({ status: 403 });
});

export default tasksRouter;
