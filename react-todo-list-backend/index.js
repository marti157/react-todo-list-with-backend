import express from 'express';
import morgan from 'morgan';
import rfs from 'rotating-file-stream';
import cors from 'cors';
import errorHandler from './middleware/error.js';
import tasksRouter from './routes/tasks.js';
import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js';
import config from './config.js';

const app = express();

const corsOptions = {
  origin: config.origin.url,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev', {
  skip(req, res) {
    return res.statusCode < 400;
  },
}));

const accessLogStream = rfs.createStream('access.log', {
  size: '10M',
  interval: '1d',
  path: 'logs',
});
app.use(morgan('common', { stream: accessLogStream }));

app.use('/tasks', tasksRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

app.all('*', (req, res, next) => {
  next({ status: 404 });
});

app.use(errorHandler);

const { port } = config.app;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
