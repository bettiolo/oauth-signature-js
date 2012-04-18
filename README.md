# OAuth 1.0 Reference Page

A HTML page that computes an OAuth 1.0 signature, showing all the workings so you can debug your own implementation.

[http://7digital.github.com/oauth-reference-page](http://7digital.github.com/oauth-reference-page)

## POST Support

It supports POSTs in the form of `application/x-www-form-urlencoded`, as well as POSTs of `application/xml` and `application/json` using the `Authorization` header - just put the XML or JSON into the 'body' field and set the 'body encoding' accordingly.
