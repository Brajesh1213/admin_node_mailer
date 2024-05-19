import express from 'express';
import multer from 'multer';
import { check, createList, addDataFromCSV,unsubscribe, SendMail } from '../controller/List.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', check);
router.post('/createlist', createList);
router.post('/createlist/:listId/csv', upload.single('csvFile'), addDataFromCSV);
router.post('/unsubcribe/:ListId/:email',unsubscribe)
router.post('/mail/:listId',SendMail)

export default router;
