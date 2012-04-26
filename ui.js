((function() {
    var self, oauthParameters;
    self = this;
    oauthParameters = function() {
        var self, fields;
        self = this;
        self.timestampForNow = function() {
            var self;
            self = this;
            return Math.floor((new Date).getTime() / 1e3);
        };
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
            bodyEncoding: ko.observable("application/json")
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
        self.addField = function() {
            var self;
            self = this;
            return self.fields.push({
                value: "",
                name: ""
            });
        };
        fields = self.fields = ko.observableArray([]);
        self.removeField = function() {
            var self;
            self = this;
            return fields.remove(this);
        };
        self.fieldsObject = function() {
            var self, f, gen1_items, gen2_i, field;
            self = this;
            f = {};
            gen1_items = self.fields();
            for (gen2_i = 0; gen2_i < gen1_items.length; gen2_i++) {
                field = gen1_items[gen2_i];
                f[field.name] = field.value;
            }
            return f;
        };
        self.sign = function() {
            var self, field, oauthSignature;
            self = this;
            oauthParameters = {};
            for (var field in self.parameters) {
                oauthParameters[field] = self.parameters[field]();
            }
            oauthParameters.fields = self.fieldsObject();
            oauthSignature = oauthSigner(oauthParameters);
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
    ko.applyBindings(new oauthParameters);
})).call(this);