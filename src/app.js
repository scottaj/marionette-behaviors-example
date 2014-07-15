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

var NewToBuyView = Backbone.Marionette.ItemView.extend({
	tagName: "form",

	template: App.template("#new-toBuy-template"),

	model: new ToBuyModel(),

	ui: {
		dataFields: ".app-toBuy-field",
		saveButton: ".app-save-new-toBuy"
	},

	events: {
		"click @ui.saveButton": "save"
	},

	modelEvents: {
		sync: "postAndClearModel"
	},

	save: function() {
		var self = this;
		this.ui.dataFields.each(function() {
			var $el = $(this);
			self.model.set($el.attr("name"), $el.val());
		});

		this.model.save();
	},

	postAndClearModel: function() {
		App.vent.trigger("toBuy:created", this.model.toJSON());
		this.model.clear().set(this.model.defaults);
	}
});

var ToBuyView = Backbone.Marionette.ItemView.extend({
	template: App.template("#toBuy-template"),

	ui: {
		dataFields: ".app-toBuy-field",
	},

	events: {
		"change @ui.dataFields": "save"
	},

	modelEvents: {
		sync: "render"
	},

	save: function() {
		var self = this;
		this.ui.dataFields.each(function() {
			var $el = $(this);
			self.model.set($el.attr("name"), $el.val());
		});

		this.model.save();
	},
});

var ToBuyListView = Backbone.Marionette.CollectionView.extend({
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