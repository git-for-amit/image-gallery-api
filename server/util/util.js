import XLSXParser from "./xlsx-parser";
import SheetDataMapper from "./sheet-data-mapper";
import Image from "../models/db-image";
import * as fs from 'fs'
import * as path from 'path';


export default class Util {
    static getPartialRelativePath() {
        return 'images/admin/'
    }
    static getImageStorageDirectory() {
        return path.resolve(__dirname, '../../public/', Util.getPartialRelativePath());
    }
    static async getAllFileObjects(fileName) {
        let fileObjectArr = []
        let xp = new XLSXParser(fileName);
        xp.readExcel();
        let sheetNames = xp.getSheetNames();
        for (let sn of sheetNames) {
            let jsonData = xp.getJsonData(sn);
            let sdm = new SheetDataMapper(jsonData);
            let fbArr = sdm.mapJsonToDBData()
            fileObjectArr = fileObjectArr.concat(fbArr);
        }
        return fileObjectArr;
    }

    static async saveImages(fileObjectArr) {
        if (fileObjectArr && fileObjectArr instanceof Array) {
            for (let fileObject of fileObjectArr) {
                const existingImages = await Image.findAll({
                    where: {
                        filename: fileObject.filename,
                        categoryname: fileObject.categoryname,
                        code: fileObject.code
                    }
                });
                if (existingImages && existingImages.length) {
                    await Image.update({
                        attributes: fileObject.attributes
                    }, {
                        where: {
                            filename: fileObject.filename,
                            categoryname: fileObject.categoryname,
                            code: fileObject.code
                        }
                    })
                } else {
                    await Image.create({
                        filename: fileObject.filename,
                        categoryname: fileObject.categoryname,
                        code: fileObject.code,
                        path: fileObject.path,
                        attributes: fileObject.attributes
                    })
                }
            }
        }
    }

    static getAllImageNamesInTheDirectory() {
        let absImageFilePath = Util.getImageStorageDirectory();
        let fileNames = fs.readdirSync(absImageFilePath);
        return fileNames;
    }

    static getStringIndex(findInString, stringToFind) {
        let stringToFindLength = stringToFind.length;
        let index = findInString.indexOf(stringToFind);
        if (index != -1) {
            index = index + stringToFindLength;
        }
        return index;
    }

    static applyFileNameTransformation(stringFileName) {
        stringFileName = stringFileName.toLowerCase();
        if (stringFileName.indexOf(".") != -1) {
            stringFileName = stringFileName.substring(0, stringFileName.lastIndexOf("."));
        }
        stringFileName = stringFileName.replaceAll(" ", "");
        return stringFileName;
    }
}