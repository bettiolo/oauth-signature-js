window: oauth signer = oauth signer (parameters) = _: extend {
  token = ""
  token secret = ""
  version = "1.0"
  signature method = 'HMAC-SHA1'
  method = 'GET'
  timestamp = Math: floor (new (Date!): get time? / 1000)
  fields = {}
  
  oauth parameters? =
    query fields = {
      "oauth_consumer_key" = :consumer key
      "oauth_nonce" = :nonce
      "oauth_timestamp" = :timestamp
      "oauth_signature_method" = :signature method
    }
  
    if (:token)
      query fields: "oauth_token" = :token

    if (:version)
      query fields: "oauth_version" = :version
    
    query fields
  
  query string fields? =
    query fields = :oauth parameters?

    _: each (_: keys (:fields)) @(field)
      query fields: (field) = :fields: (field)

    query fields

  query string? =
    query arguments = :query string fields?
    ordered fields = _: keys (query arguments): sort!
    _: map (ordered fields) @(field name)
      field name + "=" + :percent encode (query arguments: (field name))
    : join "&"

  url encoded (fields) =
    _: map (_: keys (fields)) @(field name)
      field name + "=" + encode URI component (fields: (field name))
    : join '&'

  header encoded (fields) =
    _: map (_: keys (fields)) @(field name)
      field name + '="' + encode URI component (fields: (field name)) + '"'
    : join ', '

  url encoded fields? = :url encoded (:fields)
  
  authorization header? =
    fields = :oauth parameters?
    fields: "oauth_signature" = :signature?
    :header encoded (fields)
  
  url and fields? =
    encoded fields = :url encoded fields?
    
    if (encoded fields)
      "#(:url)?#(encoded fields)"
    else
      "#(:url)"

  parameter encoded (fields) =
    _: map (fields) @(field)
      :percent encode (field)
    : join '&'

  base string? =
    :parameter encoded [:method, :url, :query string?]

  hmac key? =
    :parameter encoded [:consumer secret, :token secret]
  
  hmac; encoding 'binary' =
    if (typeof (process) != 'undefined')
      crypto = require 'crypto'
      h = crypto: create hmac 'sha1' (:hmac key?)
      h: update (:base string?)
      h: digest (encoding)
    else
      binary = Crypto: HMAC (Crypto: SHA1, :base string? , :hmac key?); as bytes
    
      if (encoding == 'base64')
        Crypto: util: bytes to base64 (binary)
      else
        binary

  base64 hmac? = :hmac; encoding 'base64'

  signature? =
    :percent encode (:base64 hmac?)

  
  
  curl? =
    if (:method == "GET")
      "curl '#(:url)?#(:query string?)&oauth_signature=#(:signature?)'"
    else if ((:method == 'POST') || (:method == 'PUT'))
      if (:body)
        "body '#(:body)'"
        "curl -X #(:method) '#(:url and fields?)' -d '#(:body)' -H 'Authorization: #(:authorization header?)' -H 'Content-Type: #(:body encoding)'"
      else
        "curl -X #(:method) '#(:url)' -d #(:query string?)&oauth_signature=#(:signature?)'"
    else
      "curl -X DELETE '#(:url)?#(:query string?)&oauth_signature=#(:signature?)'"

  percent encode (s) =
    encode URI component (s): replace `\*`g '%2A'
  
  print! =
    console: log ('query string:', :query string?)
    console: log ('base string:', :base string?)
    console: log ('hmac key:', :hmac key?)
    console: log ('hmac:', :hmac?)
    console: log ('base64 hmac:', :base64 hmac?)
    console: log ('signature:', :signature?)
} (parameters)

oauth sample! =
  oauth signer {
    url = 'http://photos.example.net/photos'
    consumer secret = "kd94hf93k423kf44"
    token = "nnch734d00sl2jdk"
    token secret = "pfkkdhi9sl3r4s00"
    consumer key = "dpf43f3p2l4k3l03"
    nonce = 'kllo9940pd9333jh'
    timestamp = 1191242096
    fields = {
      file = 'vacation.jpg'
      size = 'original'
    }
  }: print!
