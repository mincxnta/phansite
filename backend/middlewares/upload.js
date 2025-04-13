import multer from 'multer'
import path from 'node:path'

const MIMETYPES = ['image/png', 'image/jpg', 'image/jpeg']

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    let filename

    if (file.fieldname === 'profilePicture') {
      filename = `${req.user.id}.jpg`
    } else if (file.fieldname === 'targetImage') {
      filename = `request-${Date.now()}${path.extname(file.originalname)}`
    } else if (file.fieldname === 'image') {
      filename = `message-${Date.now()}${path.extname(file.originalname)}`
    }
    cb(null, filename)
  }
})

const fileFilter = (req, file, cb) => {
  if (MIMETYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only PNG, JPG, and JPEG are allowed.'))
  }
}

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter
})
