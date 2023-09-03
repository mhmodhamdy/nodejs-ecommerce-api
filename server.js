const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const dbConnection = require('./config/database');
const categoryRoute = require('./routes/categoryRoute');
const brandRoute = require('./routes/brandRoute');
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const ApiError = require('./utils/apiError');
const globalError = require('./middleware/errorMiddleware');

dotenv.config({ path: 'config.env' });

//connect with database
dbConnection();
//ExpressApp
const app = express();
//Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subCategoryRoute);
app.use('/api/v1/brands', brandRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', userRoute);

app.all('*', (req, res, next) => {
  //const err = new Error(`can't find this route: ${req.originalUrl}`)
  //next(err.message);
  next(new ApiError(`can't find this route: ${req.originalUrl}`, 400));
});

//Global error handling middleware for express
app.use(globalError);

//Handle rejections outside express
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
