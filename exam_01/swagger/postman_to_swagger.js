const path = require('path');
const postmanToOpenApi = require('postman-to-openapi');
const postmanCollection = path.join(__dirname, '../exam_01.postman_collection.json');
const outputFile = path.join(__dirname, './swagger.yaml');

(async function () {
  try {
    await postmanToOpenApi(postmanCollection, outputFile, { defaultTag: 'General' });
    console.log('~ done converting postman to yaml');
  } catch (err) {
    console.log('~ convert postman to yaml err', err);
  }
})();
