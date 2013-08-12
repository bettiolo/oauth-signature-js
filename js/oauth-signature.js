// Specification: http://oauth.net/core/1.0/#anchor14
var SignatureBaseString = (function () {
    'use strict';

    function SignatureBaseString(httpMethod, requestUrl, parameters) {
        this._httpMethod = httpMethod || '';
        this._requestUrl = requestUrl || '';
	    this._parameters = {}; // Format: { 'key': ['value 1', 'value 2'] };
	    this._loadParameters(parameters);
	    this._sortedKeys = [];
	    this._concatenatedParameters = '';
    };

	SignatureBaseString.prototype._loadParameters = function (parameters) {
		if (parameters instanceof Array) {
			this._loadParametersFromArray(parameters);
			return;
		}
		if (typeof parameters === 'object') {
			this._loadParametersFromObject(parameters);
		}
	};

	SignatureBaseString.prototype._loadParametersFromArray = function (parameters) {
		var i;
		for (i = 0; i < parameters.length; i++) {
			this._loadParametersFromObject(parameters[i]);
		}
	};

	SignatureBaseString.prototype._loadParametersFromObject = function (parameters) {
		var key,
			value,
			i;
		for (key in parameters) {
			if (parameters.hasOwnProperty(key)) {
				value = parameters[key];
				if (value instanceof Array) {
					for (i = 0; i < value.length; i++) {
						this._addParameter(key, value[i]);
					}
				} else {
					this._addParameter(key, value);
				}
			}
		}
	};



	SignatureBaseString.prototype._addParameter = function (key, value) {
		if (!this._parameters[key]) {
			this._parameters[key] = [];
		}
		this._parameters[key].push(value);
	}

    SignatureBaseString.prototype._normalizeHttpMethod = function () {
        this._httpMethod = this._httpMethod.toUpperCase();
    };

    SignatureBaseString.prototype._normalizeRequestUrl = function () {
        if (!this._requestUrl) {
            return '';
        }
        var scheme = url('protocol', this._requestUrl).toLowerCase();
        var authority = url('hostname', this._requestUrl).toLocaleLowerCase();
	    var port = url('port', this._requestUrl);
	    if (scheme) {
		    if ((port == 80 && scheme == 'http')
			    || (port == 443 && scheme == 'https')) {
			    port = '';
		    }
	    }
        var path = url('path', this._requestUrl);
        this._requestUrl =
	        scheme
            + '://' + authority
            + (port ? ':' + port : '')
            + path;
    };

    SignatureBaseString.prototype._sortParameters = function () {
	    var key;
	    this._sortedKeys = [];
	    for (key in this._parameters) {
		    this._sortedKeys.push(key);
	    }
	    this._sortedKeys.sort();
    };

    SignatureBaseString.prototype._normalizeParameters = function () {

    };

    SignatureBaseString.prototype._concatenateParameters = function() {
	    var i;
	    this._concatenatedParameters = this._sortedKeys.length == 0 ? '&' : '';
	    for (i = 0; i < this._sortedKeys.length; i++) {
		    this._concatenatedParameters += this._getConcatenatedParameter(this._sortedKeys[i]);
	    }
    };

	SignatureBaseString.prototype._getConcatenatedParameter = function(key) {
		var i,
			parameters = this._parameters[key],
			concatenatedParameters = '';
		parameters.sort();
		for (i = 0; i < parameters.length; i++) {
			concatenatedParameters += '&' + key + '=' + parameters[i];
		}
		return concatenatedParameters;
	};

    SignatureBaseString.prototype._concatenateRequestElements = function () {
        // HTTP_METHOD + request url + parameters
        return this._httpMethod + '&' + this._requestUrl + this._concatenatedParameters;
    };

    SignatureBaseString.prototype.generate = function() {
        this._normalizeHttpMethod();
        this._normalizeRequestUrl();
        this._sortParameters();
        this._normalizeParameters();
	    this._concatenateParameters();
        return this._concatenateRequestElements();
    };

    return SignatureBaseString;

})();