import express from 'express';
import multer from 'multer';
import { check, createList, addDataFromCSV} from '../controller/List.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', check);
router.post('/createlist', createList);
router.post('/createlist/:listId/csv', upload.single('csvFile'), addDataFromCSV);


export default router;
