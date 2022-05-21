const path = require('path');
const fs = require('fs');

const readStrim = fs.createReadStream(path.join(__dirname, 'text.txt'));

let strOut = '';

readStrim.on('data', (chunk) => {
  strOut += chunk.toString();
});

readStrim.on('end', () => {
  console.log(strOut);
});

readStrim.on('error', (err) => {
  console.log('There is an error: ' + err.message);
});
