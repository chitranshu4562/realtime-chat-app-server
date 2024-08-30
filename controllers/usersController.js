import User from "../models/user.js";
import uploadFileToS3 from "../services/s3UploadService.js";


export const uploadUserAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new Error('File not found!!')
        }
        const { userId } = req.query;
        if (!userId) {
            throw new Error('User Id must be present');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const imageUrl = await uploadFileToS3(req.file, user._id);
        if (!imageUrl) {
            throw new Error('S3 did not returned url');
        }
        user.avatar = imageUrl;
        const updatedUser = await user.save();

        res.status(200).json({
            message: 'User avatar is uploaded successfully',
            user: {
                email: updatedUser.email,
                name: updatedUser.name,
                id: updatedUser._id,
                avatar: updatedUser.avatar
            }
        })

    } catch (error) {
        next(error);
    }
}

export const fetchUserProfile = async (req, res, next) => {
    try {
        res.status(200).json({
            message: 'Data retrieved successfully',
            user: req.currentUser
        })
    } catch (error) {
        next(error);
    }
}

export const getUsers = async (req, res, next) => {
    try {
        const { searchTerm, userId } = req.query;
        // query initialization
        let query = User.find({
            _id: { $ne: req.currentUser._id }
        });

        // apply condition for id column
        if (userId) {
            query = query.where('_id').equals(userId);
        }
        // apply condition for name column with regex
        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i');
            query = query.where('name').regex(regex);
        }

        // apply ascending sorting
        query = query.sort({ name: 1 });

        // apply case-insensitivity on sorting
        query = query.collation({ locale: 'en', strength: 2 });

        // add select statement
        query = query.select('name createdAt');

        // execute query
        const users = await query.exec();
        res.status(200).json({
            message: 'Data retrieved successfully.',
            data: users
        })

    } catch (error) {
        next(error);
    }
}
