(() => {
  'use strict';

  const path = require('path');
  const express = require('express');
  const app = express();
  const server = require('http').createServer(app);
  const bodyParser = require('body-parser');
  const TAGGING = /(#[a-z\d][\w-]*)/g;
  const db = {
    tasks: [
      { id: 0, name: 'Enable editor', completed: false },
      { id: 1, name: 'Polish statistics', completed: false },
      { id: 2, name: 'Basic ToDo', completed: true },
      { id: 3, name: 'Add error messages', completed: false }
    ],
    groups: {
      '#editor': [0] 
    }
  };

  app.use(express.static(path.join(__dirname, '/public')));
  app.use(bodyParser.json());
  app.set('port', 1350);
  app.get('/', (req, res) => { res.render('index'); });
  app.set('views', 'views');
  app.set('view engine', 'ejs');
  app.get('/api/tasks', (req, res) => res.json(db.tasks.filter(task => !!task).sort(task => (task.completed ? 1 : 0))));
  app.get('/api/tasks/:id', (req, res) => res.json(db.tasks[req.params.id]));
  app.put('/api/tasks/:id', (req, res) => res.json(updateTask(req.params.id, req.body)));
  app.post('/api/tasks', (req, res) => res.json(saveTask(req.body)));
  app.delete('/api/tasks/:id', (req, res) => res.json(deleteTask(req.params.id)));
  app.get('/api/stats', (req, res) => res.json(doStats()));
  app.get('/api/audit', (req, res) => res.json(db));

  server.listen(app.get('port'), function () {
    console.log('BM server ready on port', app.get('port'));
  });

  function saveTask(body) {
    const task = {};
    task.id = db.tasks.length;
    task.name = body.name;
    task.completed = false;
    task.createdAt = new Date().getTime();
    findGroups(task);
    cleanHashtags(task);
    db.tasks.push(task);
    return task;
  }

  function updateTask(id, props) {
    const task = db.tasks[id];
    if (!task) {
      console.warn(`Task #{id} not found`);
      return {};
    }
    task.name = props.name;
    task.name = props.name;
    task.completed = props.completed;
    task.updatedAt = new Date().getTime();
    db.tasks[id] = task;
    return task;
  }

  function deleteTask(id) {
    const task = db.tasks[id];
    db.tasks[id] = undefined;
    return task;
  }

  function doStats() {
    const tasks = db.tasks.filter(task => !!task);
    const done = tasks.filter(task => task ? task.completed : false);

    return {
      done: done.length,
      total: tasks.length,
      pending: tasks.length - done.length,
      removed: db.tasks.length - tasks.length,
      ts: new Date().getTime()
    };
  }

  function findGroups(task) {
    const hashtags = task.name.match(TAGGING);
    if (hashtags) {
      hashtags.forEach(tag => db.groups[tag] ? db.groups[tag].push(task.id) : db.groups[tag] = [task.id]);
    }
  }

  function cleanHashtags(task) {
    task.name = task.name.replace(TAGGING, '');
    task.name = task.name || 'New task ' + task.id;
  }

})();
