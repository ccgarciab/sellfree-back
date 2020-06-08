import bcrypt from 'bcrypt';
import Router from 'express';

import User from '../models/user.model';

const authRouter = Router();

authRouter.post('/register', async (req, res) => {

    const { username, email, password } = req.body;

    if(!(username && email && password)) return res.status(400);

    let newUser = new User({

        email,
        username,
    });

    try{

        const salt = await bcrypt.genSalt(10);
        if(!salt) return res.status(500).json({message : "Internal server error"});
    
        const hash = await bcrypt.hash(password, salt);
        if(!hash) return res.status(500).json({message : "Internal server error"});

        newUser.password = hash;
    }
    catch{

        return res.status(500).json({message : "Possibly malformed input data"});
    }

    let savedUser = await newUser.save();
    if(!savedUser) return res.status(503).json({message : "Service unavailable"});

    const user = await User.findOne({ email });
    if(user) return res.status(409).json({message : "User aready exists"});

    return res.status(200).json({
        username : savedUser.username,
        email    : savedUser.email
    });
});

export default authRouter;
