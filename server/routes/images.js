import express from 'express'
import * as fs from 'fs';

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

export default router;
