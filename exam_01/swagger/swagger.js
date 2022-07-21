const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const { version } = require('../package.json');

function swaggerDocs(app, apis) {
  const protocol = 'http';
  const domain = `localhost:${process.env.PORT}`;
  const channel = process.env.CHANNEL;

  const swaggerSpecOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'OLX API Docs',
        version,
      },
      servers: [
        // {
        //   // local server
        //   url: `${protocol}://${domain}${channel}`,
        // },
        {
          // global server
          url: `http://route-exam-01-node.herokuapp.com${channel}`,
        },
      ],
    },
    apis,
  };

  const swaggerSpec = swaggerJsDoc(swaggerSpecOptions);

  // App
  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'Welcome to the API',
      docs: `${req.protocol}://${req.headers.host}/docs`,
      docs_json: `${req.protocol}://${req.headers.host}/docs.json`,
    });
  });

  // Swagger UI options
  const swaggerUIOptions = {
    customCss: '.swagger-ui .topbar, .title span { display: none }',
    customSiteTitle: 'olx api docs',
  };

  // Swagger page
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUIOptions));

  // Docs in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

module.exports = swaggerDocs;
