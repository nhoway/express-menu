module.exports = {
  // Items array keys
  'menu_id':            'id',
  'menu_order':         'order',
  'menu_label':         'label',
  'menu_link':          'link',
  'menu_parent':        'parent',
  'menu_icon':          'icon',
  'menu_pins':          'pins',

  'default_menu_icon':  'fa-circle-o',

  // Inner items HTML tags
  'nav_tag_open':       '<ul>',
  'nav_tag_close':      '</ul>',

  'item_tag_open':      '<li{0}>',
  'item_tag_close':     '</li>',

  'item_link_open':     '<a{0}>',
  'item_link_close':    '</a>',

  'item_active_class':  'active',

  'item_html_icon':     '<i class="fa {0}"></i>',
  'item_html_label':    '<span>{0}</span>',

  'item_pin_open':      '<span class="pull-right-container">',
  'item_pin_child':     '<i class="fa fa-angle-left pull-right"></i>',
  'item_pin_html':      '<small class="label pull-right {1}">{0}</small>',
  'item_pin_close':     '</span>',

  'item_divider':       '<li class="divider"></li>',

  // Specific HTML tags for children
  'children_tag_open':  '<ul>',
  'children_tag_close': '</ul>'
};
