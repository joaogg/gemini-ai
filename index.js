const routesGemini = require('./routes/gemini');

const express = require('express');
const app = express();
const port = 3000;

// Rota Por Texto
app.get('/byText', routesGemini.byText);
// Rota Por Imagem
app.get('/byImage', routesGemini.byImage);

app.listen(port, () => {
  console.log(`Servidor Porta: ${port}`)
});