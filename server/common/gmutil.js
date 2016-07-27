'use strict';

import gm from 'gm'
import Promise from 'bluebird'
import path from 'path'
import { existsSync, mkdirSync } from 'fs'
import tools from '../../libs/tools'

const imageMagick = gm.subClass({ imageMagick : true })

const thumbnail = (original, opts, callback) => {
  let gmProxy = Promise.promisifyAll(imageMagick(original))
  let _path = opts.path || 'public'
  if (!existsSync(path.join(process.cwd(), _path))) {
    mkdirSync(path.join(process.cwd(), _path))
  }
  if (!existsSync(path.join(process.cwd(), _path, 'thumb'))) {
    mkdirSync(path.join(process.cwd(), _path, 'thumb'))
  }
  gmProxy.sizeAsync()
  .then( (value, e) => {
    let crop = tools.imageCrop(value, { width: opts.width, height: opts.height })
    return gmProxy.crop(crop.width, crop.height, crop.x, crop.y)
                  .resize(opts.width, opts.height)
                  .writeAsync(path.join(process.cwd(), _path, tools.thumbnail(original)))
  })
  .then( () => callback(null) )
  .catch( err => callback(err) )
}

export default {
  thumbnail
}