import express from 'express'
import * as fs from 'fs';
import * as path from 'path';
import { verify } from 'jsonwebtoken';
import { Secret } from '../config/secret';
import { uploadFilesMiddlewarePromisified } from '../util/upload'
import Image from '../models/db-image'
import Util from '../util/util';
import UserImage from '../models/db-image-user'
import User from '../models/user';

var router = express.Router();



/* GET images listing. */
router.get('/:userId', async (req, res, next) => {
    try {
        let categoryname = req.query.categoryname;

        let email = req.params.userId;
        let userList = await User.findAll({
            where: {
                email: email,
            }
        })
        let imageList = null;
        if (email == 'admin') {
            imageList = null;
            if (!categoryname) {
                imageList = await Image.findAll()
            } else {
                imageList = await Image.findAll({
                    where: {
                        categoryname: categoryname
                    }
                })
            }

            console.log("imageList", imageList);
        } else {
            if (userList && userList.length) {
                let userImageList = await UserImage.findAll({
                    where: {
                        userid: userList[0].id
                    }
                });
                if (userImageList && userImageList.length) {
                    imageList = []
                    let whereClause = null;
                    if (categoryname) {
                        whereClause = {
                            where: {
                                categoryname: categoryname
                            }
                        }
                    } else {
                        whereClause = {
                            where: {
                            }
                        }
                    }
                    for (let uimg of userImageList) {
                        whereClause.where.id = uimg.imageid;
                        let img = await Image.findOne(whereClause);
                        imageList.push(img);
                    }

                }
            }

        }

        let imageObjectFileList = []

        if (imageList) {
            let allFileNamesInTheDirectory = Util.getAllImageNamesInTheDirectory()
            allFileNamesInTheDirectory = allFileNamesInTheDirectory.map((value, index, array) => {
                return Util.applyFileNameTransformation(value);
            })
            for (let i = 0; i < imageList.length; i++) {
                if (imageList[i]) {
                    const imPath = imageList[i].path;
                    if (imPath.indexOf('.xls') == -1 && imPath.indexOf('.xlsx') == -1) {
                        let fn = imageList[i].filename;
                        if (allFileNamesInTheDirectory.indexOf(Util.applyFileNameTransformation(fn)) != -1) {
                            let relativePath = Util.getPartialRelativePath() + fn;
                            let id = imageList[i].id;
                            let code = imageList[i].code;
                            let categoryname = imageList[i].categoryname;
                            let subcategoryname = imageList[i].subcategoryname;
                            let filename = imageList[i].filename
                            imageObjectFileList.push({
                                relativePath,
                                id,
                                code,
                                categoryname,
                                filename,
                                subcategoryname
                            });
                        }

                    }
                }

            }
        }

        let listOfFiles = {
            images: imageObjectFileList
        }
        res.status(200).send(listOfFiles);
    } catch (err) {
        console.log('Error while retrieving image names ', err)
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

            let absImageFilePath
            let fileNames = Util.getAllImageNamesInTheDirectory();
            requestedImageFileName = Util.applyFileNameTransformation(requestedImageFileName);

            for (let actualFileNameOnDisk of fileNames) {
                console.log("value of requestedImageFileName ", requestedImageFileName)
                let modifiedFileNameOnDisk = Util.applyFileNameTransformation(actualFileNameOnDisk);
                if (requestedImageFileName == modifiedFileNameOnDisk) {
                    absImageFilePath = path.resolve(Util.getImageStorageDirectory(), actualFileNameOnDisk);
                    break;
                }
            }
            if (absImageFilePath) {
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
        let imageAssignmentData = req.body;
        console.log(imageAssignmentData);
        if (imageAssignmentData.userList) {
            let userList = imageAssignmentData.userList;
            for (let u of userList) {
                let existingUserImage = await UserImage.findAll({
                    where: {
                        userid: u.id,
                    }
                });
                if (existingUserImage && existingUserImage.length) {
                    await UserImage.destroy({
                        where: {
                            userid: u.id
                        }
                    })
                }
            }
            if (imageAssignmentData.imageList) {
                let imageList = imageAssignmentData.imageList;
                for (let u of userList) {
                    for (let img of imageList) {
                        let existingUserImage = await UserImage.findAll({
                            where: {
                                userid: u.id,
                                imageid: img.id
                            }
                        })
                        if (existingUserImage && existingUserImage.length) {
                            continue;
                        } else {
                            await UserImage.create({
                                userid: u.id,
                                imageid: img.id
                            });
                        }
                    }
                }
            }
        }
        return res.status(200).send({ message: "Image Assignment Successful" })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Unable to assign images to user!", err: err });
    }
})


export default router;
