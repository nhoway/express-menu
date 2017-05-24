/*jslint sloppy:true indent:2 plusplus:true regexp:true*/

/**
 * Module exports.
 * @public
 */

module.exports = Menu;

/**
 * Menu generation class.
 *
 * @param {object} [options]
 * @param {object} [options.items] Items to include in the menu
 * @param {object} [options.configuration] Configuration set for the menu
 * @public
 */

function Menu (options) {
  if (!(this instanceof Menu)) {
    return new Menu(options);
  }

  var opts = options || {}

  var items = opts.items !== undefined
    ? opts.items
    : [];

  if (typeof items !== 'object') {
    throw new TypeError('option items must be an object');
  }

  var configuration = opts.configuration !== undefined
    ? opts.configuration
    : [];

  if (typeof configuration !== 'object') {
    throw new TypeError('option configuration must be an object');
  }

  this.items = items
  this.conf = require('./menu-config');

  for (var key in configuration) {
    this.conf[key] = configuration[key];
  }
}

/**
 * Render the menu as HTML code.
 * @public
 */

Menu.prototype.render = function render () {
  var html = this.conf['nav_tag_open'];
  this.items = this._prepareItems(this.items);
  for (var key in this.items) {
    html += this._renderItem(this.items[key]);
  }
  html += this.conf['nav_tag_close'];
  return html;
}

/**
 * Add menu item.
 * @public
 *
 * @param {object} [items] Items to add in the menu
 */

Menu.prototype.addItems = function addItems (items) {
  var itemsToAdd = items !== undefined
    ? items
    : [];
  for (var i = 0; i < itemsToAdd.length; i++) {
    this.items.push(itemsToAdd[i]);
  }
  return this;
}

/**
 * Add item pin.
 * @public
 *
 * @param {string} [itemId] Id of the target item
 * @param {object} [pins] Pins to add to the item
 */

Menu.prototype.addPins = function addPins (itemId, pins) {
  var pinsToAdd = pins !== undefined
    ? pins
    : [];
  for (var i = 0; i < this.items.length; i++) {
    if (this.items[i][this.conf['menu_id']] == itemId) {
      for (var j = 0; j < pinsToAdd.length; j++) {
        if (typeof this.items[i][this.conf['menu_pins']] !== 'object') {
          this.items[i][this.conf['menu_pins']] = [];
        }
        this.items[i][this.conf['menu_pins']].push(pinsToAdd[j]);
      }
    }
  }
  return this;
}

/**
 * Prepare menu items setting each item its children
 * @private
 *
 * @param {object} [data] Items to add to parent
 * @param {integer} [parent] Id of the parent
 */
Menu.prototype._prepareItems = function prepareItems(data, parent = null) {
  var items = {};
  for (var i = 0; i < data.length; i++) {
    if (data[i][this.conf['menu_parent']] == parent && data[i][this.conf['menu_id']] != parent) {
      items[data[i][this.conf['menu_order']]] = data[i];
      items[data[i][this.conf['menu_order']]]['children'] = this._prepareItems(
        data,
        data[i][this.conf['menu_id']]
      );
    }
  }
  return items;
}

/**
 * Render menu item with its children
 * @private
 *
 * @param {object} [data] Items to render
 * @param {integer} [depth] Depth in the parent/child three
 */
Menu.prototype._renderItem = function renderItem(data, depth = 0) {
  let html = this._renderTagParameters(this.conf['item_tag_open'], data['item_tag']);

  if (data[this.conf['menu_link']] !== undefined) {
    let href = {"name": "href", "value": data[this.conf['menu_link']]};
    if (data['item_link'] !== undefined) {
      data['item_link'].push(href);
    }
    else {
      data['item_link'] = [href];
    }
  }

  html += this._renderTagParameters(this.conf['item_link_open'], data['item_link']);

  if (data[this.conf['menu_icon']] !== undefined) {
    html += String.format(
      this.conf['item_html_icon'],
      data[this.conf['menu_icon']]
    );
  }
  else {
    html += String.format(
      this.conf['item_html_icon'],
      this.conf['default_menu_icon']
    );
  }

  if (data[this.conf['menu_label']] !== undefined) {
    html += String.format(
      this.conf['item_html_label'],
      data[this.conf['menu_label']]
    );
  }

  if (typeof data[this.conf['menu_pins']] === 'object' || Object.keys(data['children']).length > 0) {
    html += this.conf['item_pin_open'];
    if (Object.keys(data['children']).length > 0) {
      html += this.conf['item_pin_child'];
    }
    if (typeof data[this.conf['menu_pins']] === 'object') {
      for (let i = data[this.conf['menu_pins']].length - 1; i >= 0; i--) {
        html += String.format(
          this.conf['item_pin_html'],
          data[this.conf['menu_pins']][i]['content'],
          data[this.conf['menu_pins']][i]['class']
        );
      }
    }
    html += this.conf['item_pin_close'];
  }

  html += this.conf['item_link_close'];

  if (Object.keys(data['children']).length > 0) {
    html += this.conf['children_tag_open'];
    for (var child in data['children']) {
      html += this._renderItem(data['children'][child], depth + 1);
    }
    html += this.conf['children_tag_close'];
  }

  html += this.conf['item_tag_close'];
  return html;
}

/**
 * Render item tag with its given parameters
 * @private
 *
 * @param {string} [tag] HTML tag to add parameter in
 * @param {object} [parameters] Parameters to include
 */
Menu.prototype._renderTagParameters = function renderTagParameters(tag, parameters) {
  if (tag.indexOf("{0}") >= 0) {
    let paramsToAdd = parameters !== undefined
      ? parameters
      : [];
    // Merge parameters values if parameters names are equals
    let mergedParams = {};
    for (var i = 0; i < paramsToAdd.length; i++) {
      if (mergedParams[paramsToAdd[i]['name']] !== undefined) {
        mergedParams[paramsToAdd[i]['name']] += paramsToAdd[i]['value'];
      }
      else {
        mergedParams[paramsToAdd[i]['name']] = paramsToAdd[i]['value'] + ' ';
      }
    }
    // Complete parameters already contained in the tag string from mergedParams
    for (let key in mergedParams) {
      let pos = tag.indexOf(key + "=");
      if (pos >= 0) {
        tag = tag.substr(0, pos + key.length + 2) + mergedParams[key] +
        tag.substr(pos + key.length + 2, tag.length);
        mergedParams[key] = "";
      }
    }
    // Add the others parameters to the tag string
    let html = "";
    for (let key in mergedParams) {
      if (mergedParams[key].length > 0) {
        html += ' ' + key + '="' + mergedParams[key] + '"';
      }
    }
    return String.format(tag, html);
  }
  else {
    return tag;
  }
}

/**
 * Adding String Format Method
 *
 */

if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
