'use strict';

let fs = require('fs');

module.exports = function(options) {
  let stat,
    content,
    filepath = options.path || null,
    onerror = options.error || function(message) { log(colors.red(message)); return `<!-- ${message} -->`; },
    onsuccess = options.success || function(content) { log(content); return true; },
    encoding = options.encoding || 'utf8',
    relative_filepath = filepath.replace(OUT_PATH, '');
  try {
    if (filepath === '' || filepath === null) {
      throw new Error('Invalid file path');
    }
    stat = fs.statSync(filepath);
    if (stat.isFile() === false) {
      throw new Error(`File "${filepath}" was not found`);
    } else {
      content = fs.readFileSync(filepath, encoding);
    }
  } catch (error) {
    return onerror.call(this, error.message, relative_filepath);
  }
  return onsuccess.call(this, content, relative_filepath);
};
