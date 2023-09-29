import multer from 'multer';
import {promises as fs} from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import config from './config';

const imageStorage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    // home/pavel/js-group-18/shop/shop-api/public/images
    const destDir = path.join(config.publicPath, 'images');
    await fs.mkdir(destDir, {recursive: true});
    cb(null, config.publicPath);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname); // 29384928734982734.jpg
    cb(null,'images/' + randomUUID() + extension);
  }
});

export const imagesUpload = multer({storage: imageStorage});