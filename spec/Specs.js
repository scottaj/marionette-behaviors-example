describe("Grocery List App", function() {

	var saveSharedBehavior = function(context) {
		var view, model, inputSelector;

		beforeEach(function() {
			view = new context.ViewClass(context.viewArgs);
			model = view[context.modelProperty] || view.model;
			inputSelector = context.inputSelector;
		});

		it("saves", function() {
			debugger
			view.render();
			var boundInput = view.$(inputSelector).first();
			var propertyName = boundInput.attr("name");
			boundInput.val("peanuts");
			
			var spy = sinon.spy();
			view.model.on("change:" + propertyName, spy);
			
			view.triggerMethod("save");
			
			expect(spy).toHaveBeenCalledWith(sinon.match.any, "peanuts", sinon.match.any);
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
	
	describe("ToBuyView", function() {
		var toBuyView;
		var getViewArgs = function() {
			return {model: new ToBuyModel()};
		};

		beforeEach(function() {
			toBuyView = new ToBuyView(getViewArgs());
		});

		describe("Save", function() {
			var context = {
				ViewClass: ToBuyView,
				viewArgs: getViewArgs(),
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
	});
});
