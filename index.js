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
  var itemsKeys = Object.keys(this.items);
  console.log(itemsKeys);
  for (var i = 0; i < itemsKeys.length; i++) {
    html += this._renderItem(this.items[itemsKeys[i]]);
  }
  html += this.conf['nav_tag_close'];
  console.log(">>> END <<<")
  return html;
}

/**
 * Prepare menu items setting each item its children
 * @private
 */
Menu.prototype._prepareItems = function prepareItems(data, parent = null) {
  var items = {};
  for (var i = 0; i < data.length; i++) {
    if (data[i][this.conf['menu_parent']] == parent) {
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
 */
Menu.prototype._renderItem = function renderItem(data, prof = 0) {
  return this.conf['item_tag_open'] +
  '<a href="' + data['slug'] + '">' +
    '[icon = ' + data['icon'] + '] ' + data['name'] +
  '</a>' +
  this.conf['item_tag_close'];
}
