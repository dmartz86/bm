(() => {
  'use strict';

  const path = require('path');
  const express = require('express');
  const app = express();
  const server = require('http').createServer(app);
  const bodyParser = require('body-parser');
  const db = { tasks: [
    {id: 0, name: 'Clean the directory'},
    {id: 1, name: 'Remove the blockers', completed: true},
    {id: 2, name: 'Delete spam'}
  ]};

  app.use(express.static(path.join(__dirname, '/public')));
  app.use(bodyParser.json());
  app.set('port', 1350);
  app.get('/', (req, res) => { res.render('index'); });
  app.set('views', 'views');
  app.set('view engine', 'ejs');
  app.get('/api/tasks', (req, res) => res.json(db.tasks.filter(task => task !== undefined)));
  app.get('/api/tasks/:id', (req, res) => res.json(db.tasks[req.params.id]));
  app.put('/api/tasks/:id', (req, res) => res.json(db.tasks[req.params.id]));
  app.post('/api/tasks', (req, res) => res.json(db.tasks.push(beforeSave(req.body))));
  app.delete('/api/tasks/:id', (req, res) => res.json(db.tasks[req.params.id] = undefined));

  server.listen(app.get('port'), function () {
    console.log('BM server ready on port', app.get('port'));
  });
  
  function beforeSave(body) {
    const task = {};
    task.name = body.name;
    task.completed = false;
    task.createdAt = new Date().getTime();
    return task;
  }

})();
