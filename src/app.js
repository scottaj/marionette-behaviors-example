// Setup application
var App = new Backbone.Marionette.Application({
	template: function(selector) {
		return function(data) {
			return _.template($(selector).html(), data);
		};
	}
});

App.addRegions({
	newToBuyRegion: "#new-toBuy-container",
	toBuyListRegion: "#toBuy-list-container"
});

var ToBuyModel = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage("to-buy"),

	defaults: {
		enabled: true,
		quantity: "1",
		unitPrice: "0.00"
	}
});

var ToBuyCollection = Backbone.Collection.extend({
	model: ToBuyModel,

	localStorage: new Backbone.LocalStorage("to-buy")
});

var SaveBehavior = Backbone.Marionette.Behavior.extend({
	defaults: {
		fieldSelector: ":input",
	},

	onSave: function() {
		var self = this;
		this.$(this.options.fieldSelector).each(function() {
			var $el = $(this);
			self.view.model.set($el.attr("name"), $el.val());
		});

		this.view.model.save();
	}
});

var NewToBuyView = Backbone.Marionette.ItemView.extend({
	tagName: "form",

	className: "new-item-toBuy",

	template: App.template("#new-toBuy-template"),

	model: new ToBuyModel(),

	ui: {
		saveButton: ".app-save-new-toBuy"
	},

	triggers: {
		"click @ui.saveButton": "save"
	},

	modelEvents: {
		sync: "postAndClearModel"
	},

	behaviors: {
		SaveBehavior: {
			behaviorClass: SaveBehavior,
			fieldSelector: ".app-toBuy-field"
		}
	},

	postAndClearModel: function() {
		App.vent.trigger("toBuy:created", this.model.toJSON());
		this.model.clear().set(this.model.defaults);
		this.render();
	}
});

var ToBuyView = Backbone.Marionette.ItemView.extend({
	template: App.template("#toBuy-template"),

	tagName: "li",

	className: "item-toBuy",

	ui: {
		dataFields: ".app-toBuy-field",
	},

	triggers: {
		"change @ui.dataFields": "save"
	},

	modelEvents: {
		sync: "render"
	},

	behaviors: {
		SaveBehavior: {
			behaviorClass: SaveBehavior,
			fieldSelector: ".app-toBuy-field"
		}
	}
});

var ToBuyListView = Backbone.Marionette.CollectionView.extend({
	tagName: 'ol',

	childView: ToBuyView,

	initialize: function() {
		this.listenTo(App.vent, "toBuy:created", this.addToCollection);
		this.collection.fetch();
	},

	addToCollection: function(newModel) {
		this.collection.push(newModel);
	}
});

App.on("start", function() {
	App.newToBuyRegion.show(new NewToBuyView());
	App.toBuyListRegion.show(new ToBuyListView({collection: new ToBuyCollection()}));
});

$(function() {
	App.start();
});