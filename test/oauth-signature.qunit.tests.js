module('Oauth Signature');
test('Signature base string generator', function() {
    var signatureBaseString = new SignatureBaseString();


    equal(signatureBaseString.generate(), 'OK', 'The get method returns OK');

});