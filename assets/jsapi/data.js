'use strict';

export default [
  {
    name: 'index',
    key: 'post',
    pick: ['_id', 'titlename', 'content', 'tags', 'update_at'],
    start: 0,
    length: 10,
    find: { titlename: 'kBlog Express' }
  },
  {
    name: 'post',
    key: 'post',
    pick: ['_id', 'titlename', 'content', 'tags', 'update_at'],
    find: 'titlename~Node.js'
  }
]