import express from 'express'
import cors from 'cors'
import { readdirSync } from 'fs'
import mongoose from 'mongoose'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
const morgan = require('morgan');
require('dotenv').config();

const csrfProtection = csrf({ cookie: true });

const app = express();

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
})
.then(() => console.log('DB CONNECTED'))
.catch((err) => console.log('DB CONNECTION ERROR', err));

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server running on port ${port}`));