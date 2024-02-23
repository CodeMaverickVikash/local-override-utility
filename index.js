const fs = require('fs');
const { parse } = require('node-html-parser');
const readline = require('readline');


const BASE_URL_NAME = "";
let serverFilesArray = [],
    localFilesArray = [];

let localOverrideUtils = (function () {
    /**
     * @description init local override utility
     */
    const init = function () {
        Promise.all([prepareLocalFilesArr(), prepareServerFilesArr()]).then(() => {
            replaceLocalFileWithServerFile();
        }, error => {
            console.error('Error:', error);
        });
    }

    /**
     * @description prepare server files array
     */
    const prepareServerFilesArr = function () {
        const filePath = './server-override-files.txt';
        return new Promise((resolve, reject) => {
            const rl = readline.createInterface({
                input: fs.createReadStream(filePath),
                crlfDelay: Infinity
            });

            rl.on('line', (line) => {
                let fileName = line.split(" ")[0];
                serverFilesArray.push(fileName);
            });

            rl.on('close', () => {
                resolve();
                console.log('prepareServerFilesArr ------> success');
            });
        });
    }

    /**
     * @description prepare local files array
     */
    const prepareLocalFilesArr = function () {
        return new Promise((resolve, reject) => {
            fs.readFile(`./${BASE_URL_NAME}/scripts/ng-vendor/ngVendor.jsp`, 'utf8', function (err, fileData) {
                const htmlString = fileData,
                    htmlDocument = parse(htmlString);

                let choices = htmlDocument.querySelectorAll("script");
                choices.forEach((scriptTag) => {
                    const fileName = scriptTag.getAttribute('src').split('/ng-vendor/')[1];
                    localFilesArray.push(fileName);
                });
                choices = htmlDocument.querySelectorAll("link");
                choices.forEach((linkTag) => {
                    const fileName = linkTag.getAttribute('href').split('/ng-vendor/')[1];
                    localFilesArray.push(fileName);
                });
                resolve();
                console.log("prepareLocalFilesArr ------> success");
            });
        });
    }

    /**
     * @description replace local file with server file
     */
    function replaceLocalFileWithServerFile() {
        localFilesArray.forEach((localFileName) => {
            let fileUrl = `./${BASE_URL_NAME}/scripts/ng-vendor/`;
            let serverFileName = serverFilesArray.find(fileName => fileName.split('.')[0] == localFileName.split('.')[0]);
            serverFileName = encodeFileNameToSave(serverFileName);

            const localFilePath = fileUrl + localFileName;
            const serverFilePath = fileUrl + serverFileName;
            fs.rename(localFilePath, serverFilePath, (err) => {
                if (err) {
                    console.error('Error renaming file:', err);
                    return;
                }
                console.log('File renamed successfully');
            });
        });
    }

    /**
     * @description encode file name before replacing
     */
    const encodeFileNameToSave = function (fileName) {
        return fileName.replace('?', encodeURIComponent('?'));
    }

    return { init };
})();

localOverrideUtils.init();