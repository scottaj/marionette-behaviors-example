describe("Grocery List App", function() {

	var saveSharedBehavior = function(context) {
		var view, model, inputSelector;

		beforeEach(function() {
			view = new context.ViewClass(context.viewArgs);
			model = view[context.modelProperty] || view.model;
			inputSelector = context.inputSelector;
		});

		it("saves", function() {
			view.render();
			var boundInput = view.$(inputSelector).first();
			var propertyName = boundInput.attr("name");
			boundInput.attr("value", "peanuts").change();
			view.trigger("save");
			
			expect(view.model.get(propertyName)).toBe("peanuts");
		});

	};

	describe("NewToBuyView", function() {
		var newToBuyView;

		beforeEach(function() {
			newToBuyView = new NewToBuyView();
		});

		describe("postAndClearModel", function() {
			it("resets its model", function() {
				newToBuyView.model.set("foo", "bar");

				newToBuyView.postAndClearModel();

				expect(newToBuyView.model.get("foo")).not.toBeDefined();
			});
		});
		describe("Save", function() {
			var context = {
				ViewClass: NewToBuyView,
				viewArgs: {},
				inputSelector: ".app-toBuy-field"
			};
			saveSharedBehavior(context);
		});
	});

	describe("ToBuyListView", function() {
		var toBuyListView;

		beforeEach(function() {
			toBuyListView = new ToBuyListView({collection: new ToBuyCollection()});
		});

		describe("addToCollection", function() {
			it("adds an element to the collection", function() {
				var initialCollectionSize = toBuyListView.collection.size();

				toBuyListView.addToCollection(new ToBuyModel());

				expect(toBuyListView.collection.size()).toBe(initialCollectionSize + 1);
			});
		});
		describe("Save", function() {
			var context = {
				ViewClass: ToBuyListView,
				viewArgs: {collection: new ToBuyCollection()},
				inputSelector: ".app-toBuy-field"
			};
			saveSharedBehavior(context);
		});
	});

});
