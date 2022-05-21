const path = require('path');
const fs = require('fs');

const { stdin, stdout } = process;

stdout.write('Добрый день/вечер/утро.\n');
stdout.write('Введите текст: ');

fs.writeFile(path.join(__dirname, 'text.txt'), '', (error) => {
  if(error) {
    stdout.write('Ошибка: ' + error.message);
  }
});

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  fs.readFile(path.join(__dirname, 'text.txt'), (err, dataRead) => {
    let text = dataRead.toString();
    fs.writeFile(path.join(__dirname, 'text.txt'), text + data.toString(), (err) => {
      if(err) stdout.write(err.message);
    });
    stdout.write('Можете еще ввести текст, (или команду "exit"): ');
  });
});


process.on('exit', () => {
  stdout.write('\nС Вамми приятно работать! \nДо свидания!');
});

process.on('SIGINT', () => {
  process.exit();
});

