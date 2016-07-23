var jzmn=function(e){"use strict"
if("undefined"!=typeof e)throw new TypeError("'jzmn' already defined.")
var t=Array.prototype,n=function(e){return void 0===e||null===e?[]:Array.isArray(e)?e:e.length?t.slice.call(e):[e]},r=function(e,t){var o=t||[]
return n(e).forEach(function(e,t){Array.isArray(e)?r(e,o):o.push(e)}),o},o=function(e,t){var n=Object.create(o.fn)
return n.els="function"==typeof t?t(e):o.parser(e),n.el=n.els[0],n}
o.fn={},o.parser=n,o.extendFn=function(e,t){var n=Object.assign({input:"individual",output:"wrapped"},t)
return Object.keys(e).forEach(function(t){o.fn[t]=function(){var a,i=arguments
switch(n.input){case"array":a=r(e[t].bind(null,this.els).apply(null,i)||this.els)
break
case"single":a=r(e[t].bind(null,this.el).apply(null,i)||this.els)
break
case"individual":default:a=r(this.els.map(function(n){var r=e[t].bind(null,n).apply(null,i)
return void 0!==r?r:n}))}return{wrapped:o(a),bare:a.length>1?a:a[0]}[n.output]}}),e},o.extendFactory=function(e,t,n){var r=e?o[e]||(o[e]={}):o
Object.keys(o.extendFn(t,n)).forEach(function(e,n){r[e]=t[e]})}
var a=function(e){return function(n,r,o){if(r){if(n.length||0===n.length)return t[e].call(n,r,o)
var a={}
return Object.keys(n)[e](function(e,t){var i=r.call(o||n,n[e],e,n)
return i&&(a[e]=i),i}),a}}}
return o.extendFn({at:function(e,t){return e[t]||[]}},{input:"array"}),o.extendFactory("util",{flatten:r,arrify:n,each:a("forEach"),map:a("map"),filter:a("filter"),reduce:function(e,n,r){return e.length||0===e.length?t.reduce.call(e,n,r):Object.keys(e).reduce(function(t,o,a){if(!a){if(!r)return e[o]
t=r}return n.call(e,t,e[o],o)},"")}},{input:"array"}),o}(jzmn)
!function(e){"use strict"
function t(e){return"[object String]"===Object.prototype.toString.call(e)}if("undefined"==typeof e)throw new TypeError("'jzmn' undefined. Unable to set jzmn.parser for DOM parsing")
var n=Array.prototype,r=function(e){var t=Object.prototype.toString.call(e)
return"object"==typeof e&&/^\[object (HTMLCollection|NodeList|Object)\]$/.test(t)&&(0==e.length||"object"==typeof e[0]&&e[0].nodeType)}
e.el=document.querySelector.bind(document),e.els=document.querySelectorAll.bind(document),e.parser=function(e){return e?Array.isArray(e)?e:e.nodeType?[e]:r(e)?n.slice.call(e):t(e)?n.slice.call(document.querySelectorAll(e)):[e]:[]},e.extendFactory("dom",{attr:function(e,t,n){return void 0!==n?null===n?e.removeAttribute(t):e.setAttribute(t,n):e.getAttribute(t)},find:function(e,t){return Array.prototype.slice.apply(e.querySelectorAll(t))},ancestor:function(e,t){return t?e.closest(t):e.parentNode},html:function(e,t){return void 0===t?e.innerHTML:void(e.innerHTML=t)},on:function(e,t,n){e.addEventListener(t,n)}}),e.extendFn({attr:e.dom.attr},{output:"bare"})}(jzmn)
var jzmn=function(e){"use strict"
return e=e||{},e.ajax=function(e){var t=e.method||"GET",n=e.url||"/",r=e.success||function(){},o=e.error||function(){},a=e.data,i=e.params
if(i){var c=Object.keys(i).map(function(e){return""+encodeURIComponent(e)+"="+encodeURIComponent(i[e])}).join("&")
"GET"==t?(n+="?"+c,console.log(n)):(a=c,console.log(c))}var u=new XMLHttpRequest
u.open(t,n,!0),u.onload=function(){u.status>=200&&u.status<400?r(u.responseText):o()},u.onerror=o,u.send(a)},e}(jzmn)
!function(e){"use strict"
function t(n,r,o){var a=e.util.parseEls(n)
return Array.isArray(r)?(e.util.each(r,function(e){t(a,e,o)}),a):a.map(function(e,t){var n="[object Function]"==Object.prototype.toString.call(o)?o(e,r):o
if(!e.nodeType)throw new TypeError("Element is not a node")
return e.classList&&r.search(" ")<0?e.classList[n?"add":"remove"](r):e.className&&(e.className=n?e.className+=" "+r:e.className.replace(new RegExp("(^|\\b)"+r.split(" ").join("|")+"(\\b|$)","gi")," ")),e})}function n(t,n){var r=e.util.parseEls(t)[0]
if(!r)return!1
if(!r.nodeType)throw new TypeError("Element is not a node")
return r.classList?r.classList.contains(n):r.className.search(n)>-1}if("undefined"==typeof e)throw new TypeError("'jzmn' undefined. Unable to add methods for working with DOM element classes.")
e.extendFactory("dom",{hasClass:n},{output:"bare"}),e.extendFactory("dom",{changeClass:t,toggleClass:function(e,r){return t(e,r,function(e,t){return!n(e,t)})},removeClass:function(e,n){return t(e,n,!1)},addClass:function(e,n){return t(e,n,!0)}},{input:"array"})}(jzmn)
var jzmn=function(e){"use strict"
function t(e,n){n&&(n.nodeType?e.appendChild(n):n===n.toString()?e.innerHTML+=n:n.length&&Array.prototype.forEach.call(n,t.bind(null,e)))}e=e||{}
var n=/#(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/,r=/\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g,o=/[^.#][a-zA-Z]*/
return e.createEl=function(e,a,i){var c=e.match(o)[0],u=e.match(n),l=e.match(r),s=document.createElement(c)
return u&&s.setAttribute("id",u[1]),l&&s.setAttribute("class",l.join("").split(".").join(" ")),a&&Object.keys(a).forEach(function(e,t){var n=a[e]instanceof Array?a[e].join(" "):a[e]
s.setAttribute(e,n)}),t(s,i),s},e.extendFactory&&e.extendFactory("dom",{appendChildren:t,replaceChildren:function(e,n){e.innerHTML="",t(e,n)}}),e}(jzmn)
