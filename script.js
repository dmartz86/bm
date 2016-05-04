((w) => {
  const GeneralRegion = Marionette.Region.extend({el: '.general-region'});
  const UserRegion = Marionette.Region.extend({el: '.users-region'});
  const UserModel = new Backbone.Model({});
  const UserCollection = new Backbone.Collection({});
  const UserTemplate = 'User Template';

  const UserView = new Marionette.ItemView({
    model : UserModel,
    template : UserTemplate,
    collection : UserCollection
  });

  const App = new Marionette.Application({
    regions: {
      general: GeneralRegion,
      users: UserRegion
    }
  });

  const Channel = Backbone.Wreqr.radio.channel('walkie-talkie');
  const Router = Marionette.AppRouter.extend({appRoutes: {'inventory': ''}});

  App.start();
})(window);
