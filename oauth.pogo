window.oauth signer = oauth signer (parameters) = _.extend {
  token () = ""
  token secret () = ""
  version () = "1.0"
  signature method () = 'HMAC-SHA1'
  method () = 'GET'
  timestamp () = Math.floor (new (Date ()).get time () / 1000)
  fields () = {}
  
  oauth parameters () =
    query fields = {
      "oauth_consumer_key" = self.consumer key ()
      "oauth_nonce" = self.nonce ()
      "oauth_timestamp" = self.timestamp ()
      "oauth_signature_method" = self.signature method ()
    }
  
    if (self.token ())
      query fields."oauth_token" = self.token ()

    if (self.version ())
      query fields."oauth_version" = self.version ()
    
    query fields
  
  query string fields () =
    query fields = self.oauth parameters ()

    fields = self.fields ()

    _.each (_.keys (fields)) @(field)
      query fields.(field) = fields.(field)

    query fields

  query string () =
    query arguments = self.query string fields ()
    ordered fields = _.keys (query arguments).sort ()
    _.map (ordered fields) @(field name)
      field name + "=" + self.percent encode (query arguments.(field name))
    .join "&"

  url encoded (fields) =
    _.map (_.keys (fields)) @(field name)
      field name + "=" + encode URI component (fields.(field name))
    .join '&'

  header encoded (fields) =
    _.map (_.keys (fields)) @(field name)
      field name + '="' + encode URI component (fields.(field name)) + '"'
    .join ', '

  url encoded fields () = self.url encoded (self.fields ())
  
  authorization header () =
    fields = self.oauth parameters ()
    fields."oauth_signature" = self.base64 signature ()
    self.header encoded (fields)
  
  url and fields () =
    encoded fields = self.url encoded fields ()
    
    if (encoded fields)
      "#(self.url ())?#(encoded fields)"
    else
      "#(self.url ())"

  parameter encoded (fields) =
    _.map (fields) @(field)
      self.percent encode (field)
    .join '&'

  base string () =
    self.parameter encoded [self.method (), self.url (), self.query string ()]

  hmac key () =
    self.parameter encoded [self.consumer secret (), self.token secret ()]
  
  hmac (encoding: 'binary') =
    if (typeof (process) != 'undefined')
      crypto = require 'crypto'
      h = crypto.create hmac 'sha1' (self.hmac key ())
      h.update (self.base string ())
      h.digest (encoding)
    else
      binary = Crypto.HMAC (Crypto.SHA1, self.base string () , self.hmac key (), as bytes: true)
    
      if (encoding == 'base64')
        Crypto.util.bytes to base64 (binary)
      else
        binary

  base64 signature () = self.hmac (encoding: 'base64')

  signature () =
    self.percent encode (self.base64 signature ())

  
  
  curl () =
    if (self.method () == "GET")
      "curl '#(self.url ())?#(self.query string ())&oauth_signature=#(self.signature ())'"
    else if ((self.method () == 'POST') || (self.method () == 'PUT'))
      if (self.body ())
        "curl -X #(self.method ()) '#(self.url and fields ())' -d '#(self.body ())' -H 'Authorization: #(self.authorization header ())' -H 'Content-Type: #(self.body encoding ())'"
      else
        "curl -X #(self.method ()) '#(self.url ())' -d '#(self.query string ())&oauth_signature=#(self.signature ())'"
    else
      "curl -X DELETE '#(self.url ())?#(self.query string ())&oauth_signature=#(self.signature ())'"

  percent encode (s) =
    encode URI component (s).replace r/\*/g '%2A'
  
  print () =
    console.log ('query string:', self.query string ())
    console.log ('base string:', self.base string ())
    console.log ('hmac key:', self.hmac key ())
    console.log ('hmac:', self.hmac ())
    console.log ('base64 signature:', self.base64 signature ())
    console.log ('signature:', self.signature ())
} (parameters)

oauth sample () =
  oauth signer {
    url () = 'http://photos.example.net/photos'
    consumer secret () = "kd94hf93k423kf44"
    token () = "nnch734d00sl2jdk"
    token secret () = "pfkkdhi9sl3r4s00"
    consumer key () = "dpf43f3p2l4k3l03"
    nonce () = 'kllo9940pd9333jh'
    timestamp () = 1191242096
    fields () = {
      file = 'vacation.jpg'
      size = 'original'
    }
  }.print ()
