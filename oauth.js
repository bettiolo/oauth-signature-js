((function() {
    var self, oauthSigner, oauthSample;
    self = this;
    window.oauthSigner = oauthSigner = function(parameters) {
        return _.extend({
            token: "",
            tokenSecret: "",
            version: "1.0",
            signatureMethod: "HMAC-SHA1",
            method: "GET",
            timestamp: Math.floor((new Date).getTime() / 1e3),
            fields: {},
            oauthParameters: function() {
                var self, queryFields;
                self = this;
                queryFields = {
                    oauth_consumer_key: self.consumerKey,
                    oauth_nonce: self.nonce,
                    oauth_timestamp: self.timestamp,
                    oauth_signature_method: self.signatureMethod
                };
                if (self.token) {
                    queryFields["oauth_token"] = self.token;
                }
                if (self.version) {
                    queryFields["oauth_version"] = self.version;
                }
                return queryFields;
            },
            queryStringFields: function() {
                var self, queryFields;
                self = this;
                queryFields = self.oauthParameters();
                _.each(_.keys(self.fields), function(field) {
                    return queryFields[field] = self.fields[field];
                });
                return queryFields;
            },
            queryString: function() {
                var self, queryArguments, orderedFields;
                self = this;
                queryArguments = self.queryStringFields();
                orderedFields = _.keys(queryArguments).sort();
                return _.map(orderedFields, function(fieldName) {
                    return fieldName + "=" + self.percentEncode(queryArguments[fieldName]);
                }).join("&");
            },
            urlEncoded: function(fields) {
                var self;
                self = this;
                return _.map(_.keys(fields), function(fieldName) {
                    return fieldName + "=" + encodeURIComponent(fields[fieldName]);
                }).join("&");
            },
            headerEncoded: function(fields) {
                var self;
                self = this;
                return _.map(_.keys(fields), function(fieldName) {
                    return fieldName + '="' + encodeURIComponent(fields[fieldName]) + '"';
                }).join(", ");
            },
            urlEncodedFields: function() {
                var self;
                self = this;
                return self.urlEncoded(self.fields);
            },
            authorizationHeader: function() {
                var self, fields;
                self = this;
                fields = self.oauthParameters();
                fields["oauth_signature"] = self.base64Signature();
                return self.headerEncoded(fields);
            },
            urlAndFields: function() {
                var self, encodedFields;
                self = this;
                encodedFields = self.urlEncodedFields();
                if (encodedFields) {
                    return self.url + "?" + encodedFields;
                } else {
                    return self.url;
                }
            },
            parameterEncoded: function(fields) {
                var self;
                self = this;
                return _.map(fields, function(field) {
                    return self.percentEncode(field);
                }).join("&");
            },
            baseString: function() {
                var self;
                self = this;
                return self.parameterEncoded([ self.method, self.url, self.queryString() ]);
            },
            hmacKey: function() {
                var self;
                self = this;
                return self.parameterEncoded([ self.consumerSecret, self.tokenSecret ]);
            },
            hmac: function(gen1_options) {
                var encoding, self;
                encoding = gen1_options && gen1_options.encoding != null ? gen1_options.encoding : "binary";
                self = this;
                if (typeof process !== "undefined") {
                    var crypto, h;
                    crypto = require("crypto");
                    h = crypto.createHmac("sha1", self.hmacKey());
                    h.update(self.baseString());
                    return h.digest(encoding);
                } else {
                    var binary;
                    binary = Crypto.HMAC(Crypto.SHA1, self.baseString(), self.hmacKey(), {
                        asBytes: true
                    });
                    if (encoding === "base64") {
                        return Crypto.util.bytesToBase64(binary);
                    } else {
                        return binary;
                    }
                }
            },
            base64Signature: function() {
                var self;
                self = this;
                return self.hmac({
                    encoding: "base64"
                });
            },
            signature: function() {
                var self;
                self = this;
                return self.percentEncode(self.base64Signature());
            },
            curl: function() {
                var self;
                self = this;
                if (self.method === "GET") {
                    return "curl '" + self.url + "?" + self.queryString() + "&oauth_signature=" + self.signature() + "'";
                } else if (self.method === "POST" || self.method === "PUT") {
                    if (self.body) {
                        return "curl -X " + self.method + " '" + self.urlAndFields() + "' -d '" + self.body + "' -H 'Authorization: " + self.authorizationHeader() + "' -H 'Content-Type: " + self.bodyEncoding + "'";
                    } else {
                        return "curl -X " + self.method + " '" + self.url + "' -d '" + self.queryString() + "&oauth_signature=" + self.signature() + "'";
                    }
                } else {
                    return "curl -X DELETE '" + self.url + "?" + self.queryString() + "&oauth_signature=" + self.signature() + "'";
                }
            },
            percentEncode: function(s) {
                var self;
                self = this;
                return encodeURIComponent(s).replace(/\*/g, "%2A");
            },
            print: function() {
                var self;
                self = this;
                console.log("query string:", self.queryString());
                console.log("base string:", self.baseString());
                console.log("hmac key:", self.hmacKey());
                console.log("hmac:", self.hmac());
                console.log("base64 signature:", self.base64Signature());
                return console.log("signature:", self.signature());
            }
        }, parameters);
    };
    oauthSample = function() {
        return oauthSigner({
            url: "http://photos.example.net/photos",
            consumerSecret: "kd94hf93k423kf44",
            token: "nnch734d00sl2jdk",
            tokenSecret: "pfkkdhi9sl3r4s00",
            consumerKey: "dpf43f3p2l4k3l03",
            nonce: "kllo9940pd9333jh",
            timestamp: 1191242096,
            fields: {
                file: "vacation.jpg",
                size: "original"
            }
        }).print();
    };
})).call(this);