(() => {
  'use strict';

  const path = require('path');
  const express = require('express');
  const app = express();
  const server = require('http').createServer(app);

  app.use(express.static(path.join(__dirname, '/public')));
  app.set('port', 1350);
  app.get('/', (req, res) => { res.render('index'); });
  app.set('views', 'views');
  app.set('view engine', 'ejs');

  server.listen(app.get('port'), function () {
    console.log('BM server ready on port', app.get('port'));
  });

})();
