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
  //this.conf = configuration
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
    this.items.append(itemsToAdd[i]);
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
  var html = this.conf['item_tag_open'];
  html += '<a href="' + data[this.conf['menu_link']] + '">';

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
      for (var i = data[this.conf['menu_pins']].length - 1; i >= 0; i--) {
        html += String.format(
          this.conf['item_pin_html'],
          data[this.conf['menu_pins']][i]['content'],
          data[this.conf['menu_pins']][i]['class']
        );
      }
    }
    html += this.conf['item_pin_close'];
  }

  html += '</a>';

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
