describe("Grocery List App", function() {

	var saveSharedBehavior = function(context) {
		var view, model;

		beforeEach(function() {
			view = new context.ViewClass(context.viewArgs);
			model = view[context.modelProperty] || view.model;
		});

		it("fails", function() {
			fail();
		});

	};

	describe("New To Buy View", function() {
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
				viewArgs: {}
			};
			saveSharedBehavior(context);
		});
	});

	describe("To Buy List View", function() {
		var toBuyListView;

		beforeEach(function() {
			toBuyListView = new ToBuyListView({collection: new ToBuyCollection()});
		});

		describe("addToCollection", function() {
			it("adds an element to the collection", function() {
				var initialCollectionSize = toBuyListView.collection.size();

				toBuyListView.addToCollection(new Backbone.Model());

				expect(toBuyListView.collection.size()).toBe(initialCollectionSize + 1);
			});
		});
		describe("Save", function() {
			var context = {
				ViewClass: ToBuyListView,
				viewArgs: {collection: new ToBuyCollection()}
			};
			saveSharedBehavior(context);
		});
	});

});
