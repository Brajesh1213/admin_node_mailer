import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './router/list.router.js';
import routers from './router/list.mail.router.js'
import cors from 'cors';


dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



app.get('/', (req, res) => {
  res.status(200).send("API connected");
});
app.use('/userapi', router);
app.use('/sendmail',routers);



const port = process.env.PORT || 3000;
console.log(`PORT: ${process.env.PORT}`);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
