module.exports = {
  // Items array keys
  'menu_id':            'id',
  'menu_order':         'order',
  'menu_label':         'label',
  'menu_link':          'link',
  'menu_parent':        'parent',
  'menu_icon':          'icon',
  'menu_pins':          'pins',

  'menu_active_route': 'my/active/route',

  'default_menu_icon':  'fa-circle-o',

  // Inner items configuration
  'nav_tag_open':       '<ul>',
  'nav_tag_close':      '</ul>',

  'item_tag_open':      '<li{0}>',
  'item_tag_close':     '</li>',

  'item_active_class':  'active',

  'item_link_open':     '<a{0}>',
  'item_link_close':    '</a>',

  'item_html_icon':     '<i class="fa {0}"></i>',
  'item_html_label':    '<span>{0}</span>',

  'item_pin_open':      '<span class="pull-right-container">',
  'item_pin_child':     '<i class="fa fa-angle-left pull-right"></i>',
  'item_pin_html':      '<small class="label pull-right {1}">{0}</small>',
  'item_pin_close':     '</span>',

  'item_divider':       '<li class="divider"></li>',

  // Parent item configuration
  'parent_tag_parameters': [
    {'name': 'class', 'value': 'treeview'}
  ],

  // Child item configuration
  'children_tag_open':  '<ul>',
  'children_tag_close': '</ul>'
};
