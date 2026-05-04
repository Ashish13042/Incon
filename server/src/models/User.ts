import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    role: 'investor' | 'entrepreneur';
    password: string;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['investor', 'entrepreneur'], required: true },
    password: { type: String, required: true }
}, {
    timestamps: true
});

const Usermodel = mongoose.model<IUser>("User", UserSchema)
export default Usermodel