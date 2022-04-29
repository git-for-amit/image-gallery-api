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
        let imageFolder = `public/images/${req.params.userId}`;
        let imageObjectFileList = []
        const imageList = await Image.findAll();
        console.log("value of imagelist")
        if (imageList) {
            for (let i = 0; i < imageList.length; i++) {
                const imPath = imageList[i].path;
                if (fs.existsSync(imPath)) {
                    if (imPath.indexOf('.xls') == -1 && imPath.indexOf('.xlsx') == -1) {
                        let relativePath = `images/${req.params.userId}/` + imageList[i].filename;
                        let id = imageList[i].id;
                        let code = imageList[i].code;
                        let categoryname = imageList[i].categoryname;
                        let filename = imageList[i].filename
                        imageObjectFileList.push({
                            relativePath,
                            id,
                            code,
                            categoryname,
                            filename
                        });
                    }
                }
            }
        }

        // fs.readdirSync(imageFolder).forEach(file => {
        //     if (file.indexOf('.xls') == -1 && file.indexOf('.xlsx') == -1) {
        //         let imageFileName = `images/${req.params.userId}/` + file;
        //         allFileNames.push(imageFileName);
        //     }

        // });
        let listOfFiles = {
            images: imageObjectFileList
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
            requestedImageFileName = decodeURIComponent(requestedImageFileName);
            if (!requestedImageFileName) {
                res.status(404).send('The requested resource was not found');
                return;
            }
            let imageFolder = `public/images/${req.params.userId}`;
            let imageFilePath = ''
            let fileNames = fs.readdirSync(imageFolder);
            for (let file of fileNames) {
                if (requestedImageFileName.toLowerCase() == file.toLowerCase()) {
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
                let fileObjectArr = await Util.getAllFileObjects(file.path);
                await Util.saveImages(fileObjectArr);
            }
        }
        return res.status(200).send({ message: "Upload Successful" })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Unable to upload files!", err: err });
    }
});

router.post('/assign', async (req, res, next) => {
    try {
        let imageAssignmentData = req.body.imageAssignmentData;
        console.log(imageAssignmentData);
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Unable to assign images to user!", err: err });
    }
})


export default router;
