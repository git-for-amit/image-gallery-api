import XLSXParser from "./xlsx-parser";
import SheetDataMapper from "./sheet-data-mapper";
import Image from "../models/db-image";

export default class Util {
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
}