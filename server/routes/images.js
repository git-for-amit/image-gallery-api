import express from 'express'
import * as fs from 'fs';
import * as path from 'path';
import { verify } from 'jsonwebtoken';
import { Secret } from '../config/secret';
import { uploadFilesMiddlewarePromisified } from '../util/upload'
import Image from '../models/db-image'
import Util from '../util/util';

var router = express.Router();



/* GET users listing. */
router.get('/:userId', async (req, res, next) => {
    try {
        let imgeFileRegex = /\.(png|gif|webp|jpeg|jpg)\??.*$/gmi;
        let imageFolder = `public/images/${req.params.userId}`;
        let allFileNames = []
        fs.readdirSync(imageFolder).forEach(file => {
            if (imgeFileRegex.test(file)) {
                let imageFileName = `images/${req.params.userId}/` + file;
                allFileNames.push(imageFileName);
            }

        });
        let listOfFiles = {
            fileNameList: allFileNames
        }
        res.status(200).send(listOfFiles);
    } catch (err) {
        res.status(500).send({ message: "User get image file names!", err: err });
    }
});

router.get('/:userId/:imageFileName',
    (req, res, next) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)
        let verified = verify(token, Secret.get());
        if (verified) {
            next()
        } else {
            return res.sendStatus(401);
        }
    },
    async (req, res, next) => {
        try {
            let requestedImageFileName = req.params.imageFileName;
            if (!requestedImageFileName) {
                res.status(404).send('The requested resource was not found');
                return;
            }
            let imageFolder = `public/images/${req.params.userId}`;
            let imageFilePath = ''
            let fileNames = fs.readdirSync(imageFolder);
            for (let file of fileNames) {
                if (requestedImageFileName == file) {
                    imageFilePath = `../../public/images/${req.params.userId}/` + file;
                    break;
                }
            }
            if (imageFilePath) {
                let absImageFilePath = path.resolve(__dirname, imageFilePath)
                res.sendFile(absImageFilePath);
            } else {
                res.status(404).send('The requested resource was not found');
            }

        } catch (err) {
            console.log(err)
            res.status(500).send({ message: "Unable to get image!", err: err });
        }
    });



router.post('/upload-all', async (req, res, next) => {
    try {
        await uploadFilesMiddlewarePromisified(req, res);
        for (let file of req.files) {
            if (file && file.filename.indexOf(".xlsx") != -1) {
                let fileObjectArr =  await Util.getAllFileObjects(file.path);
                await Util.saveImages(fileObjectArr);
            }
        }
        return res.status(200).send({ message: "Upload Successful" })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Unable to upload files!", err: err });
    }
});


export default router;
