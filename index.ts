import config from 'config';
import cors from 'cors';
import express from 'express';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import ExpressSession from 'express-session';

import authRouter from './routes/auth';

const port = Number.parseInt(config.get('port'));
const dbURI : string =  config.get('dbURI');
const secret : string = config.get('sessionSecret');

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

const mongoStore = MongoStore(ExpressSession)

app.use(ExpressSession({
    secret,
    store : new mongoStore({
        mongooseConnection : mongoose.connection
    }),
    cookie : {
        httpOnly : true,
        maxAge   : 1000 * 3600 * 24
    },
    saveUninitialized : false,
    resave : false
}))

app.use('/', authRouter);

app.listen(port, () => {

    console.log(`Server listeng at port ${port}`);
});
