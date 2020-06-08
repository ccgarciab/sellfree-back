import bcrypt from 'bcrypt';
import Router from 'express';

import User from '../models/user.model';
import session from 'express-session';

const authRouter = Router();

function isString(obj : unknown) : obj is String{

    return typeof obj === 'string';
}

authRouter.post('/register', async (req, res) => {

    const { username, email, password } = req.body;

    if(!(isString(username) && isString(password) && isString(email))){

        return res.status(400).json("Improper data format");
    }

    const user = await User.findOne({ email });
    if(user) return res.status(409).json("User aready exists");

    const salt = await bcrypt.genSalt(10);
    if(!salt) return res.status(500).json("Internal server error");

    const hash = await bcrypt.hash(password, salt);
    if(!hash) return res.status(500).json("Internal server error");

    let newUser = new User({

        email,
        username,
        password : hash
    });

    let savedUser = await newUser.save();
    if(!savedUser) return res.status(503).json("Service unavailable");

    if(req.session) req.session.userID = savedUser._id;

    return res.status(200).json({
        username : savedUser.username,
        email    : savedUser.email
    });
});

authRouter.post('/login', async (req, res) => {

    const { username, email, password } = req.body;

    if(!(isString(username) && isString(password) && isString(email))){

        return res.status(400).json("Improper data format");
    }

    const user = await User.findOne({ email });
    if(!user) return res.status(401).json("Incorrect log in");

    const passMatch = await bcrypt.compare(password, user.password.valueOf());
    if(!passMatch) return res.status(401).json("Incorrect log in");

    if(req.session) req.session.userID = user._id;

    return res.status(200).json({
        username : user.username,
        email    : user.email
    });
})

export default authRouter;
