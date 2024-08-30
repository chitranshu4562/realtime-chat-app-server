import mongoose from "mongoose";

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    isGroup: {
        type: Boolean,
        required: true
    },
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ]
}, {timestamps: true});

export default mongoose.model('Conversation', conversationSchema);
