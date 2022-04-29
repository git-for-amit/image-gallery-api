const XLSX = require('xlsx');

export default class XLSXParser {

    constructor(fileName) {
        this.fileName = fileName;
    }

    readExcel() {
        this.workbook = XLSX.readFile(this.fileName);
        return this.workbook;
    }

    getWorkbook() {
        return this.workbook
    }

    getSheetNames() {
        if (this.workbook) {
            return this.workbook.SheetNames
        }
        return null;
    }

    getJsonData(sheetName) {
        if (this.workbook) {
            return XLSX.utils.sheet_to_json(this.workbook.Sheets[sheetName]);
        }
    }
}
