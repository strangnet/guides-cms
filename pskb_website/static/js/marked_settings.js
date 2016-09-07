function decodeUTF8(s) {
    var i, d = unescape(encodeURIComponent(s)), b = new Uint8Array(d.length);
    for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
    return b;
}

function hash(text) {
    var hasher = new BLAKE2s(16);
    hasher.update(decodeUTF8(text));
    return hasher.hexDigest();
}


var renderer = new marked.Renderer();

renderer.getUniqueKey = function(text) {
    var key = hash(text);
    var index = 1;
    if (key in marked.hashDB) {
        index = marked.hashDB[key] + 1;
    }
    marked.hashDB[key] = index;
    return key + index;
}

renderer.heading = function (text, level) {
    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    var key = this.getUniqueKey('heading' + level + escapedText);
    return '<h' + level + ' data-id="' + key + '" key="' + key + '"><a name="' + escapedText + '" class="anchor" href="#' + escapedText + '">' +
            '<svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>' + text + '</h' + level + '>';
};

renderer.paragraph = function(text) {
    var key = this.getUniqueKey('paragraph' + text);
    return '<p data-id="' + key + '" key="' + key + '">' + text + '</p>';
};

renderer.list = function(body, ordered) {
    var type = ordered ? 'ol' : 'ul';
    var key = this.getUniqueKey(type + body);
    return '<' + type + ' data-id="' + key + '" key="' + key + '">' + body + '</' + type + '>';
};

renderer.blockquote = function(quote) {
    var key = this.getUniqueKey('blockquote' + quote);
    return '<blockquote data-id="' + key + '" key="' + key + '">' + quote + '</blockquote>';
};

renderer.table = function(header, body) {
    var key = this.getUniqueKey('table' + header + body);

    return '<div class="table-responsive" data-id="' + key + '" key="' + key + '"><table class="table"><thead>'
        + header
        + '</thead>'
        + '<tbody>'
        + body
        + '</tbody></table></div>';
};

renderer.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += ' target="_blank">' + text + '&nbsp;<span class="glyphicon glyphicon-new-window" aria-hidden="true" style="font-size: 10px;"></span></a>';
  return out;
};

renderer.code = function(code, lang, escaped) {
    var key = this.getUniqueKey('pre' + code + lang);
    escaped = true;
    code = _.escape(code)

    if (!lang) {
        return '<pre data-id="' + key + '" key="' + key + '"><code>'
          + code
          + '\n</code></pre>';
    }

    return '<pre data-id="' + key + '" key="' + key + '"><code class="'
        + this.options.langPrefix
        + escape(lang, true)
        + '">'
        + code
        + '\n</code></pre>\n';
};

marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false, // false: supports real html (Useful to include embed videos)
    smartLists: true,
    smartypants: false,
    // Slow performance because the virtual dom, lets highlight later
    // highlight: function (code) {
    //   return hljs.highlightAuto(code).value
    // }
});
marked.hashDB = {};

function markdown2html(md) {
    marked.hashDB = {};
    return marked(md);
}
