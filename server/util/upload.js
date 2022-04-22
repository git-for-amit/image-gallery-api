import * as util from 'util'
import path from 'path'
import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, path.join(`${__dirname}/../../public/images/admin`));
    },
    filename: (req, file, callback) => {
      var filename = file.originalname;
      callback(null, filename);
    }
  });

const uploadFiles = multer({ storage: storage }).array("multi-files", 10);
const uploadFilesMiddleware = util.promisify(uploadFiles);

export const uploadFilesMiddlewarePromisified = util.promisify(uploadFilesMiddleware);