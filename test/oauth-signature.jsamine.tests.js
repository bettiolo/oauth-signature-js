describe("Signature base string generator tests", function() {
    var signatureBaseString = new SignatureBaseString();

    it("should return OK when getting the base string", function() {
        expect(signatureBaseString.generate()).toBe('OK');
    });
});