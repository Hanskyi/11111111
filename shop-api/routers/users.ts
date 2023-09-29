import express from "express";
import User from "../models/User";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import auth, {RequestWithUser} from "../middleware/auth";

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) =>{
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        user.generateToken()

        await user.save();
         return res.send(user);
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(e);
        }
        return next(e);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});

        if (!user) {
            return res.status(400).send({error: "Wrong password or username"});
        }

        const isMatch = await user.checkPassword(req.body.password);

        if(!isMatch) {
            return res.status(400).send({error: "Wrong password or username"});
        }
        user.generateToken();
        await user.save()
        res.send({
            message: 'Username and password correct',
            user,
        });
    } catch (e) {
        next(e);
    }
});

usersRouter.get('/secret' , auth, async (req, res, next)=>{

    const user = (req as RequestWithUser).user;
    res.send({message: 'Secret message!', username: user.username});
})







export default usersRouter;