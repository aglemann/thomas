// extra transitions

thomas2.prototype.transitions = (function(){
  var returns = thomas2.prototype.transitions, 
    obj = { 'expo': function(p) { return Math.pow(2, 8 * (p - 1)) }, 'circ': function(p) { return 1 - Math.sin(Math.acos(p)) }};
  'quad cubic quart quint'.split(' ').forEach(function(name, i) {
    obj[name] = function(p) { return Math.pow(p, [i + 2]) }
  });              
  for (name in obj) {
    var fn = obj[name];
    returns[name + '-in'] = fn;
    returns[name + '-out'] = (function(fn) { return function(p) { return 1 - fn(1 - p) }})(fn);
    returns[name + '-in-out'] = (function(fn) { return function(p) { return (p <= 0.5) ? fn(2 * p) / 2 : (2 - fn(2 * (1 - p))) / 2 }})(fn);              
  }
  return returns;
})();
thomas3.prototype.transitions = { 
  'expo-in': '0.71,0.01,0.83,0', 'expo-out': '0.14,1,0.32,0.99', 'expo-in-out': '0.85,0,0.15,1', 'circ-in': '0.34,0,0.96,0.23', 'circ-out': '0,0.5,0.37,0.98', 'circ-in-out': '0.88,0.1,0.12,0.9', 'sine-in': '0.22,0.04,0.36,0', 'sine-out': '0.04,0,0.5,1', 'sine-in-out': '0.37,0.01,0.63,1', 'quad-in': '0.14,0.01,0.49,0', 'quad-out': '0.01,0,0.43,1', 'quad-in-out': '0.47,0.04,0.53,0.96', 'cubic-in': '0.35,0,0.65,0', 'cubic-out': '0.09,0.25,0.24,1', 'cubic-in-out': '0.66,0,0.34,1', 'quart-in': '0.69,0,0.76,0.17', 'quart-out': '0.26,0.96,0.44,1', 'quart-in-out': '0.76,0,0.24,1', 'quint-in': '0.64,0,0.78,0', 'quint-out': '0.22,1,0.35,1', 'quint-in-out': '0.9,0,0.1,1' 
};