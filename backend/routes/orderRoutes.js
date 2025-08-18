import express from 'express';
import { updateDetails } from '../controller/itemController.js';

const Router = express.Router();

Router.post('/update/:id', updateDetails);

export default Router;