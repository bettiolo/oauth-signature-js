// Specification: http://oauth.net/core/1.0/#anchor14
var SignatureBaseString = (function () {
    'use strict';

	// requestUrl: if the scheme is missing, http will be added automatically
    function SignatureBaseString(httpMethod, requestUrl, parameters) {
        this._httpMethod = httpMethod || '';
        this._requestUrl = requestUrl || '';
	    this._parameters = new ParametersLoader(parameters).get(); // Format: { 'key': ['value 1', 'value 2'] };
	    this._sortedKeys = [];
	    this._concatenatedParameters = '';
	    this._encoder = new Rfc3986();
    }

	SignatureBaseString.prototype = {
        _normalizeHttpMethod : function () {
            this._httpMethod = this._httpMethod.toUpperCase();
        },
        _normalizeRequestUrl : function () {
            // The following is to prevent js-url from loading the window.location
            if (!this._requestUrl) {
                return;
            }
            var scheme = url('protocol', this._requestUrl).toLowerCase(),
                authority = url('hostname', this._requestUrl).toLocaleLowerCase(),
                port = url('port', this._requestUrl),
                path = url('path', this._requestUrl);
            if (this._requestUrl.toLowerCase().indexOf(scheme) != 0) {
                scheme = 'http';
            }
            if ((port == 80 && scheme == 'http')
                || (port == 443 && scheme == 'https'))
            {
                    port = '';
            }
            this._requestUrl =
                (scheme ? scheme + '://' : '')
                + authority
                + (port ? ':' + port : '')
                + path;
        },
        _sortParameters : function () {
            var key;
            this._sortedKeys = [];
            for (key in this._parameters) {
                this._sortedKeys.push(key);
            }
            this._sortedKeys.sort();
        },
        _normalizeParameters : function () {

        },
        _concatenateParameters : function () {
            var i;
            this._concatenatedParameters = this._sortedKeys.length == 0 ? '&' : '';
            for (i = 0; i < this._sortedKeys.length; i++) {
                this._concatenatedParameters += this._getConcatenatedParameter(this._sortedKeys[i]);
            }
        },
        _getConcatenatedParameter : function (key) {
            var i,
                parameters = this._parameters[key],
                concatenatedParameters = '';
            parameters.sort();
            for (i = 0; i < parameters.length; i++) {
                concatenatedParameters +=
	                '&' + this._encoder.encode(key) +
		            '=' + this._encoder.encode(parameters[i]);
            }
            return concatenatedParameters;
        },
        _concatenateRequestElements : function () {
            // HTTP_METHOD + request url + parameters
            return this._httpMethod + '&' + this._requestUrl + this._concatenatedParameters;
        },
        generate : function () {
            this._normalizeHttpMethod();
            this._normalizeRequestUrl();
            this._sortParameters();
            this._normalizeParameters();
            this._concatenateParameters();
            return this._concatenateRequestElements();
        }
    };

    return SignatureBaseString;
})();

var ParametersLoader = (function () {
	'use strict';

	function ParametersLoader (parameters) {
		this._parameters = {}; // Format: { 'key': ['value 1', 'value 2'] };
		this._loadParameters(parameters);
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