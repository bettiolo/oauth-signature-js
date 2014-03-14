var oauthSignature = require('./app/oauth-signature');
var httpMethod = 'GET',
	url = 'http://photos.example.net/photos',
	parameters = {
		oauth_consumer_key : 'dpf43f3p2l4k3l03',
		oauth_token : 'nnch734d00sl2jdk',
		oauth_nonce : 'kllo9940pd9333jh',
		oauth_timestamp : '1191242096',
		oauth_signature_method : 'HMAC-SHA1',
		oauth_version : '1.0',
		file : 'vacation.jpg',
		size : 'original'
	},
	consumerSecret = 'kd94hf93k423kf44',
	tokenSecret = 'pfkkdhi9sl3r4s00',
	encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret);

console.log(encodedSignature == 'tR3%2BTy81lMeYAr%2FFid0kMTYa%2FWM%3D' ? 'Correct signature' : 'Wrong signature')