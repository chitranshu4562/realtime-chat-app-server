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
