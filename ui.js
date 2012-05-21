((function() {
    var self, oauthParameters;
    self = this;
    oauthParameters = function() {
        var self, fieldsArray;
        self = this;
        self.timestampForNow = function() {
            var self;
            self = this;
            return Math.floor((new Date).getTime() / 1e3);
        };
        fieldsArray = ko.observableArray([]);
        self.parameters = {
            method: ko.observable("GET"),
            url: ko.observable(""),
            consumerKey: ko.observable(""),
            consumerSecret: ko.observable(""),
            token: ko.observable(""),
            tokenSecret: ko.observable(""),
            nonce: ko.observable(""),
            timestamp: ko.observable(""),
            version: ko.observable("1.0"),
            body: ko.observable(""),
            bodyEncoding: ko.observable("application/json"),
            fieldsArray: ko.observableArray(),
            fields: ko.observable,
            addField: function() {
                var self;
                self = this;
                return fieldsArray.push({
                    value: ko.observable(""),
                    name: ko.observable("")
                });
            },
            fieldsArray: fieldsArray,
            removeField: function() {
                var self;
                self = this;
                return fieldsArray.remove(this);
            },
            fields: ko.computed(function() {
                var f, gen1_items, gen2_i;
                f = {};
                gen1_items = fieldsArray();
                for (gen2_i = 0; gen2_i < gen1_items.length; gen2_i++) {
                    (function(gen2_i) {
                        var field;
                        field = gen1_items[gen2_i];
                        f[field.name()] = field.value();
                    })(gen2_i);
                }
                return f;
            })
        };
        self.signature = {
            queryString: ko.observable(""),
            baseString: ko.observable(""),
            hmacKey: ko.observable(""),
            base64Signature: ko.observable(""),
            signature: ko.observable(""),
            authorizationHeader: ko.observable(""),
            curl: ko.observable("")
        };
        self.refreshTimestamp = function() {
            var self;
            self = this;
            return self.parameters.timestamp(self.timestampForNow());
        };
        self.refreshTimestamp();
        self.newNonce = function() {
            var self;
            self = this;
            return self.parameters.nonce(Math.floor(Math.random() * 1e9).toString());
        };
        self.newNonce();
        self.methodOptions = ko.observableArray([ "GET", "POST", "PUT", "DELETE" ]);
        self.encodingOptions = ko.observableArray([ "application/json", "application/xml" ]);
        self.sign = function() {
            var self, oauthSignature;
            self = this;
            oauthSignature = oauthSigner(self.parameters);
            self.signature.queryString(oauthSignature.queryString());
            self.signature.baseString(oauthSignature.baseString());
            self.signature.hmacKey(oauthSignature.hmacKey());
            self.signature.base64Signature(oauthSignature.base64Signature());
            self.signature.signature(oauthSignature.signature());
            self.signature.authorizationHeader(oauthSignature.authorizationHeader());
            return self.signature.curl(oauthSignature.curl());
        };
        return undefined;
    };
    window.oauthPage = new oauthParameters;
    ko.applyBindings(oauthPage);
})).call(this);