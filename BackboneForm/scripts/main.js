(function(){



  //*** Models ***//

  var Post = Backbone.Model.extend({
    idAttribute: 'objectId',
    defaults: {
      title: '',
      body: ''
    }
  });

  var PostCollection = Backbone.Collection.extend({
    model: Post,
    url: "https://api.parse.com/1/classes/Post"
  });




  //*** Views ***//

  var IndexView = Backbone.View.extend({
    tagName: 'form',
    template: _.template($('#index-template').text()),

  events: {
    'click button': 'submit'
  },

  submit: function(event){
    event.preventDefault();
    var title = $('input').val();
    var body = $('textarea').val();
    console.log(title, body);

    this.collection.create({ title: title, body: body });
  },

  render: function(){
    $('#app-container').append(this.el);
    this.$el.html(this.template(this.model));
    return this;
  }


});


  //*** Routers ***//

  var AppRouter = Backbone.Router.extend({
    routes: {
        '': 'index'
  },

    initialize: function() {
      this.postCollection = new PostCollection();
      this.indexView = new IndexView({collection: this.postCollection});
  },

    index: function() {
    $('.app-container').append(this.indexView.el);
    this.indexView.render();
    console.log('router is running');
  }
 });




  //*** LET'S DO THIS ***//

  $.ajaxSetup ({
    headers: {
      "X-Parse-Application-Id": "0uHNWFo3Q4CXCqzGuWPswuqVKstT3pFf5md1svrI",
      "X-Parse-REST-API-Key": "8jkuEiJaU8aLl86fYTbLUH60p0nUiCRniduRb33o"
    }
  });


  $(document).ready(function(){
    window.router = new AppRouter();
    Backbone.history.start();
    });



})();
