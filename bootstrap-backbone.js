
  var Bootstrap = {};

  Bootstrap.Modal = Backbone.View.extend({

    events: {
      "click .modal-close": "close",
      "click .save": "save",
      "keypress input" : "onEnter"
    },

    close: function() {
      this.$(".modal").hide();
      this.trigger("close");
    },

    serialize: function() {
      //this.data = this.$('form').serializeArray();
      this.data = {
        'name': this.$("[name=name]").val(),
        'surname': this.$("[name=surname]").val(),
        'tel': this.$("[name=tel]").val()
      }
    },

    save: function() {

      this.serialize();

      var isNew = this.model.isNew();

      this.model.save(this.data, {
        "wait": true
      });

      if (isNew) {
        this.collection.add(this.model);
      }

      this.close();
    },

    onEnter: function (e) {
      if (e.keyCode != 13) return; 
      this.save();
    },

    render: function(model) {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }

  });

  Bootstrap.List = Backbone.View.extend({

    initialize: function() {
      this.collection.on("add", this.addOne, this);
      this.collection.on("reset", this.render, this);
    },

    events: {
      "click .refresh-list": "refresh"
    },

    refresh: function() {
      this.clear();
      this.fetch();
    },

    clear: function() {
      _.each(this.collection.models, function(model) {
        model.trigger("clear");
      }, this);
    },

    addOne: function(model) {
      this.$el.append(new this.item({model: model}).render().el);
    },

    render: function() {
      _.each(this.collection.models, function(model) {
        this.addOne(model);
      }, this);
    },

    fetch: function() {
      this.collection.fetch({data: this.collection.data});
    }

  });

  Bootstrap.ListItem = Backbone.View.extend({

    initialize: function() {
      this.model.on("change", this.render, this);
      this.model.on("clear", this.clear, this);
      this.model.on("destroy", this.clear, this);
    },

    clear: function() {
      this.$el.remove();
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }

  });

  Bootstrap.Button = Backbone.View.extend({


  });


  Bootstrap.Router = Backbone.Router.extend({

    routes: {
      "": "index"
    },

    index: function() {
      this.navigate("!/");
    }

  });
