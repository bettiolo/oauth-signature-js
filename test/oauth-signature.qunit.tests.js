module('Oauth Signature Base String');
test('It should start with an uppercase http method, followed by two ampersands', function () {
	equal(new SignatureBaseString('get').generate(), 'GET&&',
		'Should be GET&& because & should be included for omitted elements');
	equal(new SignatureBaseString('pOsT').generate(), 'POST&&',
		'Should be POST&& because & should be included for omitted elements');
	equal(new SignatureBaseString('').generate(), '&&',
		'Should be && because the http method is empty');
	equal(new SignatureBaseString().generate(), '&&',
		'Should be && because the http method is not passed');
	equal(new SignatureBaseString(null).generate(), '&&',
		'Should be && because the http method is null');
	equal(new SignatureBaseString(undefined).generate(), '&&',
		'Should be && because the http method is undefined');
});
test('The resource url should be included in the second segment after the http method and should be suffixed by an ampersand', function () {
	equal(new SignatureBaseString('GET', 'http://example.co.uk').generate(), 'GET&http://example.co.uk/&',
		'Should be GET&http://example.co.uk/&');
	equal(new SignatureBaseString('', 'http://EXAMPLE.co.UK/endpoint').generate(), '&http://example.co.uk/endpoint&',
		'Should be &http://example.co.uk/endpoint& because the URL authority must be lowercase');
//    equal(new SignatureBaseString('', 'HTTP://example.org/endpoint').generate(), '&http://example.org/endpoint',
//        'Should be &http://example.org/endpoint because the URL authority must be lowercase');
//	equal(new SignatureBaseString('', 'http://example.org:80/endpoint').generate(), '&http://example.org/endpoint',
//		'Should be &http://example.org/endpoint because the default port http (80) and https (443) must be excluded');
});