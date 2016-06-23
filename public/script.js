'use strict';

((B, M, H) => {
  const ENTER = 13;
  const API_URL = '/api/tasks';
  const Task = B.Model.extend({
    urlRoot: API_URL,
    validate: function (attributes) {
      if (!attributes.name) {
        return 'Task name can\'t be empty';
      }
    },
    toggle: function () {
      this.attributes.completed = !this.attributes.completed;
    }
  });

  const Stat = B.Model.extend({
    urlRoot: '/api/stats'
  });

  const TaskCollection = Backbone.Collection.extend({
    model: Task,
    url: API_URL
  });

  const StatsCollection = Backbone.Collection.extend({
    model: Stat,
    url: '/api/stats'
  });

  const ValidationBehavior = M.Behavior.extend({
    modelEvents: {
      'validated': 'setValidated'
    },
    onRender: function () {
      console.log('onrender');
    },
    setValidated: function () {
      this.hasBeenValidated = true;
    }
  });

  const app = new M.Application();
  app.addRegions({
    main: '#page'
  });

  const AppLayoutView = M.LayoutView.extend({
    template: '#app-template',
    regions: {
      editorRegion: '#editor',
      itemsRegion: '#items',
      statsRegion: '#stats'
    },
    onBeforeShow: function () {
      this.editorRegion.show(new EditorView({ model: new Task() }));
      controller.loadItems(this);
      controller.loadStats(this);
    }
  });

  app.addInitializer(function () {
    app.main.show(new AppLayoutView());
  });

  const EditorView = M.ItemView.extend({
    template: '#editor-template',
    events: {
      'keydown #task-name': 'create',
      'click #submit': 'create',
      'click #clear': 'clear'
    },
    ui: {
      'name': '#task-name'
    },
    initialize: function () { },
    create: function (event) {
      if (event.type === 'click' || event.type === 'keydown' && event.keyCode === ENTER) {
        this.save();
      }
    },
    save: function () {
      const self = this;
      this.model.set('name', $(this.ui.name).val());
      this.model.validate(this.model.attributes);
      if (!this.model.isValid()) {
        console.log(this.model.validationError);
      }
      this.model.save().then(function () {
        $(self.ui.name).val('');
        self.model = new Task({ name: '' });
        controller.loadItems();
      });
    },
    clear: function () {
      $(this.ui.name).val('');
      this.model.clear();
    },
    behaviors: {
      validation: {
        behaviorClass: ValidationBehavior
      }
    }
  });

  const ItemsView = M.ItemView.extend({
    events: {
      'click .toogle-task': 'toggle',
      'click .remove-task': 'drop'
    },
    toggle: function (event) {
      const id = $(event.target).attr('data-id');
      const task = controller.itemsList.get(id);
      task.toggle();
      task.save().then(function () {
        controller.loadItems();
      });
    },
    drop: function () {
      const id = $(event.target).attr('data-id');
      const task = controller.itemsList.get(id);
      if (!task) {
        return controller.loadItems();
      }

      task.destroy().then(function () {
        controller.loadItems();
      });
    },
    initialize: function () { },
    serializeData: function () { }
  });

  const StatsView = M.ItemView.extend({
    events: {},
    initialize: function () { },
    serializeData: function () { }
  });

  const Controller = Marionette.Object.extend({
    initialize: function () {
      this.itemsTemplate = H.compile($('#items-template').html());
      this.statsTemplate = H.compile($('#stats-template').html());
      this.itemsList = new TaskCollection();
      this.statsList = new StatsCollection();
    },
    getItem: function (id) {
      return this.itemsList.get(id);
    },
    loadItems: function (appref) {
      const self = this;
      self.app = self.app || appref;
      self.itemsList.fetch().then(items => {
        const data = {};
        data.title = 'Task Viewer';
        data.items = items;

        self.app.itemsRegion.show(new ItemsView({
          collection: data,
          template: self.itemsTemplate(data)
        }));
      });
      self.loadStats();
    },
    loadStats: function (appref) {
      const self = this;
      self.app = self.app || appref;
      self.statsList.fetch().then(data => {
        self.app.statsRegion.show(new StatsView({
          collection: self.calc(data),
          template: self.statsTemplate(data)
        }));
      });
    },
    calc(data) {
      data.at = new Date(data.ts);
      data.donePerc = Math.round(data.done / data.total * 10000) / 100;
      data.pendingPerc = Math.round(data.pending / data.total * 10000) / 100;
      return data;
    }
  });

  const controller = new Controller();

  app.start();
})(Backbone, Marionette, Handlebars);
