const { Router } = require('express');
const statusMonitor = require('express-status-monitor');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const methodOverride = require('method-override');
const expressValidator = require('express-validator'); 
const controller = require('./utils/createControllerRoutes');

module.exports = ({ config, containerMiddleware, loggerMiddleware, errorHandler, swaggerMiddleware }) => {
  const router = Router();
  /* istanbul ignore if */
  if(config.env === 'development') {
    router.use(statusMonitor());
  }

  /* istanbul ignore if */
  // if(config.env !== 'test') {
  //   router.use(loggerMiddleware);
  // }
  router.use(loggerMiddleware);

  const apiRouter = Router();

  apiRouter
    .use(methodOverride('X-HTTP-Method-Override'))
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(compression())
    .use(expressValidator())
    .use('/docs', swaggerMiddleware);

  /*
   * Add your API routes here
   *
   * You can use the `controllers` helper like this:
   * apiRouter.use('/users', controller(controllerPath))
   *
   * The `controllerPath` is relative to the `interfaces/http` folder
   */
  apiRouter.use('/users', controller('controller/user/UsersController'));

  router
    .use(containerMiddleware)
    .use('/api', apiRouter)
    .use(errorHandler);



  return router;
};
