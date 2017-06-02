module.exports = {
  // Menu array keys
  'menu_id':            'id',
  'menu_order':         'order',
  'menu_label':         'label',
  'menu_link':          'link',
  'menu_parent':        'parent',
  'menu_flags':         'flags',
  'menu_icon':          'icon',

  'menu_icon_default':  'fa-circle-o',
  'menu_active_class':  'active',
  //'menu_active_link':   'my/active/link',

  // Inner items configuration
  'nav_tag_open':       '<ul>',
  'nav_tag_close':      '</ul>',

  // TODO : bind first tag
  //'item_tag_open':      '<li>',
  'item_tag_open':      '<li{0}>',
  'item_tag_close':     '</li>',

  // TODO : bind first tag
  //'item_link_open':     '<a>',
  'item_link_open':     '<a{0}>',
  'item_link_close':    '</a>',

  'item_html_icon':     '<i class="fa {0}"></i>',
  'item_html_label':    '<span>{0}</span>',

  'item_flag_open':     '<span class="pull-right-container">',
  'item_flag_child':    '<i class="fa fa-angle-left pull-right"></i>',
  'item_flag_html':     '<small class="label pull-right {1}">{0}</small>',
  'item_flag_close':    '</span>',

  'item_divider':       '<li class="divider"></li>',

  // Parent item configuration
  'parent_tag_parameters': [
    {'name': 'class', 'value': 'treeview'}
  ],

  // Child item configuration
  'children_tag_open':  '<ul>',
  'children_tag_close': '</ul>'
};