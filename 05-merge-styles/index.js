const path = require('path');
const fs = require('fs');
const { promises: { readFile } } = require('fs');

const sourcePath = path.join(__dirname, 'styles');

fs.readdir(sourcePath, { withFileTypes: true }, (err, files) => {
  let fullPaths = [];
  files.forEach((file) => {
    if(file.isDirectory()) return;
    if(path.extname(file.name)==='.css') fullPaths.push(path.join(__dirname, 'styles', file.name));
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
    fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), totalContent, (err)=>{
      if(err) console.log('Error while putting content in bundle.css file: '+err.message);
    });
  }).catch((err)=>{
    console.log(err.message);
    process.exit(1);
  });

});




// readFile(path.join(__dirname, 'styles', 'style-4.css'))
//   .then((fileBuf) => {
//     console.log(fileBuf.toString());
//   },
//   (err) => {
//     console.log(err.message);
//   });
