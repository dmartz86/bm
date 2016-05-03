function userConstructor(data) {
  this.attributes.name = data.name;
}

const User = Backbone.Model.extend({
  attributes: {
    name: '',
    age: 0
  },
  constructor: userConstructor
});

const daniel = new User({name: 'Daniel', age: 40});

