var assert = chai.assert;

//describe('HttpMethodElement', function () {
//    it('Converts the http method to uppercase', function () {
//        assert.equal(new oauthSignature.HttpMethodElement('get').get(), 'GET',
//            'A lowercase GET http method should be uppercase');
//        assert.equal(new oauthSignature.HttpMethodElement('pOsT').get(), 'POST',
//            'A mixed case POST http method should be uppercase');
//    });
//});

suite('HttpMethodElement');
test('Converts the http method to uppercase', function () {
    assert.equal(new oauthSignature.HttpMethodElement('get').get(), 'GET',
        'A lowercase GET http method should be uppercase');
    assert.equal(new oauthSignature.HttpMethodElement('pOsT').get(), 'POST',
        'A mixed case POST http method should be uppercase');
});

//module.exports = {
//    'HttpMethodElement': {
//        'Converts the http method to uppercase': {
//            'A lowercase GET http method should be uppercase': function(){
//                assert.equal(new oauthSignature.HttpMethodElement('get').get(), 'GET');
//            }
//        }
//    }
//};