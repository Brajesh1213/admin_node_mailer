import express from 'express'
import { SendMail, unsubscribe } from '../controller/mail.contoller.js';

const router = express.Router();

router.post('/unsubcribe/:ListId/:email',unsubscribe)
router.post('/mail/:listId',SendMail)

export default router;
