module.exports = {
  // Array keys for items :
  'menu_id':              'id',
  'menu_order':           'order',
  'menu_label':           'label',
  'menu_link':            'link',
  'menu_parent':          'parent',
  'menu_flags':           'flags',
  'menu_icon':            'icon',
  'menu_icon_default':    'fa-circle-o',
  'menu_divider_label':   'divider',

  // Active item :
  'active_value':          'my/active/link',
  'active_recursive':     true,

  'menu_html_open':       '<ul>',
  'menu_html_close':      '</ul>',

  'menu_children_open':   '<ul>',
  'menu_children_close':  '</ul>',

  // Inner items configuration
  'item': {
    'html':       '<li{{parameters}}>'+
                  '<a href="{{menu_link}}">'+
                  '<i class="fa {{menu_icon}}"></i><span>{{menu_label}}</span>{{flags}}'+
                  '</a>'+
                  '{{children}}</li>\n',
    'parent':     [{'name': 'class', 'value': 'treeview'}],
    'active':     [{'name': 'class', 'value': 'active'}]
  },

  'flags': {
    'html':       '<span class="pull-right-container">{{flags}}</span>',
    'default':    '<small class="label pull-right {{class}}">{{content}}</small>',
    'parent':     '<i class="fa fa-angle-left pull-right"></i>',
  },

  'item_divider': '<li class="divider"></li>',
};
