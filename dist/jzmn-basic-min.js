var jzmn=function(n){"use strict"
if("undefined"!=typeof n)throw new TypeError("'jzmn' already defined.")
var r=Array.prototype,e=function(n){return void 0===n||null===n?[]:Array.isArray(n)?n:n.length?r.slice.call(n):[n]},t=function(n,r){var a=r||[]
return e(n).forEach(function(n,r){Array.isArray(n)?t(n,a):a.push(n)}),a},a=function(n,r){var e=Object.create(a.fn)
return e.els="function"==typeof r?r(n):a.parser(n),e.el=e.els[0],e}
a.fn={},a.parser=e,a.extendFn=function(n,r){var e=Object.assign({input:"individual",output:"wrapped"},r)
return Object.keys(n).forEach(function(r){a.fn[r]=function(){var u,i=arguments
switch(e.input){case"array":u=t(n[r].bind(null,this.els).apply(null,i)||this.els)
break
case"single":u=t(n[r].bind(null,this.el).apply(null,i)||this.els)
break
case"individual":default:u=t(this.els.map(function(e){var t=n[r].bind(null,e).apply(null,i)
return void 0!==t?t:e}))}return{wrapped:a(u),bare:u.length>1?u:u[0]}[e.output]}}),n},a.extendFactory=function(n,r,e){var t=n?a[n]||(a[n]={}):a
Object.keys(a.extendFn(r,e)).forEach(function(n,e){t[n]=r[n]})}
var u=function(n){return function(e,t,a){if(t){if(e.length||0===e.length)return r[n].call(e,t,a)
var u={}
return Object.keys(e)[n](function(n,r){var i=t.call(a||e,e[n],n,e)
return i&&(u[n]=i),i}),u}}}
return a.extendFn({at:function(n,r){return n[r]||[]}},{input:"array"}),a.extendFactory("util",{flatten:t,arrify:e,each:u("forEach"),map:u("map"),filter:u("filter"),reduce:function(n,e,t){return n.length||0===n.length?r.reduce.call(n,e,t):Object.keys(n).reduce(function(r,a,u){if(!u){if(!t)return n[a]
r=t}return e.call(n,r,n[a],a)},"")}},{input:"array"}),a}(jzmn)
