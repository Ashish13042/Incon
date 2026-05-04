import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    author: mongoose.Types.ObjectId; // This links to the User model!
    title: string;
    content: string;
    createdAt: Date;
}

const PostSchema: Schema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Tells Mongoose this ID belongs to the User collection
        required: true
    },
    title: { type: String, required: true },
    content: { type: String, required: true }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

export default mongoose.model<IPost>('Post', PostSchema);