/*jslint sloppy:true indent:2 plusplus:true regexp:true*/


/**
 * Dependancies.
 * @private
 */

var DEFAULT_CONF = require('./menu-config');

/**
 * Module exports.
 * @public
 */

module.exports = Menu;

/**
 * Menu generation class.
 * @public
 *
 * @param {object} [options]
 * @param {object} [options.items] Items to include in the menu
 * @param {object} [options.configuration] Configuration set for the menu
 */

function Menu (options) {
  if (!(this instanceof Menu)) {
    return new Menu(options);
  }

  var opts = options || {};

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

  this.items = items;
  this.conf = Object.assign({}, DEFAULT_CONF);

  for (let key in configuration) {
    this.conf[key] = configuration[key];
  }
}

/**
 * Add menu item.
 * @public
 *
 * @param {object} [items] Items to add in the menu
 */

Menu.prototype.addItems = function addItems (items) {
  if (typeof items === "object") {
    for (var i = 0; i < items.length; i++) {
      this.items.push(items[i]);
    }
  }
  return this;
}

/**
 * Add item flag.
 * @public
 *
 * @param {string} [itemId] Id of the target item
 * @param {string} [flagTag] Tag of the flag loop
 * @param {object} [flags] Flags to add to the item
 */

Menu.prototype.addFlags = function addFlags (itemId, flagTag, flags) {
  if (typeof flags === "object") {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i][this.conf['menu_id']] == itemId) {
        for (var j = 0; j < flags.length; j++) {
          if (typeof this.items[i][flagTag] !== 'object') {
            this.items[i][flagTag] = [];
          }
          this.items[i][flagTag].push(flags[j]);
        }
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
  let items = {};
  // Create parent / children tree
  for (let i = 0; i < data.length; i++) {
    if (data[i][this.conf['menu_parent']] == parent && data[i][this.conf['menu_id']] != parent) {
      let item = data[i];
      // Set children
      if (typeof item['children'] === "undefined") {
          item['children'] = this._prepareItems(
          data,
          data[i][this.conf['menu_id']]
        );
      }
      // Set active state
      if (item[this.conf['menu_link']] === this.conf['active_value']) {
        item['isactive'] = true;
      }
      if (this.conf['active_recursive']) {
        for (let key in item['children']) {
          if (item['children'][key]['isactive']) {
            item['isactive'] = true;
            break;
          }
        }
      }
      // Set parent state
      if (Object.keys(item['children']).length > 0) {
        item["isparent"] = true;
      }
      // Set child state
      if (parent !== null) {
        item["ischild"] = true;
      }
      items[data[i][this.conf['menu_order']]] = item;
    }
  }
  return items;
}

/**
 * Render the menu as HTML code.
 * @public
 */
Menu.prototype.render = function render () {
  var html = this.conf['menu_html_open'];
  this.items = this._prepareItems(this.items);
  for (var key in this.items) {
    html += this._renderItem(this.items[key]);
  }
  html += this.conf['menu_html_close'];
  return html;
}

/**
 * List tags contained in given string
 * @private
 *
 * @param {string} [html] Content to search tags in
 */
 Menu.prototype._listItemTags = function listItemTags(html) {
   let tags = [];
   if (typeof html === "string") {
     tags = html.match(/\{\{([a-z_]+)\}\}/gi);
     for (var i = 0; i < tags.length; i++) {
       tags[i] = tags[i].substring(2, tags[i].length - 2);
     }
   }
   return tags;
 }

/**
 * Render menu item with its children
 * @private
 *
 * @param {object} [item] Item to render
 * @param {integer} [depth] Depth in the parent/child three
 */
Menu.prototype._renderItem = function renderItem(item, tag = 'item', depth = 0) {
  console.log(item)
  if (item[this.conf['menu_label']] === this.conf['menu_divider_label']) {
    return this.conf['item_divider'];
  }
  let html = this.conf[tag]['html'];
  let states = ["active", "parent", "child"];
  let subtags = this._listItemTags(html);
  for (let i = 0; i < subtags.length; i++) {
    // Recursive call for sub html tags
    if (subtags[i].substr(0,4) === "item") {
      html = html.replace("{{" + subtags[i] + "}}", this._renderItem(item, subtags[i], depth));
    }
    // Display item given parameters, beginning with "menu_"
    else if (subtags[i].substr(0,4) === "menu") {
      if (typeof item[this.conf[subtags[i]]] === "string") {
        html = html.replace("{{" + subtags[i] + "}}", item[this.conf[subtags[i]]]);
      }
      else if (typeof this.conf[subtags[i] + '_default'] === "string") {
        html = html.replace("{{" + subtags[i] + "}}", this.conf[subtags[i] + '_default']);
      }
      else {
        html = html.replace("{{" + subtags[i] + "}}", "");
      }
    }
    // Display tag inherited parameters
    else if (subtags[i] === "parameters") {
      if (typeof item[tag] !== "object") item[tag] = [];
      for (let j = 0; j < states.length; j++) {
        if (item['is' + states[j]] && typeof this.conf[tag][states[j]] === "object") {
          item[tag] = item[tag].concat(this.conf[tag][states[j]]);
        }
      }
      if (typeof this.conf[tag]['default'] === "object") {
        item[tag] = item[tag].concat(this.conf[tag]['default']);
      }
      html = html.replace("{{" + subtags[i] + "}}", this._renderTagParameters(item[tag]));
    }
    else if (subtags[i] === "children") {
      let htmlChildren = "";
      if (Object.keys(item['children']).length > 0) {
        htmlChildren = this.conf['menu_children_open'];
        for (var child in item['children']) {
          htmlChildren += this._renderItem(item['children'][child], 'item', depth + 1);
        }
        htmlChildren += this.conf['menu_children_close'];
      }
      html = html.replace("{{" + subtags[i] + "}}", htmlChildren);
    }
    else if (subtags[i].substr(0,4) === "loop") {
      let tag = subtags[i].substr(5, subtags[i].length);
      let htmlFlags = "";
      for (let j = 0; j < states.length; j++) {
        if (item['is' + states[j]] && this.conf[tag][states[j]] !== undefined) {
          htmlFlags += this.conf[tag][states[j]];
        }
      }
      if (typeof item[tag] === "object") {
        let flagParameters = this._listItemTags(this.conf[tag]['default']);
        for (let j = 0; j < item[tag].length; j++) {
          let flagDefault = this.conf[tag]['default'];
          for (let k = 0; k < flagParameters.length; k++) {
            flagDefault = flagDefault.replace(
              "{{" + flagParameters[k] + "}}",
              item[tag][j][flagParameters[k]]
            );
          }
          htmlFlags += flagDefault;
        }
      }
      if (htmlFlags.length > 0) {
        html = html.replace(
          "{{" + subtags[i] + "}}",
          this.conf[tag]['html'].replace("{{" + tag + "}}", htmlFlags));
      }
      else {
        html = html.replace("{{" + subtags[i] + "}}", "");
      }
    }
  }
  return html;
}

/**
 * Render item tag with its given parameters
 * @private
 *
 * @param {string} [tag] HTML tag to add parameter in
 * @param {object} [parameters] Parameters to include
 */
Menu.prototype._renderTagParameters = function renderTagParameters(parameters) {
  let html = "";
  if (typeof parameters === "object") {
    // Merge parameters values if parameters names are equals
    let mergedParams = {};
    for (var i = 0; i < parameters.length; i++) {
      if (mergedParams[parameters[i]['name']] !== undefined) {
        mergedParams[parameters[i]['name']] += parameters[i]['value'];
      }
      else {
        mergedParams[parameters[i]['name']] = parameters[i]['value'] + ' ';
      }
    }
    // Render parameters HTML code
    for (let key in mergedParams) {
      if (mergedParams[key].length > 0) {
        html += ' ' + key + '="' + mergedParams[key].trim() + '"';
      }
    }
  }
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
