(function() {
  window.App = window.App || {};



  //********* Models & Collections *********//

  var Post = Backbone.Model.extend({
    idAttribute: "_id",

    defaults: function(attributes) {
      attributes = attributes || {};
      return _.defaults(attributes, {
        title: '',
        body: '',
        timestamp: (new Date()).toString()
      });
    }
  });


  var PostsCollection = Backbone.Collection.extend({
    url: 'http://tiny-pizza-server.herokuapp.com/collections/dudes',
    model: Post
  });





  //********* Views *********//


  var PostItemView = Backbone.View.extend({
    tagName: 'li',
    className: 'js-post-item',
    template: _.template($('#post-template').text()),

    events: {
      'click .js-delete': 'destroyPost',
      'click .js-edit': 'editPostTitle',
      'click': 'viewPost'
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    },

    destroyPost: function() {
      this.model.destroy();
    },

    editPostTitle: function() {
      var editable = this.$('.js-title').attr('contenteditable') == 'true';
      if (editable) {
        this.$('.js-title').attr('contenteditable', 'false');
        this.model.set('title', this.$('.js-title').text());
        this.model.save();
      } else {
        this.$('.js-body').attr('contenteditable', 'true');
      }
    },

    viewPost: function(event){
      event.preventDefault();
      console.log(this.model);
      router.navigate('post/' + this.model.id, {
        trigger:true
      });
    }
  });



  var PostsListView = Backbone.View.extend({
    el: '.js-posts-list',

    initialize: function(){
      this.listenTo(this.collection, 'sync', this.render);
    },

    render: function(){
      var self = this;
      this.$el.empty();

      this.collection.each(function(post){
        var postView = new PostItemView({model: post});
        postView.render();
        self.$el.prepend(postView.el);
      });

      return this;
    }
  });




  var NewPostView = Backbone.View.extend({
    collection: PostsCollection,
    tagName: 'input'
  });



  var PostDetailView = Backbone.View.extend({
    el: 'article',
    template: _.template($('#details-template').text()),

    initialize: function() {
      this.listenTo(this.model, 'sync', this.render);
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }

  });




  //********* Router *********//

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'post/:id': 'post'
    },

    initialize: function() {
      this.posts = new PostsCollection();
      this.post = new Post();
      this.postItemView = new PostItemView({model: this.post});
      this.postsListView = new PostsListView({collection: this.posts});
      this.postDetailView = new PostDetailView({model: this.post});
      console.log('router is going going going');

    },

    index: function() {
      this.posts.fetch();
      console.log('router index too');
    },

    post: function() {
      this.postDetailView.render();
    }
  });





  //******** Start Your Engines! *********//

  $(document).ready(function() {
    window.router = new AppRouter();
    Backbone.history.start();
  });




})();
