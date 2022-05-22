const path = require('path');
const fs = require('fs');
const {promises: { readFile } } = require('fs');

const targetFolder = path.join(__dirname, 'project-dist');

fs.rm(targetFolder, {recursive: true, force: true}, (err) => {
  if(err) console.log(err.message);

  fs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, (err)=> {
    if(err) console.log(err.message);
    
    cssBuild(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'style.css'));
    folderCopy(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
    htmlReplace(path.join(__dirname, 'components'), path.join(__dirname, 'project-dist', 'index.html'));

  });

});

function htmlReplace(componentsFolderPath, targetFilePath){
  fs.readdir(componentsFolderPath, { withFileTypes: true }, (err, files) => {
    let fullPaths = [];
    files.forEach((file) => {
      if(file.isDirectory()) return;
      if(path.extname(file.name)==='.html') fullPaths.push(path.join(componentsFolderPath, file.name));
    });
  
    Promise.all(
      fullPaths.map(filePath => {
        return readFile(filePath);
      })
    ).then((filesContentArray) => {
      let contentToReplaceArray = [];
      filesContentArray.forEach((content, index) => {
        contentToReplaceArray.push({
          tag: '{{'+path.basename(fullPaths[index], path.extname(fullPaths[index]))+'}}',
          content: content.toString(),
        });
      });

      fs.readFile(path.join(__dirname, 'template.html'), (err, data) => {
        if(err) console.log(err.message);
        let rez = data.toString();

        contentToReplaceArray.forEach((el) => {
          rez = rez.replace(el.tag, el.content);
        });

        //remove empty tags if any
        rez = rez.replace(/{{(.*?)}}/, '');

        fs.writeFile(targetFilePath, rez, (err)=>{
          if(err) console.log('Error while putting content in html target file: '+err.message);
        });

      });
    }).catch((err)=>{
      console.log(err.message);
      process.exit(1);
    });  
  });
}

function cssBuild(sourcePath, targetFilePath){
  fs.readdir(sourcePath, { withFileTypes: true }, (err, files) => {
    let fullPaths = [];
    files.forEach((file) => {
      if(file.isDirectory()) return;
      if(path.extname(file.name)==='.css') fullPaths.push(path.join(sourcePath, file.name));
    });
  
    Promise.all(
      fullPaths.map(filePath => {
        return readFile(filePath);
      })
    ).then((filesContentArray) => {
      let totalContent = '';
      filesContentArray.forEach((content) => {
        totalContent += content.toString()+'\n';
      });
      fs.writeFile(targetFilePath, totalContent, (err)=>{
        if(err) console.log('Error while putting content in bundle.css file: '+err.message);
      });
    }).catch((err)=>{
      console.log(err.message);
      process.exit(1);
    });  
  });
}

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
