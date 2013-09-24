module('HttpMethodElement');
test('Should be uppercase', function (){
	equal(new HttpMethodElement('get').get(), 'GET',
		'A lowercase GET http method should be uppercase');
	equal(new HttpMethodElement('pOsT').get(), 'POST',
		'A mixed case POST http method should be uppercase');
});
test('Should handle non-values', function (){
	equal(new HttpMethodElement().get(), '',
		'An undefined http method should be normalized to an empty string');
	equal(new HttpMethodElement('').get(), '',
		'An empty http method should be normalized to an empty string');
	equal(new HttpMethodElement(null).get(), '',
		'A null http method should be normalized to an empty string');
});

module('UrlElement')
test('Should be normalized', function () {
	equal(new UrlElement('http://example.co.uk').get(), 'http://example.co.uk',
		'A valid url should remain the same');
	equal(new UrlElement('http://EXAMPLE.co.UK/endpoint').get(), 'http://example.co.uk/endpoint',
		'The url authority must be lowercase');
	equal(new UrlElement('http://EXAMPLE.co.UK/endpoint/').get(), 'http://example.co.uk/endpoint/',
		'It should not strip off the trailing /');
	equal(new UrlElement('HTTP://example.org').get(), 'http://example.org',
		'The url scheme must be lowercase');
	equal(new UrlElement('http://example.org:80').get(), 'http://example.org',
		'The default http port (80) MUST be excluded');
	equal(new UrlElement('https://example.org:443').get(), 'https://example.org',
		'The default https port (443) MUST be excluded');
	equal(new UrlElement('http://example.org:8080').get(), 'http://example.org:8080',
		'The non default http port MUST be included');
	equal(new UrlElement('https://example.org:8080').get(), 'https://example.org:8080',
		'The non default https port MUST be included');
	equal(new UrlElement('http://example.org/?foo=bar').get(), 'http://example.org/',
		'The query string should not be included');
	equal(new UrlElement('http://example.org/#anchor').get(), 'http://example.org/',
		'The anchor should not be included');
	equal(new UrlElement('example.org').get(), 'http://example.org',
		'The http url scheme is added automatically');
	equal(new UrlElement('example.org:100').get(), 'http://example.org:100',
		'The port will not be stripped if the scheme is missing');
	equal(new UrlElement('example.org:80').get(), 'http://example.org',
		'The default http port will be stripped if the scheme is missing');
});
test('Should handle non-values', function () {
	equal(new UrlElement().get(), '',
		'An undefined url should be normalized to an empty string');
	equal(new UrlElement('').get(), '',
		'An empty url should be normalized to an empty string');
	equal(new UrlElement(null).get(), '',
		'An null url should be normalized to an empty string');
});

module('ParametersLoader') // Output format: { 'key': ['value 1', 'value 2'] }
test('Should load parameters from different input structures', function () {
	var objectLikeInput =
		{
			a : 'b',
			foo : [ 'bar', 'baz', 'qux' ]
		},
		arrayLikeInput =
		[
			{ a : 'b'},
			{ foo : 'bar' },
			{ foo : ['baz', 'qux'] }
		],
		expectedOutput =
		{
			a : [ 'b' ],
			foo : [ 'bar', 'baz', 'qux' ]
		};
	deepEqual(new ParametersLoader(objectLikeInput).get(), expectedOutput,
		'An object-like structure should be loaded');
	deepEqual(new ParametersLoader(arrayLikeInput).get(), expectedOutput,
		'An array-like structure should be loaded');
	deepEqual(new ParametersLoader( { a : null }).get(), { a : [ '' ] },
		'An object-like structure with an empty property should maintain the property');
	deepEqual(new ParametersLoader( { a : [ ] }).get(), { a : [ '' ] },
		'An object-like structure with an empty array property should maintain the property');
	deepEqual(new ParametersLoader( [ { a : null } ]).get(), { a : [ '' ] },
		'An array-like structure with an empty property should maintain the property');
	deepEqual(new ParametersLoader( [ { a : [ ] } ]).get(), { a : [ '' ] },
		'An array-like structure with an empty array property should maintain the property');
});
test('Should handle non-values', function () {
	deepEqual(new ParametersLoader().get(), { },
		'An undefined parameter should be returned as an empty object');
	deepEqual(new ParametersLoader('').get(), { },
		'An empty string parameter should be returned as an empty object');
	deepEqual(new ParametersLoader(null).get(), { },
		'An null parameter should be returned as an empty object');
	deepEqual(new ParametersLoader({ }).get(), { },
		'An empty object-like parameter should be returned as an empty object');
	deepEqual(new ParametersLoader([ ]).get(), { },
		'An empty array-like parameter should be returned as an empty object');
});

module('ParametersElement');
test('Should sort and concatenate the parameters', function () {
	var orderByName =
		{
			foo : [ 'ß', 'bar'],
			baz : [ 'qux' ],
			a : [ '' ]
		},
		orderByNameAndValue =
		{
			c : [ 'hi there' ],
			z : [ 't', 'p' ],
			f : [ 'a', '50', '25' ],
			a : [ '1' ]
		};
	equal(new ParametersElement(orderByName).get(), 'a=&baz=qux&foo=bar&foo=%C3%9F',
		'The parameters should be concatenated alphabetically by name');
	equal(new ParametersElement(orderByNameAndValue).get(), 'a=1&c=hi%20there&f=25&f=50&f=a&z=p&z=t',
		'The parameters should be ordered alphabetically by name and value');
});
test('Should handle non-values', function () {
	equal(new ParametersElement().get(), '',
		'An undefined input should be returned as an empty string');
	equal(new ParametersElement('').get(), '',
		'An empty string input should be returned as an empty string');
	equal(new ParametersElement(null).get(), '',
		'A null input should be returned as an empty string');
	equal(new ParametersElement({ }).get(), '',
		'An empty object input should be returned as an empty string');
});

module('Rfc3986 Encoding');
test('The value should be encoded following the RFC3986', function () {
	var i,
		unreservedCharacters =  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
								'abcdefghijklmnopqrstuvwxyz' +
								'0123456789-_.~',
		reservedCharactersWithEncoding =[
			['!', '%21'], ['#', '%23'], ['$', '%24'], ['&', '%26'],	['\'', '%27'],
			['(', '%28'], [')', '%29'], ['*', '%2A'], ['+', '%2B'], [',', '%2C'],
			['/', '%2F'], [':', '%3A'], [';', '%3B'], ['=', '%3D'], ['?', '%3F'],
			['@', '%40'], ['[', '%5B'], [']', '%5D']
		];
	equal(new Rfc3986().encode(unreservedCharacters), unreservedCharacters,
		'Characters in the unreserved character set MUST NOT be encoded');
	equal(new Rfc3986().encode('*'), '%2A',
		'Hexadecimal characters in the encodings MUST be uppercase using the percent-encoding (%xx)');
	for (i = 0; i < reservedCharactersWithEncoding.length; i++) {
		equal(new Rfc3986().encode(reservedCharactersWithEncoding[i][0]), reservedCharactersWithEncoding[i][1],
			'Characters not in the unreserved character set MUST be encoded');
	}
	equal(new Rfc3986().encode('%'), '%25',
		'Percent character must be encoded');
});
test('The value containing UTF8 characters should be encoded following the RFC3629', function () {
	equal(new Rfc3986().encode('åçñ'), '%C3%A5%C3%A7%C3%B1',
		'Value MUST be encoded as UTF-8 octets before percent-encoding them');
	equal(new Rfc3986().encode('你好'), '%E4%BD%A0%E5%A5%BD',
		'Value MUST be encoded as UTF-8 octets before percent-encoding them');
});
test('Should handle non-values', function () {
	equal(new Rfc3986().encode(), '',
		'Undefined value should return empty string');
	equal(new Rfc3986().encode(''), '',
		'Empty value should return empty string');
	equal(new Rfc3986().encode(null), '',
		'Null value should return empty string');
});

module('Rfc3986 Decoding');
test('The value should be decoded following the RFC3986', function () {
	var i,
		unreservedCharacters =  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
								'abcdefghijklmnopqrstuvwxyz' +
								'0123456789-_.~',
		reservedCharactersWithEncoding =[
			['!', '%21'], ['#', '%23'], ['$', '%24'], ['&', '%26'],	['\'', '%27'],
			['(', '%28'], [')', '%29'], ['*', '%2A'], ['+', '%2B'], [',', '%2C'],
			['/', '%2F'], [':', '%3A'], [';', '%3B'], ['=', '%3D'], ['?', '%3F'],
			['@', '%40'], ['[', '%5B'], [']', '%5D']
		];
	equal(new Rfc3986().decode(unreservedCharacters), unreservedCharacters,
		'Not encoded characters in the unreserved character set MUST NOT be decoded');
	for (i = 0; i < reservedCharactersWithEncoding.length; i++) {
		equal(new Rfc3986().decode(reservedCharactersWithEncoding[i][1]), reservedCharactersWithEncoding[i][0],
			'Encoded characters not in the unreserved character set MUST be decoded');
	}
	equal(new Rfc3986().decode('%25'), '%',
		'Encoded percent character must be decoded');
	equal(new Rfc3986().decode('%31%32%33%41%42%43'), '123ABC',
		'Encoded unreserved characters must be decoded');
});
test('The value containing encoded UTF8 characters should be decoded following the RFC3629', function () {
	equal(new Rfc3986().decode('%C3%A5%C3%A7%C3%B1'), 'åçñ',
		'Value MUST be percent-decoded to get UTF-8 octets');
	equal(new Rfc3986().decode('%E4%BD%A0%E5%A5%BD'), '你好',
		'Value MUST be percent-decoded to get UTF-8 octets');
});
test('Should handle non-values', function () {
	equal(new Rfc3986().decode(), '',
		'Undefined value should return empty string');
	equal(new Rfc3986().decode(''), '',
		'Empty value should return empty string');
	equal(new Rfc3986().decode(null), '',
		'Null value should return empty string');
});

module('SignatureBaseString');
test('It should start with an uppercase http method, followed by two ampersands', function () {
	equal(new SignatureBaseString('get').generate(), 'GET&&',
		'The element separator (&) should be included for omitted elements');
	equal(new SignatureBaseString('pOsT').generate(), 'POST&&',
		'The element separator (&) should be included for omitted elements');
});
test('The encoded url should be included in the second element after the http method and should be suffixed by an ampersand', function () {
	equal(new SignatureBaseString('GET', 'http://example.co.uk').generate(), 'GET&http%3A%2F%2Fexample.co.uk&',
		'The http method should be the first component of the url');
	equal(new SignatureBaseString('', 'http://EXAMPLE.co.UK/endpoint').generate(), '&http%3A%2F%2Fexample.co.uk%2Fendpoint&',
		'The url authority must be lowercase');
    equal(new SignatureBaseString('', 'http://EXAMPLE.co.UK/endpoint/').generate(), '&http%3A%2F%2Fexample.co.uk%2Fendpoint%2F&',
		'It should not strip off the trailing /');
    equal(new SignatureBaseString('', 'HTTP://example.org').generate(), '&http%3A%2F%2Fexample.org&',
        'The url scheme must be lowercase');
    equal(new SignatureBaseString('', 'http://example.org:80').generate(), '&http%3A%2F%2Fexample.org&',
		'The default http port (80) MUST be excluded');
    equal(new SignatureBaseString('', 'https://example.org:443').generate(), '&https%3A%2F%2Fexample.org&',
        'The default https port (443) MUST be excluded');
    equal(new SignatureBaseString('', 'http://example.org:8080').generate(), '&http%3A%2F%2Fexample.org%3A8080&',
        'The non default http port MUST be included');
    equal(new SignatureBaseString('', 'https://example.org:8080').generate(), '&https%3A%2F%2Fexample.org%3A8080&',
        'The non default https port MUST be included');
    equal(new SignatureBaseString('GET', 'http://example.org/?foo=bar').generate(), 'GET&http%3A%2F%2Fexample.org%2F&',
        'The query string should not be included');
    equal(new SignatureBaseString('GET', 'http://example.org/#anchor').generate(), 'GET&http%3A%2F%2Fexample.org%2F&',
        'The anchor should not be included');
	equal(new SignatureBaseString('', 'example.org').generate(), '&http%3A%2F%2Fexample.org&',
		'The http url scheme is added automatically');
	equal(new SignatureBaseString('', 'example.org:100').generate(), '&http%3A%2F%2Fexample.org%3A100&',
		'The port will not be stripped if the scheme is missing');
	equal(new SignatureBaseString('', 'example.org:80').generate(), '&http%3A%2F%2Fexample.org&',
		'The default http port will be stripped if the scheme is missing');
});
test('The normalized request parameters should be the last element', function () {
	equal(new SignatureBaseString('', '', { foo : 'bar' }).generate(), '&&foo%3Dbar',
		'The parameter should be appended');
	equal(new SignatureBaseString('', '', { foo : 'bar', baz : 'qux' }).generate(), '&&baz%3Dqux%26foo%3Dbar',
		'The parameters specified with object initializer should be ordered alphabetically');
	equal(new SignatureBaseString('', '', [{ foo : 'bar' }, { baz : 'qux' }]).generate(), '&&baz%3Dqux%26foo%3Dbar',
		'The parameter specified with an array of objects should be ordered alphabetically');
	equal(new SignatureBaseString('', '', [{ foo : 'qux' }, { foo : 'bar'}, {foo : 'baz' }, { a : 'b' }]).generate(), '&&a%3Db%26foo%3Dbar%26foo%3Dbaz%26foo%3Dqux',
		'The parameter specified with an array of objects with the same key should be ordered alphabetically by value');
	equal(new SignatureBaseString('', '', [{ foo : [ 'qux', 'bar', 'baz' ]}, { a : 'b' }]).generate(), '&&a%3Db%26foo%3Dbar%26foo%3Dbaz%26foo%3Dqux',
		'The parameter specified with an array of objects with an array of values for the same key should be ordered alphabetically by value');
	equal(new SignatureBaseString('', '', { foo : [ 'qux', 'bar', 'baz'], a : 'b' }).generate(), '&&a%3Db%26foo%3Dbar%26foo%3Dbaz%26foo%3Dqux',
		'The array of values for a single key should be ordered alphabetically by value');
	equal(new SignatureBaseString('', '', [{ z : 't' }, { z : 'p'}, { f : 'a' }, { f : 50 }, { f : '25' }, { c : 'hi there' }, { a : 1 }]).generate(), '&&a%3D1%26c%3Dhi%2520there%26f%3D25%26f%3D50%26f%3Da%26z%3Dp%26z%3Dt',
		'The parameter specified with an array of objects with the same key should be ordered alphabetically by value');
});
test('Should handle non-values', function () {
	equal(new SignatureBaseString().generate(), '&&',
		'The http method shouldn\'t be included if it is undefined');
	equal(new SignatureBaseString('').generate(), '&&',
		'The http method shouldn\'t be included if it is empty');
	equal(new SignatureBaseString(null).generate(), '&&',
		'The http method shouldn\'t be included if it is null');
	equal(new SignatureBaseString('', '').generate(), '&&',
		'The resource url should not be included if it is empty');
	equal(new SignatureBaseString('', null).generate(), '&&',
		'The resource url should not be included if it is null');
	equal(new SignatureBaseString('', '', '').generate(), '&&',
		'The request parameters should not be included if it is empty');
	equal(new SignatureBaseString('', '', null).generate(), '&&',
		'The request parameters should not be included if it is null');
});