import path from 'path'

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
                            let str = 'File names'
                            let index = description.indexOf(str);
                            index = index + str.length;
                            let allFileNames = description.substring(index);
                            allFileNames = allFileNames.trim().replaceAll(":", "");
                            filenameArray = allFileNames.split(',')
                            break;
                        }
                    }
                }
                for (let fn of filenameArray) {
                    fn = fn.trim();
                    let object = {
                        path: path.join(`${__dirname}/../../public/images/admin/${fn}`),
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