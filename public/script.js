'use strict';

((B, M) => {
  const App = new Marionette.Application();
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
      this.editorRegion.show(new EditorView());
      this.itemsRegion.show(new ItemsView());
      this.statsRegion.show(new StatsView());
    }
  });
  App.addInitializer(function() {
    App.main.show(new AppLayoutView());
  });
  
  const EditorView = M.ItemView.extend({
    template: '#template-editor',
    events: {},
    initialize: function() {}
  });
  const ItemsView = M.ItemView.extend({
    template: '#template-items',
    events: {},
    initialize: function() {}
  });
  const StatsView = M.ItemView.extend({
    template: '#template-stats',
    events: {},
    initialize: function() {}
  });
  
  $(document).ready( () => App.start());
})(Backbone, Marionette);
