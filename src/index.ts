import express from 'express';
import cors from 'cors';
import imageRouter from './routes/image.route';
import statusRouter from './routes/status.routes';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/image',imageRouter);
app.use('/status', statusRouter);


app.get('/', (req, res) => {
  res.send('Well this link works I guess.');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});