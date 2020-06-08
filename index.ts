import config from 'config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import authRouter from './routes/auth';

const port = Number.parseInt(config.get('port'));
const dbURI : string =  config.get('dbURI');

const app = express();

app.use(cors());
app.use(express.json());

let mongoOpts = {
    
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true,
    useFindAndModify : false
}

mongoose.connect(dbURI, mongoOpts)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.error(err));

app.use('/', authRouter);

app.listen(port, () => {

    console.log(`Server listeng at port ${port}`);
});
