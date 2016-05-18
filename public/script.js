'use strict';

((B, M) => {
  const ENTER = 13;
  const Task = B.Model.extend({
    url: '/api/tasks',
    validate: function (attributes) {
      if (!attributes.name) {
        return 'Task name can\'t be empty';
      }
    }
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
      this.editorRegion.show(new EditorView({ model: new Task()}));
      this.itemsRegion.show(new ItemsView());
      this.statsRegion.show(new StatsView());
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
      this.model.set('completed', false);
      this.model.set('createdAt', new Date().getTime());
      this.model.validate(this.model.attributes);
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
    template: '#template-items',
    events: {},
    initialize: function () { }
  });
  const StatsView = M.ItemView.extend({
    template: '#template-stats',
    events: {},
    initialize: function () { }
  });

  App.start();
})(Backbone, Marionette);
