'use strict';

import $ from 'jquery'

const IsMobile = /ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/i
                 .test(navigator.userAgent)

const Init = () => {
  if (!IsMobile) {
    $('[data-toggle="tooltip"]').tooltip()
  }
}

export default {
  Init,
  IsMobile
}
