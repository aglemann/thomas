function thomas2(){
  // private properties

  var that = this, parseEl = document.createElement('div');
  
  parseEl.style.display = 'none';
  
  // protected properties

  this.props = 'backgroundColor borderBottomColor borderBottomWidth borderLeftColor borderLeftWidth borderRightColor borderRightWidth borderSpacing borderTopColor borderTopWidth bottom color fontSize fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop maxHeight maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft paddingRight paddingTop right textIndent top width wordSpacing zIndex'.split(' ');

  // private methods
  
  function s(str, p, c) { 
    return str.substr(p, c || 1); 
  }
  function comp(el) {
    var i = that.props.length, comp = {}, css = el.currentStyle ? el.currentStyle 
      : document.defaultView.getComputedStyle(el, null);
    while(i--) comp[that.props[i]] = css[that.props[i]];
    return comp;
  }
  function number(source, target, pos) { 
    return (source + (target - source) * pos).toFixed(3); 
  }
  function color(source, target, pos) {
    var i = 2, j, c, tmp, v = [], r = [];
    while(j = 3, c = arguments[i - 1], i--) {
      if (s(c, 0) == 'r') { 
        c = c.match(/\d+/g); 
        while(j--) v.push(~~c[j]); 
      } else {
        if (c.length == 4) c = '#' + s(c, 1) + s(c, 1) + s(c, 2) + s(c, 2) + s(c, 3) + s(c, 3);
        while(j--) v.push(parseInt(s(c, 1 + j * 2, 2), 16)); 
      }
    }
    while(j--) { 
      tmp = ~~(v[j + 3] + (v[j] - v[j + 3]) * pos); 
      r.push(tmp < 0 ? 0 : tmp > 255 ? 255 : tmp); 
    }
    return 'rgb(' + r.join(',') + ')';
  }
  function normalize(el, style) {
    var source = comp(el), target, v, prop, i = that.props.length, css = { source: {}, target: {}};
    if (style.indexOf(':') == -1) {
      style = style.replace(/\./g, ' ');
      var cn = el.className;
      el.className += ' ' + style;
      target = comp(el);
      el.className = cn;
    } else {
      parseEl.innerHTML = '<div style="' + style + '"></div>';
      document.body.appendChild(parseEl);
      target = comp(parseEl.firstChild);
      document.body.removeChild(parseEl);
    }
    while(i--) {
      prop = that.props[i];
      if (source[prop] != target[prop]) {
        var sourceVal = parse(prop, source[prop]), targetVal = parse(prop, target[prop]);
        if (sourceVal && targetVal) {
          css.source[prop] = sourceVal;
          css.target[prop] = targetVal;
        }
      }
    }
    return css;
  }
  function parse(prop, v) {
    try {
      var p = parseFloat(v), q = v.replace(/^[\-\d\.]+/,'');
    } catch(e) { return null; }
    return prop.match(/color/i) ? { v: q, interpolate: color, u: ''} 
      : isNaN(p) ? null 
      : { v: p, interpolate: number, u: q };
  }

  // protected methods

  this.after = function(el) {
    el.animated = null;
    if (el.after) {
      try { el.after(); }
      catch(e) { throw e; };
      el.after = null;
    }
    if (el.queue && el.queue.length)
      thomas.apply(that, el.queue.pop());
  }
  this.animate = function(el, css, dur, easing) {
    var start = +new Date, finish = start + dur;
    el.interval = setInterval(function(){
      var time = +new Date, pos = time > finish ? 1 : (time - start) / dur;
      for (prop in css.source)
        el.style[prop] = css.source[prop].interpolate(css.source[prop].v, css.target[prop].v, easing(pos)) + css.source[prop].u;
      if (time > finish) { 
        clearInterval(el.interval);
        that.after(el);
      }
    }, 10);
  }
  this.timing = function(ease) {
    return thomas2.prototype.transitions[ease] || ease;
  }
    
  // public methods  
    
  return function(el, style, opts) {
    opts = (typeof opts == 'function') ? { after: opts } : opts || {};
    var link = opts.link || 'cancel', dur = opts.duration || 200, easing = that.timing(opts.easing || 'ease-in-out');
    if (el.animated) {
      if (link == 'ignore')
        return;
      if (link == 'chain') {
        if (!el.queue) el.queue = [];
        return el.queue.push([el, style, opts]);
      }
    }
    el.animated = true;
    el.after = opts.after;      
    var css = normalize(el, style);
    that.animate(el, css, dur, easing);
  }
}
thomas2.prototype.transitions = { 
  'linear': function(p) { return p }, 'ease-in': function(p) { return -Math.cos(p * (Math.PI/2)) + 1; }, 'ease-out': function(p) { return Math.sin(p * (Math.PI/2)); }, 'ease-in-out': function(p) { return (-.5 * (Math.cos(Math.PI*p) -1)); } 
};

function thomas3(){
  // private properties

  var that = this, returns = thomas2.call(this);
  
  // protected properties

  'BackgroundSize BorderTopLeftRadius BorderTopRightRadius BorderBottomLeftRadius BorderBottomRightRadius BoxShadow TextFillColor TextStrokeColor TransformOriginX TransformOriginY TransformOriginZ'.split(' ').forEach(function(prop){
    that.props.push('webkit' + prop);
  });
  
  document.addEventListener('webkitTransitionEnd', function(e) {
    if (el = e.target || e.srcElement)
      that.after(el);
  });
  
  // protected methods

  this.animate = function(el, css, dur, easing) {
    var properties = [], sourceText = targetText = '', property;
    for (prop in css.target) {
      property = prop.replace(/[A-Z]/g, function(match) { return '-' + match.charAt(0).toLowerCase(); });
      if (property.match(/^webkit/)) 
        property = '-' + property;
      properties.push(property + ' ' + dur + 'ms ' + easing);
      sourceText += ';' + property + ':' + css.source[prop].v + css.source[prop].u;
      targetText += ';' + property + ':' + css.target[prop].v + css.target[prop].u;
    }
    el.style.webkitTransitionDuration = '';
    el.style.cssText += sourceText;
    setTimeout(function() {
      el.style.webkitTransition = properties.join(',');
      el.style.cssText += targetText;
    }, 0.01);      
  }
  this.timing = function(ease) {
    var fn = thomas3.prototype.transitions[ease];
    return (typeof ease == 'function') ? 'ease' : fn ? 'cubic-bezier(' + fn + ')' : ease;
  }

  // public methods  

  return returns;
}
thomas3.prototype.transitions = {};

window.thomas = !window.WebKitCSSMatrix ? new thomas2 : new thomas3;