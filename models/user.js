import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {EMAIL_REGEX} from "../constants.js";

const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [5, 'Name must have at least five characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [EMAIL_REGEX, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must have at least six character']
    },
    avatar: {
        type: String
    },
    groups: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        }
    ]
}, { timestamps: true });

// Pre-save middleware to hash the password if it has been modified
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next(); // password does not change because password does not change
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next()
})

export default mongoose.model('User', userSchema);
