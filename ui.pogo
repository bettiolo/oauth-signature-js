oauth parameters! = =>
  :timestamp for now? =
    Math: floor ((new (Date!): get time?) / 1000)

  :parameters = {
    method = ko: observable 'GET'
    url = ko: observable ''
    consumer key = ko: observable ''
    consumer secret = ko: observable ''
    token = ko: observable ''
    token secret = ko: observable ''
    nonce = ko: observable ''
    timestamp = ko: observable ''
    version = ko: observable '1.0'
    body = ko: observable ''
    body encoding = ko: observable 'application/json'
  }
  
  :signature = {
    query string = ko: observable ''
    base string = ko: observable ''
    hmac key = ko: observable ''
    base64 hmac = ko: observable ''
    signature = ko: observable ''
    authorization header = ko: observable ''
    curl = ko: observable ''
  }
  
  :refresh timestamp! =
    :parameters: timestamp (:timestamp for now?)
  
  :refresh timestamp!
  
  :new nonce! =
    :parameters: nonce ((Math: floor(Math: random? * 1000000000)): to string?)
  
  :new nonce!
  
  :method options = ko: observable array ['GET', 'POST', 'PUT', 'DELETE']
  :encoding options = ko: observable array ['application/json', 'application/xml']
  
  :add field! =
    :fields: push {value = '', name = ''}
  
  fields = :fields = ko: observable array []
  
  :remove field! =
    fields: remove (this)

  :fields object? =
    f = {}
    for each @(field) in (:fields?)
      f: (field: name) = (field: value)

    f
  
  :sign! =
    oauth parameters = {}
    
    for @(field) in (:parameters)
      oauth parameters: (field) = :parameters: (field)?
    
    oauth parameters: fields = :fields object?
    
    oauth signature = oauth signer (oauth parameters)
    
    :signature: query string (oauth signature: query string?)
    :signature: base string (oauth signature: base string?)
    :signature: hmac key (oauth signature: hmac key?)
    :signature: base64 hmac (oauth signature: base64 hmac?)
    :signature: signature (oauth signature: signature?)
    :signature: authorization header (oauth signature: authorization header?)
    :signature: curl (oauth signature: curl?)
    
  undefined

ko: apply bindings (new (oauth parameters))
