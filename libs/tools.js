'use strict';

import _ from 'lodash'
import errcode from './error'
import moment from 'moment'
import markdown from './markdown'

moment.locale('zh-cn')

const [ran_len, ran_str] = [
 6,
 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'
]

function random () {
  let arg = _.zipObject(['len', 'char'], Array.prototype.slice.call(arguments))
  let str_num = typeof arg['len'] === 'number' ? arg['len'] : ran_len
  str_num = typeof arg['len'] === 'object' ? _.random(arg['len'][0], arg['len'][1]) : str_num
  let chars = typeof arg['len'] === 'string' ? arg['len'] : ran_str
  chars = typeof arg['char'] === 'string' && typeof arg['len'] !== 'string' ? arg['char'] : chars
  let str_arr = chars.split('')
  let r_num = str_arr.length
  let str = ''
  for (let i = 0; i < str_num; i++) {
    let pos = Math.floor(Math.random() * r_num)
    str += chars[pos]
  }
  return str
}

const format = (token) => {
  let dd = token.match(/([a-z0-9]{8})([a-z0-9]{4})([a-z0-9]{4})([a-z0-9]{4})([a-z0-9]{12,24})$/)
  dd.splice(0, 1)
  return _.join(dd, '-')
}

const error = (code) => {
  let [o, e] = [
    _.find(errcode, { code: code }),
    new Error()
  ]
  e.code = o.code
  e.message = o.message
  throw e
}

const myError = (e) => e.code > 1000

const firstImg = (str, type = 0) => {
  let urls = str.match(/\!\[([a-zA-Z0-9\u2E80-\u9FFF\-\_\s]*)\]\((((http|https:\/\/)|\/\/|\/|\.\/|\.\.\/)[^>]*?.(png|jpg|svg|gif))\)/g)
  if (!urls || urls.length === 0) {
    return null
  }
  if (type !== 0) {
    return urls[0]
  }
  let url = urls[0].match(/((http|https:\/\/)|\/\/|\/|\.\/|\.\.\/)[^>]*?.(png|jpg|svg|gif)/)
  return url[0]
}

const formatMd = (str, type) => {
  let reg = /^\#[\s{1,5}]([a-zA-Z0-9\u2E80-\u9FFF\-\_\;\.\s]*)/g
  let headers = str.match(reg)
  if (!headers) {
    str = '# 标题\n' + str
    headers = str.match(reg)
  }
  if (type === 'title') {
    return _.trim(headers[0].split('\n')[0].replace('#', ''))
  }
  if (type === 'note') {
    let md = markdown.render(str.replace(headers[0].split('\n')[0], '').replace(/^\n/g, ''))

    //console.log(/^\<blockquote\>/.test(md))
    let note = /^\<blockquote\>/.test(md) 
             ? md.split(/\<\/blockquote\>/i)[0].replace(/\<blockquote\>/i, '').replace(/^\n/g, '').replace(/\n$/g, '')
             : null
    if (note) {
      return '<blockquote>' + note + '</blockquote>'
    }
    headers = str.replace(firstImg(str, 1), '').match(reg)
    note = headers[0].replace(headers[0].split('\n')[0] + '\n', '').replace(/^\n/g, '').replace(/\n$/g, '')
    return '<blockquote>' + note + '</blockquote>'
    // blockquote

  }
  if (type === 'img') {
    return firstImg(str, 0)
  }
  if (type === 'content') {
    return str.replace(headers[0].split('\n')[0], '').replace(/^\n/g, '')
  }
}

const postInfo = (str, pick, opts) => {
  // ['titlename', 'content'] => 导入
  // ['_id', 'titlename', 'content', 'tags', 'update_at']
  opts = Object.assign({
    title: null,
    update_at: null
  }, opts)
  let item = {
    titlename: opts.title || formatMd(str, 'title'),
    tags: [],
    update_at: new Date(opts.update_at || null),
    content: formatMd(str, 'content')
  }
  if (pick && _.indexOf(pick, '_id') > -1) {
    item._id = '577e15efbace70d62ace52fd'
  }
  return _.pick(item, pick || ['titlename', 'content'])
}

const getMdList = () => {

  return ''
}

const moment_to = (date) => {
  return moment(date).fromNow()
}

const imageCrop = (originalImage, toSize) => {
  //
  let outImage = {}

  if (originalImage.width / originalImage.height > toSize.width / toSize.height ) {
    outImage.width = originalImage.height * toSize.width / toSize.height
    outImage.height = originalImage.height
    outImage.x = (originalImage.width - outImage.width) / 2
    outImage.y = 0
  }
  else {
    outImage.width = originalImage.width
    outImage.height = originalImage.width * toSize.height / toSize.width
    outImage.x = 0
    outImage.y = (originalImage.height - outImage.height) / 2
  }
  return outImage
}

const thumbnail = str => str.match(/([0-9a-zA-Z]+)\.+(jpg|png)$/i)[1].replace(/([0-9a-zA-Z]+)/i, 'thumb/$1.png')

export default {
  random,
  format,
  error,
  myError,
  firstImg,
  formatMd,
  moment_to,
  postInfo,
  imageCrop,
  thumbnail,
  getMdList
}