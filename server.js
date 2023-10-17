const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');

const dbConnection = require('./config/database');
const mountRoutes = require('./routes');
const ApiError = require('./utils/apiError');
const globalError = require('./middleware/errorMiddleware');
const { webhookCheckout } = require('./services/orderService');

dotenv.config({ path: 'config.env' });

// @desc    connect with database
dbConnection();
// @desc    ExpressApp
const app = express();

// @desc    Enable domains to access the app
app.use(cors());
app.options('*', cors());

// @desc    Compress all responses
app.use(compression());

// @desc    Checkout webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

// @desc    Middlewares
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// @desc    Mount Routes
mountRoutes(app);

app.all('*', (req, res, next) => {
  next(new ApiError(`can't find this route: ${req.originalUrl}`, 400));
});

// @desc    Global error handling middleware for express
app.use(globalError);

// @desc    Handle rejections outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  // eslint-disable-next-line no-use-before-define
  server.close(() => {
    console.log('Shutting down......');
    process.exit(1);
  });
});

const { PORT } = process.env;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
