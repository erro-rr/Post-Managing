const fs = require('fs').promises;
const deleteUploadFilefunc = async (filePath) => {
    try {
        await fs.unlink(filePath);
        console.log("file deleted Successfully");
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = deleteUploadFilefunc;