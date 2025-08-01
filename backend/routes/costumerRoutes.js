import express from 'express';
import { createOrFindCostumer, getAllCostumers, getCostumerById, updateCostumer, deleteCostumer } from '../controller/costumerController.js';

const router = express.Router();

router.post('/', createOrFindCostumer);

router.get('/', getAllCostumers);

router.get('/:id', getCostumerById);

router.put('/:id', updateCostumer);

router.delete('/:id', deleteCostumer);

export default router;
