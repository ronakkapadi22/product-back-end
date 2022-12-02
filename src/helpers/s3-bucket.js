import { S3Client } from '@aws-sdk/client-s3'
import multer from 'multer'
import multerS3 from 'multer-s3'
import * as dotenv from 'dotenv'
dotenv.config()

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
  region: process.env.BUCKET_REGION,
})

const BUCKET_NAME = process.env.BUCKET_NAME

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME || "nova-ecom",
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.originalname });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
})