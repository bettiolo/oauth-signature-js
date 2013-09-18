// Specification: http://oauth.net/core/1.0/#anchor14
var SignatureBaseString = (function () {
    'use strict';

	// url: if the scheme is missing, http will be added automatically
    function SignatureBaseString(httpMethod, url, parameters) {
        this._httpMethod = new HttpMethodElement(httpMethod).get();
        this._url = new UrlElement(url).get();
	    parameters = new ParametersLoader(parameters).get();
	    this._parameters = new ParametersElement(parameters).get();
	    this._rfc3986 = new Rfc3986();
    }

	SignatureBaseString.prototype = {

        _concatenateRequestElements : function () {
            // HTTP_METHOD & url & parameters
            return this._rfc3986.encode(this._httpMethod) + '&'
		         + this._rfc3986.encode(this._url) + '&'
	             + this._rfc3986.encode(this._parameters);
        },
        generate : function () {
            return this._concatenateRequestElements();
        }
    };

    return SignatureBaseString;
})();

var HttpMethodElement = (function () {

	function HttpMethodElement(httpMethod) {
		this._httpMethod = httpMethod || '';
	}

	HttpMethodElement.prototype = {
		get : function () {
			return this._httpMethod.toUpperCase();
		}
	}

	return HttpMethodElement;
})();

var UrlElement = (function () {

	function UrlElement(url) {
		this._url = url || '';
	}

	UrlElement.prototype = {
		get : function () {
			// The following is to prevent js-url from loading the window.location
			if (!this._url) {
				return this._url;
			}
			var scheme = url('protocol', this._url).toLowerCase(),
				authority = url('hostname', this._url).toLocaleLowerCase(),
				port = url('port', this._url),
				path = url('path', this._url);
			if (this._url.toLowerCase().indexOf(scheme) != 0) {
				scheme = 'http';
			}
			if ((port == 80 && scheme == 'http')
				|| (port == 443 && scheme == 'https'))
			{
				port = '';
			}
			this._url =
				(scheme ? scheme + '://' : '')
					+ authority
					+ (port ? ':' + port : '')
					+ path;
			return this._url;
		}
	}

	return UrlElement;
})();

var ParametersElement = (function () {

	function ParametersElement (parameters) {
		this._parameters = parameters; // Format: { 'key': ['value 1', 'value 2'] };
		this._sortedKeys = [ ];
		this._normalizedParameters = [ ];
		this._rfc3986 = new Rfc3986();
		this._sortParameters();
		this._concatenateParameters();
	}

	ParametersElement .prototype = {
		_sortParameters : function () {
			var key;
			for (key in this._parameters) {
				this._sortedKeys.push(key);
			}
			this._sortedKeys.sort();
		},
		_concatenateParameters : function () {
			var i;
			for (i = 0; i < this._sortedKeys.length; i++) {
				this._normalizeParameter(this._sortedKeys[i]);
			}
		},
		_normalizeParameter : function (key) {
			var i,
				values = this._parameters[key],
				encodedKey = this._rfc3986.encode(key),
				encodedValue;
			values.sort();
			for (i = 0; i < values.length; i++) {
				encodedValue = this._rfc3986.encode(values[i]);
				this._normalizedParameters.push(encodedKey + '=' + encodedValue)
			}
		},
		get : function () {
			return this._normalizedParameters.join('&');
		}
	}

	return ParametersElement ;
})();

var ParametersLoader = (function () {
	'use strict';

	function ParametersLoader (parameters) {
		this._parameters = { }; // Format: { 'key': ['value 1', 'value 2'] }
		this._loadParameters(parameters || { });
	}

	ParametersLoader.prototype = {
		_loadParameters : function (parameters) {
			if (parameters instanceof Array) {
				this._loadParametersFromArray(parameters);
				return;
			}
			if (typeof parameters === 'object') {
				this._loadParametersFromObject(parameters);
			}
		},
		_loadParametersFromArray : function (parameters) {
			var i;
			for (i = 0; i < parameters.length; i++) {
				this._loadParametersFromObject(parameters[i]);
			}
		},
		_loadParametersFromObject : function (parameters) {
			var key,
				value,
				i;
			for (key in parameters) {
				if (parameters.hasOwnProperty(key)) {
					value = parameters[key] || '';
					if (value instanceof Array) {
						for (i = 0; i < value.length; i++) {
							this._addParameter(key, value[i]);
						}
						if (value.length == 0) {
							this._addParameter(key, '');
						}
					} else {
						this._addParameter(key, value);
					}
				}
			}
		},
		_addParameter : function (key, value) {
			if (!this._parameters[key]) {
				this._parameters[key] = [];
			}
			this._parameters[key].push(value);
		},
		get : function () {
			return this._parameters;
		}
	};

	return ParametersLoader;
})();

var Rfc3986 = (function () {
    'use strict';

    function Rfc3986() {

    }

    Rfc3986.prototype = {
        encode : function (decoded) {
	        if (!decoded) {
		        return '';
	        }
	        // using implementation from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FencodeURIComponent
	        return encodeURIComponent(decoded)
		        .replace(/[!'()]/g, escape)
		        .replace(/\*/g, "%2A");
        },
        decode : function (encoded) {
	        if (!encoded) {
		        return '';
	        }
            return decodeURIComponent(encoded);
        }
    };

	return Rfc3986;
})();