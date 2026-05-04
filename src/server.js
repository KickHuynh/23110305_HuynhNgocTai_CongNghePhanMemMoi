import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import configViewEngine from './config/viewEngine';
import initWebRoutes from './route/web';
import connectDB from './config/configdb';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

configViewEngine(app);
initWebRoutes(app);
connectDB();

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('Backend Node.js is running on port: ' + port);
});