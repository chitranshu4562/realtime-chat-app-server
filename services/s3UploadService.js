import S3 from "../config/aws.js";

const uploadFileToS3 = async (file, userId) => {
    const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: `${userId}/${new Date().toISOString()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
    }

    try {
        const data = await S3.upload(params).promise();
        return data.Location; // this will return url of uploaded file
    } catch (error) {
        throw new Error(`An error occurred while uploading into S3: ${error.message}`);
    }
}

export default uploadFileToS3;
