/* jQuery nerdTime - Jay Wineinger <jay.wineinger@nerdery.com>
 * v1.0 - 2011-05-04 - compressed at http://yui.2clics.net */
(function(f){var b=Number.NEGATIVE_INFINITY;var c=Number.POSITIVE_INFINITY;var a="data-timestamp";f.fn.nerdTime=function(o){var n=new Date().getTime();var p;var q;if((typeof o=="object")||(o==undefined)){f.fn.nerdTime.c_settings=f.extend({},f.fn.nerdTime.settings,o);f.fn.nerdTime.the_selected=this;this.each(function(){q=f(this);p=k(q);var s=i(n-p);var r=d(q);q.html(j(r,s))});f.fn.nerdTime.start_nerdiness()}return this};f.nerdTime=function(o,r){var n=new Date().getTime();var q;var s;var p=null;if(typeof o=="object"){f.fn.nerdTime.c_settings=f.extend({},f.fn.nerdTime.settings,o)}if(typeof o=="string"){p=o}else{if(typeof r=="string"){p=r}}if(p!=null){q=m(p);if(!isNaN(q)){return i(n-q)}else{return"INVALID_DATETIME_FORMAT"}}return this};f.fn.nerdTime.settings={refresh:-1,units:{year:{plural:"years",in_seconds:60*60*24*365,include_smaller:{allowed_units:["week","day"],max_units:1,}},week:{plural:"weeks",in_seconds:60*60*24*7,include_smaller:{allowed_units:["day","hour"],max_units:1,}},day:{plural:"days",in_seconds:60*60*24,include_smaller:{allowed_units:["hour"],max_units:1,}},hour:{plural:"hours",in_seconds:60*60,include_smaller:{allowed_units:["minute"],max_units:1,}},minute:{plural:"minutes",in_seconds:60,},second:{plural:"seconds",in_seconds:1,},}};f.fn.nerdTime.start_nerdiness=function(){var n=f.fn.nerdTime.c_settings.refresh;if(f.fn.nerdTime.process_tracker==null){if(n>0){f.fn.nerdTime.process_tracker=setInterval("$.fn.nerdTime.update_nerdiness()",n)}}else{}return this};f.fn.nerdTime.update_nerdiness=function(){var n=new Date().getTime();var p;var o;f.fn.nerdTime.the_selected.each(function(){p=f(this);o=k(p);var r=i(n-o);var q=d(p);p.html(j(q,r))})};f.fn.nerdTime.stop_nerdiness=function(){if(f.fn.nerdTime.process_tracker!=null){clearInterval(f.fn.nerdTime.process_tracker);f.fn.nerdTime.process_tracker=null}else{}return this};function i(q){q=Math.round(q/1000);var n=f.fn.nerdTime.c_settings.units;var o=[];var r=q<0;var p=Math.abs(q);process_unit=function(v,s,u){var t=Math.floor(p/s.in_seconds);if(t>0){p%=s.in_seconds;if(t==1){o.push(t+" "+v)}else{o.push(t+" "+s.plural)}if(!u&&"include_smaller" in s&&s.include_smaller.allowed_units){var w=s.include_smaller.max_units;jQuery.each(s.include_smaller.allowed_units,function(x,z){if(w>0){var y=process_unit(z,n[z],true);if(y===false){w-=1}}})}return false}return true};jQuery.each(n,process_unit);if(o.length>0){nerd_time_str=o.join(", ");if(r){o="in "+nerd_time_str}else{o=nerd_time_str+" ago"}}else{o="right now"}return o}function m(o){var n;if((new_date=g(o))!=null){n=new_date.valueOf()}else{n=(new Date(o)).valueOf();if(isNaN(n)){n=new Date(o.replace(/-/g," "))}}return n}function g(r){var n=r.match(/^(\d{4})((-(\d{2})(-(\d{2})(T(\d{2}):(\d{2})(:(\d{2})(.(\d+))?)?(Z|(([+-])((\d{2}):(\d{2})))))?)?)?)$/);if(n!=null){var o=new Date();var q=0;var p=0;o.setUTCFullYear(n[1]);if(!e(n[4])){o.setUTCMonth(n[4]-1);if(!e(n[6])){o.setUTCDate(n[6]);if(!e(n[16])){q=n[18];p=n[19];if(n[16]=="-"){q*=-1;p*=-1}}if(!e(n[8])){o.setUTCHours(n[8]-q);o.setUTCMinutes(n[9]-p);if(!e(n[11])){o.setUTCSeconds(n[11]);if(!e(n[13])){o.setUTCMilliseconds(n[13]*1000)}}}}}return o}else{return null}}function e(n){if(null==n||""==n){return true}return false}function k(p){var o=Number.NaN;var n=d(p);if(n!=null){o=m(n)}if(isNaN(o)){n=h(p);if(n!=null){o=m(n)}}if(isNaN(o)){n=new Date().toString();o=m(n)}l(n,p);return o}function d(o){var n=o.attr(a);if(n!=undefined){return n}else{return null}}function l(n,o){o.attr(a,n)}function h(n){return n.text()}function j(o,n){return"<ABBR TITLE='"+o+"'>"+n+"</ABBR>"}})(jQuery);
