$(function() {

  var UserModel = Backbone.Model.extend({

    defaults: {
      id: null,
      name: "",
      surname: "",
      tel: "",
      activated: 0,
      roles: {
        admin: 0,
        developer: 0,
        manager: 0,
        tester: 0
      },
      sex: 1
    },

    localStorage: new Backbone.LocalStorage("UserCollection")

  });

  var UserCollection = Backbone.Collection.extend({

    model: UserModel,

    localStorage: new Backbone.LocalStorage("UserCollection")

  });

  var UserListItem = Bootstrap.ListItem.extend({

    tagName: 'li',

    className: 'user-list-item',

    template: _.template($("#template-user-item").html())

  });

  var UserList = Bootstrap.List.extend({

    el: $("#el-user-list"),

    item: UserListItem 

  });

  var UserModal = Bootstrap.Modal.extend({

    el: $("#el-modal-user"),

    bottons: function(e) {

      var toggle = this.$(e.currentTarget).data('toggle');
      var target = this.$(e.target),
        hidden = target.data('hidden');

      if (toggle === "buttons-checkbox") {
        value = (target.hasClass("active"))? 0 : 1;
      } else if (toggle === "buttons-radio") {
        value = target.val();
      }

      this.$(hidden).val(value);

      e.preventDefault(); 
    },

    initialize: function() {
      this.events["click .btn-group"] = "bottons";
    },

    template: _.template($("#template-modal-user").html())

  });

  var AppRouter = Backbone.Router.extend({
    
    routes: {
      "": "index",
      "!/addUser": "addUser",
      "!/editUser::id": "editUser",
      "!/removeUser::id": "removeUser"
    },

    initialize: function() {

      this.userCollection = new UserCollection();

      this.userList = new UserList({collection: this.userCollection});

      this.userList.fetch();

      this.userModal = new UserModal({collection: this.userCollection});

      this.userModal.on("close", this.index, this);

    },

    index: function() {
      this.navigate("!/");
    },

    addUser: function() {
      this.userModal.model = new this.userList.collection.model();
      this.userModal.render();
    },

    editUser: function(id) {
      this.userModal.model = this.userList.collection.get(id);
      this.userModal.render();
    },
  
    removeUser: function(id) {
      var userModel = this.userList.collection.get(id);
      userModel.destroy();
      this.index();
    }

  });

  var app = new AppRouter();

  Backbone.history.start();

});
