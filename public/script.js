'use strict';

((B, M, H) => {
  const ENTER = 13;
  const Task = B.Model.extend({
    url: '/api/tasks',
    validate: function (attributes) {
      if (!attributes.name) {
        return 'Task name can\'t be empty';
      }
    }
  });

  const Library = Backbone.Collection.extend({
    model: Task,
    url: '/api/tasks'
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

  const App = new M.Application();
  App.addRegions({
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
      const itemsTemplate = H.compile($('#template-items').html());
      new Library().fetch().then(items => {
        const data = {};
        data.title = 'Task Viewer';
        data.items = items;

        this.itemsRegion.show(new ItemsView({
          collection: data,
          template: itemsTemplate(data)
        }));
        this.editorRegion.show(new EditorView({ model: new Task() }));
        this.statsRegion.show(new StatsView());
      });
    }
  });

  App.addInitializer(function () {
    App.main.show(new AppLayoutView());
  });

  const EditorView = M.ItemView.extend({
    template: '#template-editor',
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
      this.model.set('name', $(this.ui.name).val());
      this.model.validate(this.model.attributes);
      if (!this.model.isValid()) {
        console.log(this.model.validationError);
      }
      this.model.save();
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
      'click .toogle': 'toggle'
    },
    ui: {
      'name': '#task-name'
    },
    toggle: function (event) {
      console.log($(event.target).attr('data-id'));
    },
    initialize: function () { },
    serializeData: function () {}
  });

  const StatsView = M.ItemView.extend({
    template: '#template-stats',
    events: {},
    initialize: function () { }
  });

  App.start();
})(Backbone, Marionette, Handlebars);
