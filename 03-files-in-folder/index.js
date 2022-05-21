const path = require('path');
const fs = require('fs');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, {withFileTypes: true}, (err, data) => {
  if(err) console.log(err.message);
  data.forEach((el) => {
    if(el.isDirectory()) return;
    // console.log(el, el.isDirectory());
    let filePath = path.join(dirPath, el.name);
    fs.stat(filePath, (err, data) => {
      if (err) console.log(err.message);
      let extention = path.extname(el.name);
      let name = path.basename(el.name, extention);
      console.log(name+'-'+extention.slice(1)+'-'+data.size/1024+'kb');
    });
  });
});
