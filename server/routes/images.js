import express from 'express'
import * as fs from 'fs';
import * as path from 'path';

var router = express.Router();

/* GET users listing. */
router.get('/:userId', async (req, res, next) => {
    try {
        let imageFolder = `public/images/${req.params.userId}`;
        let allFileNames = []
        fs.readdirSync(imageFolder).forEach(file => {
            let imageFileName = `images/${req.params.userId}/` + file;
            allFileNames.push(imageFileName);
        });
        let listOfFiles = {
            fileNameList: allFileNames
        }
        res.status(200).send(listOfFiles);
    } catch (err) {
        res.status(500).send({ message: "User get image file names!", err: err });
    }
});

router.get('/:userId/:imageFileName', async (req, res, next) => {
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

export default router;
