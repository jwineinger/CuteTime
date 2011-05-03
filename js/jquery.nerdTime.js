/**
 * jQuery.nerdTime
 *
 * @author Jay Wineinger <jay.wineinger@nerdery.com>
 * @date 2011-05-03
	DESCRIPTION

		It's nerdTime!

		nerdTime is a customizable jQuery plugin that automatically converts timestamps	to 
		formats much nerdier.  Also has the ability to dynamically re-update and/or 
		automatically update timestamps on a controlled interval.

		If used by Selector, replaces the text of the provided object with a nerdTime.
		If used as a function, returns a string containing a nerdTime version of the provided 
		timestamp.

		BY DEFAULT
		automatic updating is disabled and the following nerdTimes can be displayed...

				the future!
				just now
				a few seconds ago
				a minute ago
			x	minutes ago
				an hour ago
			x	hours ago
				yesterday
			x	days ago
				last month
			x	months ago
				last year
			x	years ago

	IMPLEMENTATION

		$('.timestamp').nerdTime();
		$('.timestamp').nerdTime({ / * OPTIONS * / });
		
		nerdtime_object = $('.timestamp').nerdTime();
		nerdtime_object.update_nerdiness();

		$.nerdTime('2009/10/12 22:11:19');
		$.nerdTime({ / * OPTIONS * / }, '2009/10/12 22:11:19');

	COMPATIBILITY

		Tested in FF3.5, IE7
		With jQuery 1.3.2

	METHODS

		When initialized the nerdTime variable either updates or assigns the TS_ATTR
		attribute to the provided objects.  Method implementation supports chaining and 
		returns jQuery object.  

			e.g.
				<div class='timestamp' data-timestamp='2009 10 12 22:11:19'>2009 10 12 22:11:19</div>				
		
		If the nerdtime attribute already exists within the provided object, then the
		text within the object is ignored in the cutification process.  If the nerdtime attribute 
		does not exist or an invalid one is provided, then a valid nerdtime attribute is assigned
		to the object.

		If the nerdtime attribute is missing, then it is calculated from the text of the 
		provided object.
		
		If neither nerdtime attibute nor valid object text exist then the timestamp is assumed 
		to by 'now'.

		stop_nerdiness()
			stops all automatic updates of refresh enabled timestamps

		start_nerdiness()
			starts the automatic updating of timestamps
			REMINDER: make sure refresh is set to > 0

		update_nerdiness()
			updates timestamps of the provided objects

	FUNCTIONS

		nerdTime(<STRING>)

	CUSTOMIZATION

		nerdTime(OPTIONS)
		e.g. $('.ts2').nerdTime({ refresh: 60000 });
		
		refresh:		time in milliseconds before next refresh of page data; -1 == no refresh
		time_ranges:	array of bound_structures definining the nerd descriptions associated with
						time ranges

		bound_structures consist of the following variables
			bound:		lower inclusive bound, or starting point, for using the 'nerdiness' string 
						for describing the current timestamp

						the exclusive upper bound is defined by the next bound definition in the 
						time_ranges array

			nerdiness:	string to use in place of the current timestamp
						
						the special keyword %CT% can be used within the nerdtime string to 
						override the prepending of the calculated difference, when called for
						
							e.g. "it was %CT% hours ago"   
			
			unit_size:	the divisor to apply to the calculated time difference; if unit_size != 0
						then a number value is prepended to the nerdiness string as calculated by
						time_difference / unit_size
							e.g. 4 hours ago
						
						if unit_size = 0, then no number is pre-pended to the nerdiness string
							e.g. an hour ago

		EXAMPLE	OPTIONS = 
			{	refresh: -1,
				time_ranges: [
					{bound: NEG_INF,
							nerdiness: 'the future!',		unit_size: 0},
					{bound: 0, 
							nerdiness: 'just now',			unit_size: 0},
					{bound: 60 * 1000, 
							nerdiness: 'a minute ago',		unit_size: 0},
					{bound: 60 * 1000 * 2, 
							nerdiness: ' minutes ago',		unit_size: 60 * 1000},
					{bound: 60 * 1000 * 60, 
							nerdiness: 'an hour ago',		unit_size: 0},
					{bound: 60 * 1000 * 60 * 2, 
							nerdiness: ' hours ago',			unit_size: 60 * 1000 * 60},
					{bound: POS_INF, 
							nerdiness: 'a blinkle ago',		unit_size: 0}
				]
			};


	VALID TIMESTAMP FORMAT EXAMPLES

		2009-10-15 14:06:23											*doesn't work in IE
		Thu Oct 15 2009 22:11:19 GMT-0400 (Eastern Daylight Time
		Oct 15 2009 22:11:19
		2009 10 12 22:11:19											* only works in FF
		10 15 2009 22:11:19											* only works in FF

		ALL ISO8601 Date/Time Formats Also Supported
		2009-11-24T19:20:30+01:00
		2009-11
		2009-11-24T13:15:30Z
		...etc...
		
		* if the TIMESTAMP can be recognized by the JavaScript Date() Object then it is VALID 
		  (i.e. if it can be parsed by Date.parse())
		** IE date parsing is VERY DIFFERENT (and more limiting) than FF :-(  [not nerd!]

	MORE

		For more usage and examples, go to:
		http://tpgblog.com/nerdtime/

******************************************************************************************************/

(function($) {
	// CONSTANTS
	var NEG_INF = Number.NEGATIVE_INFINITY;
	var POS_INF = Number.POSITIVE_INFINITY;
	var TS_ATTR	= 'data-timestamp';

	/**********************************************************************************

		FUNCTION
			nerdTime

		DESCRIPTION
			nerdTime method constructor
			
			allows for customization of refreh rate the time difference ranges and 
			nerd descriptions
			
				e.g. $(something).nerdTime();

	**********************************************************************************/
	$.fn.nerdTime = function(options) {
		var right_now = new Date().getTime();
		var other_time;
		var curr_this;

		// check for new & valid options
		if ((typeof options == 'object') || (options == undefined)) {
			// then update the settings [destructive]
			$.fn.nerdTime.c_settings = $.extend({}, $.fn.nerdTime.settings, options);
			$.fn.nerdTime.the_selected = this;

			// process all provided objects
			this.each(function() {
				// element-specific code here
				curr_this = $(this);
				other_time = get_time_value(curr_this);
				curr_this.html(get_nerdiness(right_now - other_time));
			});

			// check for and conditionally launch the automatic refreshing of timestamps
			$.fn.nerdTime.start_nerdiness();
		}
		
		return this;
	};

	/**********************************************************************************

		FUNCTION
			nerdTime

		DESCRIPTION
			nerdTime function
			
			accepts a string representation of a timestamp as its parameter and 
			returns a string version of its equivalent nerdtime
			
				e.g. $.nerdTime('2009 10 12 22:11:19');
				
				or
				
				e.g. $.nerdTime(SETTINGS, '2009 10 12 22:11:19');

			can be customized by directly accessing the settings:
				$.fn.nerdTime.settings = ...

	**********************************************************************************/
	$.nerdTime = function(options, val) {
		var right_now = new Date().getTime();
		var other_time;
		var curr_this;
		var ts_string = null;

		if (typeof options == 'object') {
			$.fn.nerdTime.c_settings = $.extend({}, $.fn.nerdTime.settings, options);
		} 

		if (typeof options == 'string') {
			ts_string = options;
		} else if (typeof val == 'string') {
			ts_string = val;	
		}
	
		if (ts_string != null) {
			// then we will be returning a nerdtime string and doing nothing else
			other_time = date_value(ts_string);
			if (!isNaN(other_time)) {
				return get_nerdiness(right_now - other_time);
			} else {
				// on failure return error message
				return 'INVALID_DATETIME_FORMAT';
			}
		}

		return this;
	};


	/**********************************************************************************

		FUNCTION
			nerdTime.settings

		DESCRIPTION
			data stucture containing the refresh rate and time range specifications
			for the nerdTimes
			
			can be directly accessed by	'$.fn.nerdTime.settings = ... ;'

	**********************************************************************************/
	$.fn.nerdTime.settings = {
        // time in milliseconds before next refresh of page data; -1 == no refresh
		refresh: -1,

        // the time units to decomopose a given number of seconds into. they
        // will be attempted in the order defined here, so make sure any
        // overrides are descending 
		units: {
            year: {
                plural: 'years',
                in_seconds: 60 * 60 * 24 * 365,
                include_smaller: ['week']
            },
            week: {
                plural: 'weeks',
                in_seconds: 60 * 60 * 24 * 7,
                include_smaller: ['day']
            },
            day: {
                plural: 'days',
                in_seconds: 60 * 60 * 24,
                include_smaller: ['hour']
            },
            hour: {
                plural: 'hours',
                in_seconds: 60 * 60,
                include_smaller: ['minute']
            },
            minute: {
                plural: 'minutes',
                in_seconds: 60,
                include_smaller: []
            },
            second: {
                plural: 'seconds',
                in_seconds: 1,
                include_smaller: []
            },
        }
	};


	/**********************************************************************************

		FUNCTION
			nerdTime.start_nerdiness

		DESCRIPTION
			activates the recurring process to update the objects' timestamps

			IMPORTANT: make sure refresh has been set to > 0

		TODO
			allow for the specifying of a new refresh rate when this function is called

	**********************************************************************************/
	$.fn.nerdTime.start_nerdiness = function() {
		var refresh_rate = $.fn.nerdTime.c_settings.refresh;

		if ($.fn.nerdTime.process_tracker == null) {
			if (refresh_rate > 0) {
				$.fn.nerdTime.process_tracker = setInterval( "$.fn.nerdTime.update_nerdiness()", refresh_rate );
			}
		} else { 
			// ignore this call; auto-refresh is already running!!
		}
		return this;
	};


 	/**********************************************************************************

		FUNCTION
			nerdTime.update_nerdiness

		DESCRIPTION
			updates the objects' timestamps

	**********************************************************************************/
	$.fn.nerdTime.update_nerdiness = function() {
		var right_now = new Date().getTime();
		var curr_this;
		var other_time;

		$.fn.nerdTime.the_selected.each(function() {
			curr_this = $(this);
			other_time = get_time_value(curr_this);
			curr_this.html(get_nerdiness(right_now - other_time));
		});
	}


	/**********************************************************************************

		FUNCTION
			nerdTime.stop_nerdiness

		DESCRIPTION
			deactivates the recurring process that updates the objects' timestamps

	**********************************************************************************/
	$.fn.nerdTime.stop_nerdiness = function() {
		if ($.fn.nerdTime.process_tracker != null) {
			clearInterval($.fn.nerdTime.process_tracker);
			$.fn.nerdTime.process_tracker = null;
		} else {
			// ignore this call; there is nothing to stop!!
		}
		
		return this;
	};


	//////////////////////////////////////////////////////////////////////////////////

	// private functions and settings

	/**********************************************************************************

		FUNCTION
			get_nerdiness

		DESCRIPTION
			based on passed in time_difference (in milliseconds) returns a string
			of the associated nerdiness
			
			if a number should be insterted into the string (unit_size not empty)
				THEN
					if %CT% exists within the nerdiness STRING 
						THEN replace it with the calculated number
						ELSE prepend the calculated number to the front of the string
						     (mostly for backwards compatibility) 

			ON ERROR returns time in 'pookies'

	**********************************************************************************/
	function get_nerdiness(time_difference) {
        // convert to seconds
        time_difference = Math.round(time_difference / 1000);

		var units = $.fn.nerdTime.c_settings.units;
		var nerd_time = [];

        var is_future = time_difference < 0;
        var total_remaining = Math.abs(time_difference)

        process_unit = function(unit_name, config) {
            var text = [];
            var divides = Math.floor(total_remaining / config.in_seconds);

            if (divides > 0) {
                total_remaining %= config.in_seconds;
                if (divides == 1) {
                    text.unshift(divides + ' ' + unit_name);
                } else {
                    text.unshift(divides + ' ' + config.plural);
                }

                if (config.include_smaller) {
                    jQuery.each(config.include_smaller, function(idx, unit_name) {
                        process_unit(unit_name, units[unit_name]);
                    });
                }
                nerd_time = text;
                return false;
            }
        };

		jQuery.each(units, process_unit);

        nerd_time_str = nerd_time.join(', ');
        if (is_future) {
            nerd_time = "in " + nerd_time_str;
        } else {
            nerd_time = nerd_time_str + " ago";
        }

		return nerd_time;
	}


	/**********************************************************************************

		FUNCTION
			date_value

		DESCRIPTION
			returns the date in time measured since 1970 (see definition of Date.valueOf)

			if not ISO 8601 date format compliant, performs minimal date correction 
			to expand the range of VALID date formats

	**********************************************************************************/
	function date_value(the_date) {
	
		var the_value;
	
		if ((new_date = toISO8601(the_date)) != null) {
			the_value = new_date.valueOf();
		} else {
		
			the_value = (new Date(the_date)).valueOf();
			
			if (isNaN(the_value)) {
				// then the date must be the alternate db styled format
				the_value = new Date(the_date.replace(/-/g, " "));
			}
		}
		return the_value;
	}


	/**********************************************************************************

		FUNCTION
			toISO8601

		DESCRIPTION
			converts an ISO8601 formatted timestamp to the JavaScript Date() Object
			if the provided string is not in ISO8601 format, then null is returned

			** Note to people who copy this function:  If you like it, if you use it,
			please provide credit to Jeremy Horn, The Product Guy @ http://tpgblog.com
			and the jQuery nerdTime Plugin @ http://tpgblog.com/nerdtime;  Thanks. :-)

			ISO8601
			http://www.w3.org/TR/NOTE-datetime
			  
				Year:
				  YYYY (eg 1997)
				Year and month:
				  YYYY-MM (eg 1997-07)
				Complete date:
				  YYYY-MM-DD (eg 1997-07-16)
				Complete date plus hours and minutes:
				  YYYY-MM-DDThh:mmTZD (eg 1997-07-16T19:20+01:00)
				Complete date plus hours, minutes and seconds:
				  YYYY-MM-DDThh:mm:ssTZD (eg 1997-07-16T19:20:30+01:00)
				Complete date plus hours, minutes, seconds and a decimal fraction of a second
				  YYYY-MM-DDThh:mm:ss.sTZD (eg 1997-07-16T19:20:30.45+01:00)
			
			  	Formatted REGEXP used within...
			  	
					/^(\d{4})(
					    (-(\d{2})
					        (-(\d{2})
					            (T(\d{2}):(\d{2})
					                (:(\d{2})
					                    (.(\d+))?
					                )?
					                (Z|(
					                    ([+-])((\d{2}):(\d{2}))
					                ))
					            )?
					        )?
					    )?
					)$/
					
		NOTE
			String.match() returns:
				in FireFox, 			void(0) 
				in Internet Explorer, 	"" <-- empty string
			... for unmatched elements within the array
			
	**********************************************************************************/
	function toISO8601(the_date){
	
		var iso_date = the_date.match(/^(\d{4})((-(\d{2})(-(\d{2})(T(\d{2}):(\d{2})(:(\d{2})(.(\d+))?)?(Z|(([+-])((\d{2}):(\d{2})))))?)?)?)$/);
		
		if (iso_date != null) {
			var new_date = new Date();
			var TZ_hour_offset = 0;
			var TZ_minute_offset = 0;
			
			new_date.setUTCFullYear(iso_date[1]);
			if (!isEmpty(iso_date[4])) {
				new_date.setUTCMonth(iso_date[4] - 1);
				if (!isEmpty(iso_date[6])) {
					new_date.setUTCDate(iso_date[6]);
					
					// check TZ first
					if (!isEmpty(iso_date[16])) {
						TZ_hour_offset = iso_date[18];
						TZ_minute_offset = iso_date[19];
						
						if (iso_date[16] == '-') { // is the time offset negative ?
							TZ_hour_offset *= -1;
							TZ_minute_offset *= -1;
						} // otherwise: timeoffset is positive & do nothing
					}
					
					if (!isEmpty(iso_date[8])) {
						new_date.setUTCHours(iso_date[8] - TZ_hour_offset);
						new_date.setUTCMinutes(iso_date[9] - TZ_minute_offset)
						if (!isEmpty(iso_date[11])) {
							new_date.setUTCSeconds(iso_date[11]);
							if (!isEmpty(iso_date[13])) {
								new_date.setUTCMilliseconds(iso_date[13]*1000);
							}
						}
					}
					
				}
			}

			return new_date;
		} else {
			return null;
		}
	}


	/**********************************************************************************

		FUNCTION
			isEmpty

		DESCRIPTION
			determines whether or not the passed in string is EMPTY
			
			EMPTY = null OR "" {EMPTY STRING}

	**********************************************************************************/
	function isEmpty( inputStr ) { 
		if ( null == inputStr || "" == inputStr ) { 
			return true; 
		} 
		
		return false; 
	}

	/**********************************************************************************

		FUNCTION
			get_time_value

		DESCRIPTION
			get the time value specified either in the text or the nerdime attribute 
			of the object and update the nerdtime attribute whether initially present
			or not

			If the nerdtime attribute already exists within the provided object, 
				then the text within the object is ignored in the cutification 
				process.  If the nerdtime attribute does not exist or an invalid one 
				is provided, then a valid nerdtime attribute is assigned to the object.

			If the nerdtime attribute is missing, then it is calculated from the text 
				of the provided object.
		
			If neither nerdtime attibute nor valid object text exist then the 
				timestamp is assumed to by 'now'.

	**********************************************************************************/
	function get_time_value(obj) {
		var time_value = Number.NaN;

		var time_string = get_nerdtime_attr(obj); // returns string or NULL
		if (time_string != null) {
			time_value = date_value(time_string);
		}

		if (isNaN(time_value)) {
			time_string = get_object_text(obj);
			if (time_string != null) {
				time_value = date_value(time_string);
			}
		}

		// if nothing valid available then set time to RIGHT NOW
		if (isNaN(time_value)) {
			time_string = new Date().toString();
			time_value = date_value(time_string);
		}

		// update nerdtime attribute and return the time_value
		set_nerdtime_attr(time_string, obj);
		return time_value;
	}


	/**********************************************************************************

		FUNCTION
			get_nerdtime_attr

		DESCRIPTION
			returns the found value of the nerdtime attribute of the specified object
			or NULL

	**********************************************************************************/
	function get_nerdtime_attr(obj) {
		var return_value = obj.attr(TS_ATTR);

		if (return_value != undefined) {
			return return_value;
		} else {
			return null;
		}
	}


	/**********************************************************************************

		FUNCTION
			set_nerdtime_attr

		DESCRIPTION
			sets / updates the nerdtime attribute of the object

			the nerdime attribute is set to be STARTING point against which all
			future updates are measured against

	**********************************************************************************/
	function set_nerdtime_attr(attr, obj) {
		// assume valid attr(ibute) value
		obj.attr(TS_ATTR, attr);
	}


	/**********************************************************************************

		FUNCTION
			get_object_text

		DESCRIPTION
			returns the text associated with the specified object (if any)

	**********************************************************************************/
	function get_object_text(obj) {
		return obj.text();
	}

})(jQuery);
