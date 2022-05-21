const path = require('path');
const fs = require('fs');

const myTargetDirectory = path.join(__dirname, 'files-copy');
const mySourceDirectory = path.join(__dirname, 'files');

fs.rm(myTargetDirectory, { recursive: true, force: true }, (err) => {
  if (err) console.log(err.message);
  folderCopy(mySourceDirectory, myTargetDirectory);
});

function folderCopy(sourcePath, targetPath) {
  fs.mkdir(targetPath, { recursive: true }, (err) => {
    if (err) console.log(err.message);
    fs.readdir(sourcePath, { withFileTypes: true }, (err, files) => {
      if (err) console.log(err.message);
      files.forEach((file) => {
        if (file.isFile()) {//file
          fs.copyFile(path.join(sourcePath, file.name), path.join(targetPath, file.name), (err) => {
            if (err) console.log(err.message);
          });
        }
        else {//directory
          folderCopy(path.join(sourcePath, file.name), path.join(targetPath, file.name));
        }
      });
    });
  });
}


