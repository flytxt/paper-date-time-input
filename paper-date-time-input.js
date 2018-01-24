Polymer({
  is: 'paper-date-time-input',

  properties: {

    /**
     * The label for date input
     */
    labelDate: String,

    /**
     * The label for time input
     */
    labelTime: String,

    /**
     * Disables date selection
     */
    disableDate: {
      type: Boolean,
      value: false
    },

    /**
     * Disables time selection
     */
    disableTime: {
      type: Boolean,
      value: false
    },

    /**
     * The selected date (YYYY-MM-DD)
     */
    date: {
      type: Date,
      notify: true,
      observer: '_setDatePicker'
    },

    /**
     * Used to set current date
     */
    tzDate: {
      type: Date,
      value: new Date()
    },

    /**
     * Used internally to set date in the picker
     */
    _date: {
      type: Date,
      value: new Date()
    },

    /**
     * The format to apply when displaying in the date input field
     */
    dateFormat: {
      type: String,
      value: 'YYYY-MM-DD'
    },

    /**
     *  Set to true to mark the input as required
     */
    required: {
      type: Boolean,
      value: false
    },

    /**
     * Set to true to auto-validate the input value
     */
    autoValidate: {
      type: Boolean,
      value: false
    },

    /**
     *  Error message to show for required validation
     */
    errorMessage: {
      type: String,
      value: 'This field is required'
    },

    /**
     * Returns true if the value is invalid.
     */
    invalid: {
      type: Boolean,
      value: false,
      notify: true
    },

    /**
     * The selected time
     */
    time: {
      type: String,
      notify: true,
      observer: '_setTimePicker'
    },

    /**
     * The format to apply when displaying in the time input field
     */
    timeFormat: String,

    /**
     * The current 24-hour value (0-24)
     */
    hour: {
      type: Number,
      notify: true
    },

    /**
     * The current minute (0-59)
     */
    minute: {
      type: Number,
      notify: true
    },

    /**
     * The current second (0-59)
     */
    second: {
      type: Number,
      notify: true
    },

    /**
     * Flag to enable seconds selection
     */
    enableSeconds: {
      type: Boolean,
      value: false,
      observer: '_enableSecondsChange'
    },

    /**
     * Label for OK button in dialog box
     */
    okText: {
      type: String,
      value: 'OK'
    },

    /**
     * Label for Cancel button in dialog box
     */
    cancelText: {
      type: String,
      value: 'Cancel'
    },

    /**
		 * The locale used for date and time formatting.
		 */
		locale: {
			type: String,
			value: function() {
				return moment.locale();
			}
		}
  },

  _setDatePicker: function(date) {
    if (this._isString(date)) {
      date = new Date(date);
      if (this._isDate(date)) {
        this.set('date', date);
      }
    } else if (this._isDate(date)) {
      this.set('_date', date);
      this.set('time', this.$.datePicker.$.calendar.dateFormat(date, this._getTimeFormat()));
    }
  },

  _setTimePicker: function(time) {
    if (time) {
      this.set('_time', time);
    }
  },

  _showDateDialog: function() {
    this.$.dateDialog.toggle();
  },

  _showTimeDialog: function() {
    this.$.timeDialog.toggle();
  },

  _formatDate: function(date) {
    if (!this._isDate(date)) { return null; }
    var calendar = this.$.datePicker.$.calendar;
    if (!this.disableTime) {
      this.set('_time', calendar.dateFormat(date, this._getTimeFormat()));
    }
    return calendar.dateFormat(date, this.dateFormat);
  },

  /**
   * workaround for enableSeconds not reflecting to attribute in picker
   */
  _enableSecondsChange: function(enableSeconds) {
    if (enableSeconds) {
      this.$.timePicker.setAttribute('enable-seconds', true);
    } else {
      this.$.timePicker.removeAttribute('enable-seconds');
    }
  },

  _getTimeFormat: function() {
    return this.timeFormat || (this.enableSeconds ? 'h:mm:ss A' : 'h:mm A');
  },

  _getDate: function() {
    var me = this;
    var date = me.date;
    if (me._isString(date)) {
      date = new Date(date);
    }
    if (!me._isDate(date)) {
      date = new Date();
    }
    return date;
  },

  _setDate: function() {
    var me = this;
    if (me._isDate(me._date)) {
      var date = new Date(me._getDate());
      date.setFullYear(me._date.getFullYear());
      date.setMonth(me._date.getMonth(), me._date.getDate());//Fix late day of month issue
      me.set('date', date);
    }
  },

  _setTime: function() {
    var me = this;
    if (!me._time) { return; }
    var date = new Date(me._getDate());
    if (me._isNumber(me._hour)) {
      date.setHours(me._hour);
      me.set('hour', me._hour);
    }
    if (me._isNumber(me._minute)) {
      date.setMinutes(me._minute);
      me.set('minute', me._minute);
    }
    if (me._isNumber(me._second)) {
      date.setSeconds(me._second);
      me.set('second', me._second);
    }
    me.set('date', date);
    me.set('time', me.$.datePicker.$.calendar.dateFormat(date, me._getTimeFormat()));
  },

  _isDate: function(date) {
    return date && typeof (date).getDate === 'function';
  },

  _isString: function(string) {
    return string && typeof string === 'string';
  },

  _isNumber: function(number) {
    return typeof number === 'number';
  }
});
