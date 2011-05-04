/**
 * jQuery.nerdTime - cuteTime fork to reformat dates
 *
 * @author Jay Wineinger <jay.wineinger@nerdery.com>
 * @date 2011-05-03
 *
 * DESCRIPTION
 *
 *     nerdTime is a fork of the jQuery cuteTime plugin which automatically
 *     converts timestamps to a nicer format. It also has the ability to
 *     dynamically re-update and/or automatically update timestamps on a
 *     controlled interval.
 *     
 *     The most significant change in this fork is the removal of time_ranges
 *     in favor of definition of time units only.  This allows for easier
 *     support for past and future dates, both of which are included in this
 *     plugin. Additionally, relative units such as "tomorrow" and "yesterday"
 *     have been removed since they are frequently incorrect when calculated
 *     using a time delta only.  Second, the output of the plugin is now
 *     wrapped in an <ABBR> tag. Finally, all references to "cute" have been
 *     changed to nerd, including function and variable names.
 *     
 *     If used by Selector, replaces the text of the provided object with a
 *     nerdTime. If used as a function, returns a string containing a nerdTime
 *     version of the provided timestamp.
 *     
 *     BY DEFAULT
 *     automatic updating is disabled and the following time units can be
 *     displayed:
 *
 *         year
 *         week
 *         day
 *         hour
 *         minute
 *         second
 *
 *
 * IMPLEMENTATION
 *
 *     $('.timestamp').nerdTime();
 *     $('.timestamp').nerdTime({ / * OPTIONS * / });
 *     
 *     nerdtime_object = $('.timestamp').nerdTime();
 *     nerdtime_object.update_nerdiness();
 *
 *     $.nerdTime('2009/10/12 22:11:19');
 *     $.nerdTime({ / * OPTIONS * / }, '2009/10/12 22:11:19');
 *
 * COMPATIBILITY
 *
 *     Tested in FF3.5, IE7
 *     With jQuery 1.3.2
 *
 * METHODS
 *
 *     When initialized the nerdTime variable either updates or assigns the TS_ATTR
 *     attribute to the provided objects.  Method implementation supports chaining and 
 *     returns jQuery object.  
 *
 *         e.g.
 *             <div class='timestamp' data-timestamp='2009 10 12 22:11:19'>2009 10 12 22:11:19</div>               
 *     
 *     If the nerdtime attribute already exists within the provided object, then the
 *     text within the object is ignored in the process.  If the nerdtime attribute 
 *     does not exist or an invalid one is provided, then a valid nerdtime attribute is assigned
 *     to the object.
 *
 *     If the nerdtime attribute is missing, then it is calculated from the text of the 
 *     provided object.
 *     
 *     If neither nerdtime attibute nor valid object text exist then the timestamp is assumed 
 *     to by 'now'.
 *
 *     stop_nerdiness()
 *         stops all automatic updates of refresh enabled timestamps
 *
 *     start_nerdiness()
 *         starts the automatic updating of timestamps
 *         REMINDER: make sure refresh is set to > 0
 *
 *     update_nerdiness()
 *         updates timestamps of the provided objects
 *
 * FUNCTIONS
 *
 *     nerdTime(<STRING>)
 *
 * CUSTOMIZATION
 *
 *     nerdTime(OPTIONS)
 *     e.g. $('.ts2').nerdTime({ refresh: 60000 });
 *     
 *     refresh:    time in milliseconds before next refresh of page data; 
 *                 -1 == no refresh
 *     units:      object mapping time unit names to configuration objects.
 *     
 *     time unit configuration objects consist of the following keys:
 *     
 *         plural:         the plural string for the given time unit
 *         
 *         in_seconds:     the number of seconds in a single time unit
 *
 *         include_smaller: (optional) an object which allows for smaller
 *         time units to be used as cleanup after the matching larger unit. 
 *         Practically, this allows you to get the output "1 week, 3 days ago"
 *         instead of just "1 week". 
 *         
 *         include_smaller objects consist of the following keys:
 *         
 *             allowed_units:  an array of strings which are unit names
 *             matching the keys to the 'units' object. 
 *             
 *             max_units:      defines how many smaller units from the
 *             'allowed_units' array can be used. Setting 'max_units' to 1
 *             means only the first item from 'allowed_units' which is can be
 *             used (due to the number of seconds remaining), will be used. 
 *             This allows you to get the output "1 week, 2 hours ago" and
 *             "1 week, 5 days ago" with the same configuration (but different
 *             dates).
 *
 *
 * EXAMPLE OPTIONS
 *     {   refresh: -1,
 *         units: {
 *             year: {
 *                 plural: 'years',
 *                 in_seconds: 60 * 60 * 24 * 365,
 *                 include_smaller : {
 *                     allowed_units: ['week','day'],
 *                     max_units: 1,
 *                 }
 *             },
 *             week: {
 *                 plural: 'weeks',
 *                 in_seconds: 60 * 60 * 24 * 7,
 *                 include_smaller : {
 *                     allowed_units: ['day','hour'],
 *                     max_units: 1,
 *                 }
 *             },
 *             day: {
 *                 plural: 'days',
 *                 in_seconds: 60 * 60 * 24,
 *                 include_smaller: {
 *                     allowed_units: ['hour'],
 *                     max_units: 1,
 *                 }
 *             },
 *             hour: {
 *                 plural: 'hours',
 *                 in_seconds: 60 * 60,
 *                 include_smaller: {
 *                     allowed_units: ['minute'],
 *                     max_units: 1,
 *                 }
 *             },
 *             minute: {
 *                 plural: 'minutes',
 *                 in_seconds: 60,
 *             },
 *             second: {
 *                 plural: 'seconds',
 *                 in_seconds: 1,
 *             },
 *         }
 *     };
 *
 * VALID TIMESTAMP FORMAT EXAMPLES
 *
 *     2009-10-15 14:06:23                                         *doesn't work in IE
 *     Thu Oct 15 2009 22:11:19 GMT-0400 (Eastern Daylight Time
 *     Oct 15 2009 22:11:19
 *     2009 10 12 22:11:19                                         * only works in FF
 *     10 15 2009 22:11:19                                         * only works in FF
 *
 *     ALL ISO8601 Date/Time Formats Also Supported
 *     2009-11-24T19:20:30+01:00
 *     2009-11
 *     2009-11-24T13:15:30Z
 *     ...etc...
 *     
 *     * if the TIMESTAMP can be recognized by the JavaScript Date() Object then it is VALID 
 *       (i.e. if it can be parsed by Date.parse())
 *     ** IE date parsing is VERY DIFFERENT (and more limiting) than FF :-(  [not nerd!]
 *
 *****************************************************************************************************/

(function($) {
    // CONSTANTS
    var NEG_INF = Number.NEGATIVE_INFINITY;
    var POS_INF = Number.POSITIVE_INFINITY;
    var TS_ATTR = 'data-timestamp';

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
                var nerd_time = get_nerdiness(right_now - other_time);
                var orig_time = get_nerdtime_attr(curr_this);
                curr_this.html(get_output(orig_time, nerd_time));
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
            
            can be directly accessed by '$.fn.nerdTime.settings = ... ;'

    **********************************************************************************/
    $.fn.nerdTime.settings = {
        // time in milliseconds before next refresh of page data; -1 == no refresh
        refresh: -1,

        // the time units to decomopose a given number of seconds into. they
        // will be attempted in the order defined here, so make sure  overrides
        // are in descending order.
        units: {
            year: {
                plural: 'years',
                in_seconds: 60 * 60 * 24 * 365,
                include_smaller : {
                    allowed_units: ['week', 'day'],
                    max_units: 1,
                }
            },
            week: {
                plural: 'weeks',
                in_seconds: 60 * 60 * 24 * 7,
                include_smaller : {
                    allowed_units: ['day', 'hour'],
                    max_units: 1,
                }
            },
            day: {
                plural: 'days',
                in_seconds: 60 * 60 * 24,
                include_smaller: {
                    allowed_units: ['hour'],
                    max_units: 1,
                }
            },
            hour: {
                plural: 'hours',
                in_seconds: 60 * 60,
                include_smaller: {
                    allowed_units: ['minute'],
                    max_units: 1,
                }
            },
            minute: {
                plural: 'minutes',
                in_seconds: 60,
            },
            second: {
                plural: 'seconds',
                in_seconds: 1,
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
            var nerd_time = get_nerdiness(right_now - other_time);
            var orig_time = get_nerdtime_attr(curr_this);
            curr_this.html(get_output(orig_time, nerd_time));
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

    **********************************************************************************/
    function get_nerdiness(time_difference) {
        // convert to seconds
        time_difference = Math.round(time_difference / 1000);

        var units = $.fn.nerdTime.c_settings.units;
        // an array to hold the various strings as time units are processed
        var nerd_time = [];

        var is_future = time_difference < 0;
        var total_remaining = Math.abs(time_difference)

        /**
         * Function to process a time unit on the number of remaining seconds.
         * This is called recursively when 'include_smaller' is set for the
         * time unit's configuration.
         *
         * Returns false when the time unit IS used. Returns true if the time
         * unit is not used.  This convention is due to the use of
         * jQuery.each().
         */
        process_unit = function(unit_name, config, prevent_smaller) {
            // does this unit divide at least once into the remaining seconds?
            var divides = Math.floor(total_remaining / config.in_seconds);
            if (divides > 0) {
                // update the remaining seconds 
                total_remaining %= config.in_seconds;

                if (divides == 1) {
                    nerd_time.push(divides + ' ' + unit_name);
                } else {
                    nerd_time.push(divides + ' ' + config.plural);
                }

                if (!prevent_smaller && 'include_smaller' in config &&
                    config.include_smaller.allowed_units)
                {
                    // setup a limit so we don't use too many smaller units
                    var unit_limit = config.include_smaller.max_units;
                    jQuery.each(config.include_smaller.allowed_units, function(idx, unit_name) {
                        if (unit_limit > 0) { 
                            // returns false if the time unit IS used
                            var ret = process_unit(unit_name, units[unit_name], true);
                            if (ret === false) {
                                unit_limit -= 1;
                            }
                        }
                    });
                }
                return false;
            }
            
            // keep jQuery.each() going
            return true;
        };

        // process the time units -- use only the largest possible
        jQuery.each(units, process_unit);

        // if any units were used, create the time string from them
        if (nerd_time.length > 0) {
            nerd_time_str = nerd_time.join(', ');
            if (is_future) {
                nerd_time = "in " + nerd_time_str;
            } else {
                nerd_time = nerd_time_str + " ago";
            }

        // else, no time unit was small enough or time difference was zero.
        } else {
            nerd_time = "right now";
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
            and the jQuery cuteTime Plugin @ http://tpgblog.com/cutetime;  Thanks. :-)

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
                in FireFox,             void(0) 
                in Internet Explorer,   "" <-- empty string
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
            get the time value specified either in the text or the nerdme attribute 
            of the object and update the nerdtime attribute whether initially present
            or not

            If the nerdtime attribute already exists within the provided object, 
                then the text within the object is ignored in the 
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

            the nerdme attribute is set to be STARTING point against which all
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

    /**********************************************************************************

        FUNCTION
            get_output

        DESCRIPTION
            returns the output to set as the HTML

    **********************************************************************************/
    function get_output(orig, text) {
        return "<ABBR TITLE='" + orig + "'>" + text + "</ABBR>";
    }
})(jQuery);
