const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');

const util = require('../util');
require('dotenv').config();

// Por Texto
const byText = async (req, res) => {
  try {
    // Parâmetro Mensagem
    const messageParam = req['query']['message'];

    // Gemini
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);

    // Modelo Gemini escolhido
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash'
    });

    // Gerando o conteúdo de retorno com base no texto enviado
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: messageParam,
            }
          ],
        }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.1,
      },
    });

    // Retorno
    return res.send({
      success: true,
      message: result.response.text(),
    });
  } catch (error) {
    console.error('gemini byText error: ', error.message);

    return res.send({
      success: false,
      message: 'Ocorreu um erro inesperado em nosso servidor. Tente novamente mais tarde ou entre em contato com o suporte se o problema persistir.',
    });
  }
};

// Por Imagem
const byImage = async (req, res) => {
  try {
    // Parâmetro Url
    const urlParam = req['query']['url'];
    // Parâmetro Mensagem
    const messageParam = req['query']['message'];

    // Gemini
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    // Gerenciador de Arquivos IA
    const fileManager = new GoogleAIFileManager(process.env.API_KEY);

    // Modelo Gemini escolhido
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
    });

    // Faz o Download da imagem através da Url enviada
    await util.download(urlParam);

    // Upload do Arquivo
    const uploadResponse = await fileManager.uploadFile('ia.png', {
      mimeType: 'image/jpeg',
      displayName: 'Imagem IA',
    });

    // Retorno do Upload
    console.log(`Arquivo ${uploadResponse.file.displayName}: ${uploadResponse.file.uri}`);

    // Gerando o conteúdo de retorno com base na imagem e no texto enviados
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri
        }
      },
      { text: messageParam },
    ]);

    // Retorno
    return res.send({
      success: true,
      message: result.response.text(),
    });
  } catch (error) {
    console.error('gemini byImage error: ', error.message);

    return res.send({
      success: false,
      message: 'Ocorreu um erro inesperado em nosso servidor. Tente novamente mais tarde ou entre em contato com o suporte se o problema persistir.',
    });
  }
};

module.exports = {
  byText,
  byImage,
};