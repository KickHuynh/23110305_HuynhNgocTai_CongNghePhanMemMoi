import express from 'express';
import studentController from '../controllers/studentController';

const router = express.Router();

const initWebRoutes = (app) => {
  router.get('/', studentController.getHomePage);

  router.get('/crud', studentController.getCRUD);

  router.post('/post-crud', studentController.postCRUD);

  router.get('/get-crud', studentController.getFindAllCRUD);

  router.get('/edit-crud', studentController.getEditCRUD);

  router.post('/put-crud', studentController.putCRUD);

  router.get('/delete-crud', studentController.deleteCRUD);

  return app.use('/', router);
};

export default initWebRoutes;