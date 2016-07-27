'use strict';

import $ from 'jquery'

const IsMobile = /ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/i
                 .test(navigator.userAgent)

const Init = () => {
  MobileMenu()
  if (!IsMobile) {
    $('[data-toggle="tooltip"]').tooltip()
  }
}

const MobileMenu = () => {
  $('[data-menubar="menu"], #tools-bar>.mask').on('click', e => {
    if ($('#tools-bar').hasClass('online')) {
      $('#tools-bar').removeClass('online')
    }
    else {
      $('#tools-bar').addClass('online')
    }
  })
}

export default {
  Init,
  IsMobile
}
