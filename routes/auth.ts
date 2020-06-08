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

    if(![username, email, password].every((e) => isString(e)))
        return res.status(400).json("Improper data format");

    const user = await User.findOne({ email });
    if(user) return res.status(409).json({message : "User aready exists"});

    const salt = await bcrypt.genSalt(10);
    if(!salt) return res.status(500).json({message : "Internal server error"});

    const hash = await bcrypt.hash(password, salt);
    if(!hash) return res.status(500).json({message : "Internal server error"});

    let newUser = new User({

        email,
        username,
        password : hash
    });

    let savedUser = await newUser.save();
    if(!savedUser) return res.status(503).json({message : "Service unavailable"});

    if(req.session){

        req.session.userID = savedUser._id;
    }

    return res.status(200).json({
        username : savedUser.username,
        email    : savedUser.email
    });
});

export default authRouter;
