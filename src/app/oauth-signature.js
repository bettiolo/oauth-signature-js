var oauthSignature = (function() {
	'use strict';

	function OAuthSignature() {
	}

	OAuthSignature.prototype.generate = function (httpMethod, url, parameters, tokenSecret, consumerSecret) {
		var signatureBaseString = new SignatureBaseString(httpMethod, url, parameters).generate();
		var signature = new HmacSha1Signature(signatureBaseString, tokenSecret, consumerSecret).generate();
		return signature;
	}

	// Specification: http://oauth.net/core/1.0/#anchor14
	// url: if the scheme is missing, http will be added automatically
	function SignatureBaseString(httpMethod, url, parameters) {
		parameters = new ParametersLoader(parameters).get();
		this._httpMethod = new HttpMethodElement(httpMethod).get();
		this._url = new UrlElement(url).get();
		this._parameters = new ParametersElement(parameters).get();
		this._rfc3986 = new Rfc3986();
	}

	SignatureBaseString.prototype = {
		generate : function () {
			// HTTP_METHOD & url & parameters
			return this._rfc3986.encode(this._httpMethod) + '&'
				+ this._rfc3986.encode(this._url) + '&'
				+ this._rfc3986.encode(this._parameters);
		}
	};

	function HttpMethodElement(httpMethod) {
		this._httpMethod = httpMethod || '';
	}

	HttpMethodElement.prototype = {
		get : function () {
			return this._httpMethod.toUpperCase();
		}
	};

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
	};

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
	};

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
			var key;
			for (key in parameters) {
				if (parameters.hasOwnProperty(key)) {
					this._loadParameterValue(key, parameters[key] || '');
				}
			}
		},
		_loadParameterValue : function (key, value) {
			var i;
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

	function HmacSha1Signature(signatureBaseString, consumerSecret, tokenSecret) {
		this._rfc3986 = new Rfc3986();
		this._text = signatureBaseString;
		this._key = this._rfc3986.encode(consumerSecret) + '&' + this._rfc3986.encode(tokenSecret);
		this._base64EncodedHash = new HmacSha1(this._text, this._key).getBase64EncodedHash();
	}

	HmacSha1Signature.prototype = {
		generate : function () {
			return this._rfc3986.encode(this._base64EncodedHash);
		}
	};

	function HmacSha1(text, key) {
		this._text = text || '';
		this._key = key || '';
		this._hash = CryptoJS.HmacSHA1(this._text, this._key);
	}

	HmacSha1.prototype = {
		getBase64EncodedHash : function () {
			return this._hash.toString(CryptoJS.enc.Base64);
		}
	};

	var oauthSignature = new OAuthSignature();
	oauthSignature.SignatureBaseString = SignatureBaseString;
	oauthSignature.HttpMethodElement = HttpMethodElement;
	oauthSignature.UrlElement = UrlElement;
	oauthSignature.ParametersElement = ParametersElement;
	oauthSignature.ParametersLoader = ParametersLoader;
	oauthSignature.Rfc3986 = Rfc3986;
	oauthSignature.HmacSha1Signature = HmacSha1Signature;
	oauthSignature.HmacSha1 = HmacSha1;
	return oauthSignature;
})();