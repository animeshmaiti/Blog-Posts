import aws from 'aws-sdk';
import { nanoid } from 'nanoid';

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    signatureVersion: 'v4'
});

export const generateUploadURL = async (req, res) => {
    const date = new Date();
    const { contentType } = req.query; // <-- get contentType from query

    if (!contentType) {
        return res.status(400).json({ error: 'Missing contentType' });
    }

    const extension = contentType.split('/')[1]; // like 'jpeg' or 'png'
    const imageName = `${nanoid()}-${date.getTime()}.${extension}`;

    try {
        const imgUrl = await s3.getSignedUrlPromise('putObject', {
            Bucket: 'blogpost-resources-007',
            Key: imageName,
            Expires: 1000,
            ContentType: contentType
        });
        res.status(200).json({ url: imgUrl });
    } catch (error) {
        console.error('Error generating signed URL', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const createBlog = async (req, res) => {

}
