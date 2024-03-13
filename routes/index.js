// ImportExpress framework
import express from 'express';

// Import AppController from controllers folder
import AppController from '../controllers/AppController';

// import UsersController from controllers directory
import UsersController from '../controllers/UsersController';

// import AuthController from controllers directory
import AuthController from '../controllers/AuthController';

// import FilesController from controllers directory
import FilesController from '../controllers/FilesController';

// Create an instance of Express Router
const router = express.Router();

// Define route for checking status
router.get('/status', AppController.getStatus);

// Define route for getting statistics
router.get('/stats', AppController.getStats);

// Define route for adding users
router.post('/users', UsersController.postNew);

// Define route for Auth
router.get('/connect', AuthController.getConnect);

// Define route for dixconnection
router.get('/disconnect', AuthController.getDisconnect);

// define route for
router.get('/users/me', UsersController.getMe);

//
router.post('/files', FilesController.postUpload);

router.get('/files/:id', FilesController.getShow);

router.get('/files/:id/data', FilesController.getFile);

router.get('/files', FilesController.getIndex);

router.put('/files/:id/publish', FilesController.putPublish);

router.put('/files/:id/publish', FilesController.putUnpublish);
// Export router for use in other modules
export default router;
