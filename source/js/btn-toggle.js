(function(global) {

  'use strict';

  var $ = global.$ || global.jQuery,
    el = null,
    toggles = null,
    cls = 'active';

  if (typeof $ == 'undefined') {
    return false;
  }

  $('#section-switch .btn').on('click', function($event) {
    $event.preventDefault();
    $('[data-section]').addClass('invisible');
    $('[data-section="'+$(this)
      .find('input:radio').val()+'"]')
      .removeClass('invisible');
  });

  $('[data-trigger="playback.play-pause"]').on('click', function($event) {
    $event.preventDefault();
    el = $(this).find('.fa');
    if (el.hasClass('fa-play')) {
      el.removeClass('fa-play').addClass('fa-pause');
    } else {
      el.removeClass('fa-pause').addClass('fa-play');
    }
  });

})(window);
