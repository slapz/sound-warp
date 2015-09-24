'use strict';

var utils = require(__dirname + '/utils'),
  playlistTrackKeysMap = Object.create(null),
  playlistTrackKeys = [];

utils.extend(playlistTrackKeysMap, {
  '_id': 'id',
  '_created_at': 'created_at',
  '_user_id': 'user_id',
  '_user': 'user',
  '_title': 'title',
  '_permalink': 'permalink',
  '_permalink_url': 'permalink_url',
  '_uri': 'uri',
  '_sharing': 'sharing',
  '_embeddable_by': 'embeddable_by',
  '_purchase_url': 'purchase_url',
  '_artwork_url': 'artwork_url',
  '_description': 'description',
  '_label': 'label',
  '_label_id': 'label_id',
  '_label_name': 'label_name',
  '_duration': 'duration',
  '_genre': 'genre',
  '_tag_list': 'tag_list',
  '_release': 'release',
  '_release_day': 'release_day',
  '_release_month': 'release_month',
  '_release_year': 'release_year',
  '_streamable': 'streamable',
  '_downloadable': 'downloadable',
  '_state': 'state',
  '_license': 'license',
  '_track_type': 'track_type',
  '_waveform_url': 'waveform_url',
  '_download_url': 'download_url',
  '_stream_url': 'stream_url',
  '_video_url': 'video_url',
  '_bpm': 'bpm',
  '_commentable': 'commentable',
  '_isrc': 'isrc',
  '_key_signature': 'key_signature',
  '_comment_count': 'comment_count',
  '_download_count': 'download_count',
  '_playback_count': 'playback_count',
  '_favoritings_count': 'favoritings_count',
  '_original_format': 'original_format',
  '_original_content_size': 'original_content_size',
  '_created_with': 'created_with',
  '_asset_data': 'asset_data',
  '_artwork_data': 'artwork_data',
  '_user_favorite': 'user_favorite'
});

playlistTrackKeys = Object.keys(playlistTrackKeysMap);

function PlaylistTrack(track) {
  /* Load track data */
  this.load(track);
}

var _getter = function(key) {
    return function() {
      return this[key];
    };
  },
  _setter = function(key) {
    return function(value) {
      this[key] = value;
      return this;
    };
  },
  _getMethodName = function(prefix, key) {
    var name = key.replace(/^([A-Z])|[\s-_](\w)/g, function(match, $_1, $_2) {
      if ($_2) return $_2.toUpperCase();
      return $_1.toLowerCase();
    });

    return prefix + name.substring(0,1).toUpperCase() + name.substring(1);
  };

playlistTrackKeys.forEach(function(key) {
  PlaylistTrack.prototype[_getMethodName('get', key)] = _getter(key);
  PlaylistTrack.prototype[_getMethodName('set', key)] = _setter(key);
});

PlaylistTrack.prototype.load = function(track) {
  var index = null,
    _this = this;
  playlistTrackKeys.forEach(function(key) {
    index = playlistTrackKeysMap[key];

    if (utils.hasProp(track, index)) {
      _this[key] = track[index];
    }
  });

  return this;
};

PlaylistTrack.ARTWORK_500 = 't500x500';
PlaylistTrack.ARTWORK_400 = 'crop',
PlaylistTrack.ARTWORK_300 = 't300x300';
PlaylistTrack.ARTWORK_100 = 'large';
PlaylistTrack.ARTWORK_67 = 't67x67';
PlaylistTrack.ARTWORK_47 = 'badge';
PlaylistTrack.ARTWORK_32 = 'small';
PlaylistTrack.ARTWORK_20 = 'tiny';
PlaylistTrack.ARTWORK_16 = 'mini';

PlaylistTrack.prototype.getArtwork = function(size) {
  return (this._artwork_url || '').replace(PlaylistTrack.ARTWORK_100, size);
};

PlaylistTrack.prototype.getFullTitle = function() {
  var user = this.getUser().full_name || this.getUser().username;
  return (user + ' – ' || '') + this.getTitle();
};

PlaylistTrack.prototype.isStreamable = function() {
  return this._streamable;
};

module.exports.PlaylistTrack = PlaylistTrack;

function Playlist(tracks) {
  tracks = tracks || [];

  Object.defineProperty(this, '_tracks', {
    configurable: false,
    enumerable: false,
    writable: true,
    value: []
  });

  Object.defineProperty(this, '_current', {
    configurable: false,
    enumerable: false,
    writable: true,
    value: 0
  });

  this.reset();
  this.setTracks(tracks);
}

Playlist.prototype.reset = function() {
  this._tracks = [];
  return this;
};

Playlist.prototype.getTracks = function(offset, limit) {
  limit = limit || 0;
  offset = offset || 0;

  if (limit > 0) {
    return this._tracks.slice(offset, offset + limit);
  } else if (offset > 0 && limit === 0) {
    return this._tracks.slice(offset);
  }
  return this._tracks;
};

Playlist.prototype.setTracks = function(tracks, clear) {
  var _this = this;

  clear = clear || false;
  if (clear) {
    _this._tracks = [];
  }

  tracks.forEach(function(track) {
    _this._tracks.push(track);
  });

  return _this;
};

Playlist.prototype.addTrack = function(track, clear) {
  return this.setTracks([track], clear);
};

Playlist.prototype.getCurrentIndex = function() {
  return this._current;
};

Playlist.prototype.setCurrentIndex = function(value) {
  value = value + 0;

  if (value > this._tracks.length || value < 0) {
    throw new Error('Index out of range!');
  }

  this._current = value;
};

Playlist.prototype.getNextIndex = function() {
  var value = this.getCurrentIndex() + 1;

  if (value > (this._tracks.length - 1)) {
    value = 0;
  }

  return value;
};

Playlist.prototype.getPreviousIndex = function() {
  var value = this.getCurrentIndex() - 1;

  if (value < 0) {
    value = this._tracks.length - 1;
  }

  return value;
};

Playlist.prototype.getCurrent = function() {
  var track = null,
    index = this.getCurrentIndex();

  if (index !== null && this._tracks[index]) {
    track = this._tracks[index];
  }

  return track;
};

Playlist.prototype.getNext = function() {
  var track = null,
    index = this.getNextIndex();

  if (index !== null && this._tracks[index]) {
    track = this._tracks[index];
  }

  return track;
};

Playlist.prototype.getPrevious = function() {
  var track = null,
    index = this.getPreviousIndex();

  if (index !== null && this._tracks[index]) {
    track = this._tracks[index];
  }

  return track;
};

Playlist.prototype.render = function($el, offset, limit) {
  var _this = this,
    column = null,
    columns = {
      'Artwork': function(track) {
        var src = track.getArtwork(PlaylistTrack.ARTWORK_67);
        if (src.length > 0) {
          return '<img src="' + src + '" class="artwork" />';
        }
        return '<div class="artwork">?</div>';
      },
      'Title': function(track) {
        return track.getFullTitle();
      },
      'Duration': function(track) {
        return app.player.displayTime(app.player.convertTime(track.getDuration() / 1000));
      }
    },
    rendered = '<table class="table table-sm playlist">';
  rendered += '<thead><tr>';
  Object.keys(columns).forEach(function(title) {
    rendered += '<th>' + title + '</th>';
  });
  rendered += '</tr></thead>';
  rendered += '<tbody>';
  Object.keys(_this.getTracks(offset, limit)).forEach(function(index) {
    rendered += '<tr data-track-id="' + _this._tracks[index].getId() + '">';
    Object.keys(columns).forEach(function(column_key) {
      column = columns[column_key];
      rendered += '<td>' + column(_this._tracks[index]) + '</td>';
    });
    rendered += '</tr>';
  });
  rendered += '</tbody>';
  rendered += '</table>';

  $el.html(rendered);
  return $el;
};

Playlist.prototype.play = function() {
  var _this = this,
    current = null,
    nextIndex = null;

  if (app.player.isPlaying()) {
    app.player.pause();
    return true;
  } else if (app.player.audio.currentTime > 0) {
    app.player.play();
    return true;
  }

  if (_this._tracks.length > 0) {
    current = _this.getCurrent();

    if (current) {
      app.player.load(current);

      app.player.on('loadeddata', function($event) {
        app.player.controls.playPause.removeAttr('disabled');
      });

      app.player.on('play', function() {
        app.player.controls.playPause.find('.fa').removeClass('fa-play').addClass('fa-pause');

        if (_this.getCurrentIndex() > 0) {
          app.player.controls.previous.removeAttr('disabled');
        }
      });

      app.player.on('pause', function() {
        app.player.controls.playPause.find('.fa').removeClass('fa-pause').addClass('fa-play');
      });

      app.player.on('ended', function() {
        app.player.controls.playPause.find('.fa').removeClass('fa-pause').addClass('fa-play');

        app.player.stop();
        _this.next();
        _this.play();
      });

      $('[data-track-id].now-playing').removeClass('now-playing');
      app.player.play();
      $('[data-track-id="' + current.getId() + '"]').addClass('now-playing');
    } else {
      throw new Error('Could not play the playlist!');
    }

    return true;
  }

  throw new Error('Playlist was not loaded!');
};

Playlist.prototype.setCurrentTrack = function(trackId) {
  var _this = this,
    index = -1,
    tracks = _this._tracks;

  tracks.forEach(function(_track, _index) {
    if (_track.getId() === trackId) {
      index = _index;
    }
  });

  if (index === -1) {
    return false;
  }

  _this.setCurrentIndex(index);

  return true;
};

Playlist.prototype.previous = function() {
  var _this = this,
    previous = _this.getPrevious();
  if (previous !== null) {
    _this.setCurrentTrack(previous.getId());
  }
  return _this;
};

Playlist.prototype.next = function() {
  var _this = this,
    next = _this.getNext();
  if (next !== null) {
    _this.setCurrentTrack(next.getId());
  }
  return _this;
};

module.exports.Playlist = Playlist;
