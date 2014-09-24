(function() {

  var app = {};

  // Templates

  app.templates = {};

  app.templates.item = '<div class="product-code"><%= code %></div><div class="product-options"><%= options %></div><div class="product-qty"><span>Qty.</span><input class="update" type="text" value="<%= qty %>"/></div><div class="product-total"><%= total %></div><div class="product-delete"><a href="#" class="delete">Remove</a></div>';

  // Helpers
  app.helpers = {};
  app.helpers.vent = {};
  _.extend(app.helpers.vent, Backbone.Events);

  app.helpers.postForm = function(model) {
    var formData = model.get('formData');

    // Build form
    var params = _.map(formData, function(obj){
      obj.value = (obj.name == 'basketItems[0].quantity') ? model.get('qty') : obj.value;
      return obj.name + '=' + encodeURIComponent(obj.value);
    });

    // Set required additional editing fields
    var additional = [
      "basketItems[0].itemToProcess=true",
      "basketItems[0].editMode=true",
      "basketItems[0].basketItemId=" + model.get('basketItemId')
    ];
    params = params.concat(additional).join('&');

    // Send the call
    jQuery.ajax({
      url: model.get('formAction'),
      data: params,
      dataType: 'text',
      type: 'post',
      success: function() {
        updateMiniBasket(false, {
          itemId: model.get('itemId'),
          options: model.get('options'),
          attributes: model.get('attributes'),
          formData: model.get('formData'),
          formAction: model.get('formAction')
        }); // Function defined inside itemtemplate.vm
        toastr.success('Cart successfully updated!');
        model.trigger('finished');
      }, 
      error: function() {
        toastr.error("An internal error ocurred.  We couldn't update your cart.");
      }
    });
  };

  // Model
  app.model = Backbone.Model.extend({

    update: function(quantity) {
      if (parseInt(this.get('qty')) !== quantity) {
        // Make sure it is a valid number.
        if (quantity < 0) {
          toastr.error('Invalid quantity.  Must be a valid number');
          return false;
        }
        toastr.info('Updating cart...');
        this.set({qty: quantity});
        app.helpers.postForm(this, 'update');
      }
    },

    remove: function() {
      toastr.info('Removing item from cart...');
      this.set({qty: 0}, {silent: true});
      app.helpers.postForm(this);

      // Wait for confirmation to destroy model
      this.on('finished', function(){
        this.trigger('eliminated');
        this.destroy({
          "wait": false
        });
      }, this);
    }

  });
  // Collection
  app.collection = Backbone.Collection.extend({
    model: app.model,

    // External utilities
    formAttributes: function(container) {
      var result = [];
      // Find select
      var selected = jQuery(container).find('select option:selected').text();
      // Find text
      var texts = jQuery(container).find('input').val();
      var textareas = jQuery(container).find('textarea').val();
      return _.compact(result.concat(selected, texts, textareas));
    },

    processBasket: function(item, basket) {
      // Find items in basket that coincide with the recently added
      var itemId = parseInt(item.itemId);
      var basketItems = _.where(basket, {
        itemId: itemId
      });
      if (basketItems.length > 0) {
        var basketData = _.last(basketItems);
        var itemObj = {
          basketItemId: basketData.basketItemId,
          code: basketData.compCode.replace("-", '.'),
          qty: basketData.qty,
          total: '$' + basketData.totalPrice,
          itemId: itemId,
          attributes: item.attributes,
          vendorId: basketData.vendorId,
          formData: item.formData,
          formAction: item.formAction,
          options: item.options
        };
        this.checkCollection(itemObj);
      } else {
        // Do nothing.  Could not match item added with any in basket
      }
    },

    checkCollection: function(item) {
      var matches = this.where({
        basketItemId: item.basketItemId
      });
      if (matches.length == 0) {
        this.add(item);
      } else {
        matches[0].set(item);
      }
    }
  });

  // Views
  app.views = {};

  app.views.model = Backbone.View.extend({
    tagName: 'li',
    className: 'minibasket-item',
    template: app.templates.item,
    events: {
      "click .delete": "removeItem",
      "change .update": "updateItem"
    },

    initialize: function() {
      this._bindViewEvents();
    },

    render: function() {
      var parameters = this.model.toJSON();
      parameters.options = parameters.attributes.join(" ");
      var tmpl = _.template(this.template, parameters);
      return this.$el.html(tmpl);
    },

    removeItem: function(event) {
      event.preventDefault();
      this.model.remove();
    },

    updateItem: function(event) {
      event.preventDefault();
      this.model.update(parseInt(event.target.value));
      
    },

    _bindViewEvents: function() {
      this.model.on('change', function() {
        this.render();
      }, this);
      this.model.on('eliminated', function(){
        this._removeView();
      }, this);
    },

    _removeView: function() {
      this.$el.fadeOut("fast", function() {
        this.remove();
        app.helpers.vent.trigger('model-destroyed');
      });
    }
  });

  app.views.application = Backbone.View.extend({
    el: '#item-basket',

    initialize: function() {
      this.collection = new app.collection();
      // Bind collection changes
      this._bindViewEvents();
      this._showHide();
    },

    render: function() {
      _.each(this.collection, function(model) {
        this.renderItem(model);
      }, this);
    },

    renderItem: function(model) {
      var itemView = new app.views.model({
        model: model
      });
      this.$el.prepend(itemView.render());
      this._showHide();
    },

    _bindViewEvents: function() {
      this.collection.on('add', function(model) {
        this.renderItem(model);
      }, this);
      app.helpers.vent.on('model-destroyed', function(){
        this._showHide();
      }, this);
    },

    _showHide: function() {
      if (this.$el.find('li').length > 0) {
        this.$el.show();
      } else {
        this.$el.hide();
      }
    }

  });

  // Start minibasket application
  var Application = new app.views.application();

  // Any additions to the collection will automatically trigger the minibasket actions
  window.ItemBasket = Application.collection;

  return Application;

}).call(this);
