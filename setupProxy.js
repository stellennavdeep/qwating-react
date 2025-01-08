const { createProxyMiddleware } = require('http-proxy-middleware');
var cors = require('cors')
app.use(cors()) 

module.exports = function(app) {
  app.use(
    '/webservices',
    createProxyMiddleware({
      target: 'https://moi.saasdevteam.com',
      changeOrigin: true,
      pathRewrite: { '^/webservices': '' },
    })
  );
};
