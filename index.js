import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './router/list.router.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/userapi', router);

const port = process.env.PORT || 3000;
console.log(`PORT: ${process.env.PORT}`);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});