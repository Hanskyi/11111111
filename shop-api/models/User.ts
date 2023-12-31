import {Model, model, Schema} from "mongoose";
import {IUser} from "../type";
import bcrypt from 'bcrypt';
import {randomUUID} from "crypto";

const SALT_WORK_FACTOR = 10;
interface IUserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

type UserModal = Model<IUser, {}, IUserMethods>

const UserSchema = new Schema<IUser ,UserModal,IUserMethods>({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async (value: string) => {
                const user = await User.findOne({username: value});
                if (user) return false
            },
            message: 'This user is already registered!'
        }
    },
    password: {
        type:String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', async function  (next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

UserSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret.password;

        return ret;
    }
});

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password)
};

UserSchema.methods.generateToken = function () {
    this.token = randomUUID();
}

const User = model<IUser,UserModal>('User', UserSchema);
export default User;