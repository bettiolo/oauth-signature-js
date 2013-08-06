describe("Signature base string generator tests", function() {
    var signatureBaseStringGenerator = new SignatureBaseStringGenerator();

    it("should return OK when getting the base string", function() {
        expect(signatureBaseStringGenerator.get()).toBe('OK');
    });
});