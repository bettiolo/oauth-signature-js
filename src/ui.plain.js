window.addEventListener('load', function () {
	'use strict';

	var oauthConsole = new OAuthConsole();

}, false);

(function () {

	function OAuthConsole() {
		this._boundElements = {};
		this._updateUi();
	}

	OAuthConsole.prototype._updateUi = function () {
		var httpMethod = this._getValueAndBind('httpMethod'),
			url = this._getValueAndBind('url'),
			parameters = {
				oauth_consumer_key : this._getValueAndBind('consumerKey'),
				oauth_token : this._getValueAndBind('tokenKey'),
				oauth_nonce : 'kllo9940pd9333jh',
				oauth_timestamp : '1191242096',
				oauth_signature_method : 'HMAC-SHA1',
				oauth_version : '1.0',
				file : 'vacation.jpg',
				size : 'original'
			},
			consumerSecret = this._getValueAndBind('consumerSecret'),
			tokenSecret = this._getValueAndBind('tokenSecret'),
			encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret);

		this._setValue('signature', encodedSignature);

		alert(encodedSignature == 'tR3%2BTy81lMeYAr%2FFid0kMTYa%2FWM%3D');
	};

	OAuthConsole.prototype._getValueAndBind = function (elementId) {
		var cachedElement = this._boundElements[elementId];
		if (!cachedElement) {
			cachedElement = document.getElementById(elementId);
			var self = this;
			cachedElement.addEventListener('change', function () {
				self._updateUi();
			});
			this._boundElements[elementId] = cachedElement;
		}
		return cachedElement.value;
	};

	OAuthConsole.prototype._setValue = function (elementId, value) {
		return document.getElementById(elementId).value = value;
	};

	window.OAuthConsole = OAuthConsole;

})();