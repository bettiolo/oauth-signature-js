module('Oauth Signature');
test('Signature base string generator', function() {
    var signatureBaseStringGenerator = new SignatureBaseStringGenerator();

    equal(signatureBaseStringGenerator.get(), 'OK', 'The get method returns OK');
});