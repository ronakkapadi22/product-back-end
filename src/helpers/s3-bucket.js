import { S3Client } from '@aws-sdk/client-s3'
import multer from 'multer'
import multerS3 from 'multer-s3'

const s3 = new S3Client({
  secretAccessKey: process.env.SECRET_KEY,
  accessKeyId: process.env.ACCESS_KEY,
  region: process.env.BUCKET_REGION,
})

const BUCKET_NAME = process.env.BUCKET_NAME || 'learn-nova-s3-bucket'

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.originalname });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
})

// export const uploadFiles = (data) => {
//   return upload.array(data)
// }