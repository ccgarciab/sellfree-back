import { Document, model, Schema } from 'mongoose';

interface IUserSchema extends Document{

    email    : String,
    username : String
    password : String
}

const userSchema = new Schema({

    email      : {type : String,  required : true, unique : true},
    username   : {type : String,  required : true},
    password   : {type : String,  required : true},
});

const User = model<IUserSchema>("User", userSchema);

export default User;
