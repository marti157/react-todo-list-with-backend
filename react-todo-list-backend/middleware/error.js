const httpMessages = {
  201: 'Created',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
};

const errorHandler = (error, req, res, next) => {
  const { status, message, info } = error;

  if (info) console.log(info);

  const httpMessage = !message ? httpMessages[status] : message;

  res.status(status).json({ status, message: httpMessage });
};

export default errorHandler;
