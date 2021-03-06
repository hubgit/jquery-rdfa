/* globals jQuery:false
 *
 * jQuery RDFa v0.1
 * https://github.com/hubgit/jquery-rdfa
 *
 * Copyright 2017 Alf Eaton
 * 
 * Released under the MIT license
 * http://git.macropus.org/mit-license/
 *
 * Date: 2017-12-30
 */
 (function($) {
 	'use strict';

	// get all items of a certain type
	$.fn.items = function(itemtype) {
		return this.find('[typeof]:not([property])').filter(function() {
			return !itemtype || attrs.call(this, 'typeof').get().indexOf(itemtype) !== -1;
		});
	};

	// all nodes with a certain property name
	$.fn.property = function(name) {
		return propertyNodes.apply(this).filter(function() {
			return attrs.call(this, 'property').get().indexOf(name) !== -1;
		});
	};

	// get/set the value of matched elements
	$.fn.value = function(value) {
		// get value
		if (typeof value === 'undefined') {
			return itemValue.call(this);
		}

		// set a single value
		itemValue.call(this, value);
	};

	// get all values of a property as an array
	$.fn.values = function(expanded) {
		return this.map(function() {
			var node = $(this);

			return node.is('[typeof]') ? metadata.call(node, expanded) : itemValue.call(node);
		}).get();
	};

	// convenience function for manipulating properties of an item
	$.fn.metadata = function(value) {
		switch (typeof value) {
			// get all values of an item
			case 'undefined':
			case 'boolean':
				return this.map(function() {
					return metadata.call($(this), value);
				}).get();

			// get/set a single property
			case 'string':
				if (arguments.length === 1) {
					// get a single property
					return this.property(value).value();
				}

				// set a single property
				this.property(value).value(arguments[1]);

				return this;

			// set the value of multiple properties
			case 'object':
				var nodes = this;

				$.each(value, function(name, value) {
					nodes.property(name).value(value);
				});

				return this;
		}
	};

	var ownerElement = function(node) {
		var owner = node;

		while (owner.parentNode && owner.parentNode.nodeType === 1) {
			owner = owner.parentNode;
		}

		return $(owner);
	};

	// all property nodes
	var propertyNodes = function() {
		if (!this.length) {
			return $([]);
		}

		var nodes = $(this);

		return nodes.find('[property]').not(nodes.find('[typeof] [property]'));
	};

	// get a space-separated attribute as an array
	var attrs = function(attribute) {
		return $(this).map(function() {
			return (this.getAttribute(attribute) || '').split(/\s+/);
		}).filter(function() {
			return this.length;
		});
	};

	// get or set the value of a node
	var itemValue = function(value) {
		var getting = value == null;

		if (this.is('[typeof]')) {
			if (!getting) {
				throw 'Not allowed to set the value of a typeof node';
			}

			return this;
		}

		if (!getting) {
			throw new Error('Sorry, setting values is not yet implemented.');
		}

		if (this.attr('resource')) {
			return $.trim(this.attr('resource'))
		}

		if (this.attr('content')) {
			return $.trim(this.attr('content'))
		}

		return $.trim(this.text());
	};

	// get all properties as a key/value(s) object
	var metadata = function(expanded) {
		if (this.length > 1) {
			return this.map(function() {
				return metadata.call($(this), expanded);
			}).get();
		}

		// the object always includes an typeof
		var data = {
			type: expanded ? attrs.call(this, 'typeof').get() : attrs.call(this, 'typeof').get(0)
		};

		propertyNodes.call(this).map(function() {
			var node = $(this);
			var property = node.value();

			if (property instanceof jQuery) {
				property = metadata.call(property, expanded);
			}

			attrs.call(this, 'property').each(function(index, name) {
				if (expanded) {
					if (typeof data[name] == 'undefined') {
						data[name] = [];
					}

					data[name].push(property);
				} else {
					if (typeof data[name] == 'undefined') {
						data[name] = property; // first item
					} else if ($.isArray(data[name])) {
						data[name].push(property); // more items
					} else {
						data[name] = [data[name], property];
					}
				}
			});
		});

		return data;
	};
}(jQuery));
