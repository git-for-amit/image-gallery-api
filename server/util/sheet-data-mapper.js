import path from 'path'
import Util from './util';

export default class SheetDataMapper {

    constructor(jsonData) {
        this.jsonData = jsonData;
    }

    mapJsonToDBData() {
        let jd = this.jsonData;
        let arr = []
        if (jd && jd instanceof Array) {
            for (let i = 0; i < jd.length; i++) {
                if (i == 0) {
                    continue;
                }
                let keys = Object.keys(jd[i]);
                let categoryname = '';
                let filenameArray = []
                let attributes = ''
                let code = ''
                for (let j = 0; j < keys.length; j++) {
                    switch (j) {
                        case 0: {
                            categoryname = jd[i][keys[j]];
                            break;
                        }
                        case 1: {
                            code = jd[i][keys[j]];
                            break;
                        }
                        case 2: {
                            attributes = jd[i][keys[j]];
                            break;
                        }
                        case 3: {
                            let description = jd[i][keys[j]];
                            let arr = description.split(",");
                            for (let imgIndex = 0; imgIndex < arr.length; imgIndex++) {
                                let lowerCaseValue = arr[imgIndex].toLowerCase();
                                let startIndex = 0;
                                if (imgIndex == 0) {
                                    startIndex = Util.getStringIndex(lowerCaseValue, "file names : ");
                                    if (startIndex == -1) {
                                        startIndex = Util.getStringIndex(lowerCaseValue, "file names: ");
                                    }
                                    if (startIndex == -1) {
                                        startIndex = Util.getStringIndex(lowerCaseValue, "file names:");
                                    }
                                    if (startIndex == -1) {
                                        startIndex = Util.getStringIndex(lowerCaseValue, "file names");
                                    }

                                    if (startIndex == -1) {
                                        startIndex = Util.getStringIndex(lowerCaseValue, "file name : ");
                                    }
                                    if (startIndex == -1) {
                                        startIndex = Util.getStringIndex(lowerCaseValue, "file name: ");
                                    }
                                    if (startIndex == -1) {
                                        startIndex = Util.getStringIndex(lowerCaseValue, "file name:");
                                    }
                                    if (startIndex == -1) {
                                        startIndex = Util.getStringIndex(lowerCaseValue, "file name");
                                    }

                                }
                                let endIndex = Util.getStringIndex(lowerCaseValue, ".jpeg");
                                if (endIndex == -1) {
                                    endIndex = Util.getStringIndex(lowerCaseValue, ".png");
                                }
                                if (endIndex == -1) {
                                    endIndex = Util.getStringIndex(lowerCaseValue, ".gif");
                                }
                                if (endIndex == -1) {
                                    endIndex = Util.getStringIndex(lowerCaseValue, ".jpg");
                                }
                                if (startIndex != -1 && endIndex != -1) {
                                    let fn = lowerCaseValue.substring(startIndex, endIndex);
                                    console.log('File Name extracted from Sheet ', fn);
                                    filenameArray.push(fn.trim());
                                }

                            }
                            break;
                        }
                    }
                }
                for (let fn of filenameArray) {
                    fn = fn.trim();
                    let fullPath = path.resolve(Util.getImageStorageDirectory(), fn);
                    let object = {
                        path: fullPath,
                        filename: fn,
                        categoryname: categoryname,
                        attributes: attributes,
                        code: code
                    }
                    arr.push(object);
                }

            }
        }
        return arr;
    }

}