// Specification: http://oauth.net/core/1.0/#anchor14
var SignatureBaseString = (function () {
    'use strict';

    function SignatureBaseString(httpMethod, requestUrl, parameters) {
        this._httpMethod = httpMethod || '';
        this._requestUrl = requestUrl || '';
        this._parameters = parameters;
    };

    SignatureBaseString.prototype._normalizeHttpMethod = function () {
        // make uppercase
        this._httpMethod = this._httpMethod.toUpperCase();
    };

    SignatureBaseString.prototype._normalizeRequestUrl = function () {
        // HTTP://Example.com:80/resource?id=123
        // http://example.com/resource

    };

    // lexicographical byte value ordering by name and value
    SignatureBaseString.prototype._sortParameters = function () {

    };

    SignatureBaseString.prototype._normalizeParameters = function () {

    };

    SignatureBaseString.prototype._concatenateParameters = function() {
        return '';
    };

    SignatureBaseString.prototype._concatenateRequestElements = function () {
        // HTTP_METHOD + request url + parameters
        var concatenatedParameters = this._concatenateParameters();
        return this._httpMethod + '&' + this._requestUrl + '&' + concatenatedParameters;
    };

    SignatureBaseString.prototype.generate = function() {
        this._normalizeHttpMethod();
        this._normalizeRequestUrl();
        this._sortParameters();
        this._normalizeParameters();
        return this._concatenateRequestElements();
    };

    return SignatureBaseString;

})();