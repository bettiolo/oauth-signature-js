var OAuthConsoleViewModel = function() {
	var self = this;
	this.httpMethod = ko.observable('GET');
	this.url = ko.observable('http://photos.example.net/photos');
	this.parameters = {
		oauth_consumer_key : ko.observable('dpf43f3p2l4k3l03'),
		oauth_token : ko.observable('nnch734d00sl2jdk'),
		oauth_nonce : 'kllo9940pd9333jh',
		oauth_timestamp : '1191242096',
		oauth_signature_method : 'HMAC-SHA1',
		oauth_version : '1.0'
	};
	this.additionalParameters = ko.observableArray([
		new ParameterViewModel('file', 'vacation.jpg'),
		new ParameterViewModel('size', 'original')
	]);
	this.consumerSecret = ko.observable('kd94hf93k423kf44');
	this.tokenSecret = ko.observable('pfkkdhi9sl3r4s00');
	this.encodedSignature = ko.computed(function () {
		var parameters = {
			oauth_consumer_key : self.parameters.oauth_consumer_key(),
			oauth_token : self.parameters.oauth_token(),
			oauth_nonce : 'kllo9940pd9333jh',
			oauth_timestamp : '1191242096',
			oauth_signature_method : 'HMAC-SHA1',
			oauth_version : '1.0'
		}
		self.additionalParameters().forEach(function (parameter) {
			parameters[parameter.name()] = parameter.value();
		});
		var encodedSignature =  oauthSignature.generate(self.httpMethod(), self.url(), parameters, self.consumerSecret(), self.tokenSecret());
		alert(encodedSignature == 'tR3%2BTy81lMeYAr%2FFid0kMTYa%2FWM%3D');
		return encodedSignature;
	});
};
var ParameterViewModel = function (name, value) {
	this.name = ko.observable(name);
	this.value = ko.observable(value);
};

ko.applyBindings(new OAuthConsoleViewModel());

