const fs = require('fs');
const axios = require('axios');

// Faz o Download da imagem através da Url enviada
const download = async (url) => {
  await axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream('ia.png'))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );
};

module.exports = {
  download,
};