oauth parameters () = =>
  self.timestamp for now () =
    Math.floor ((new (Date ()).get time ()) / 1000)

  fields array = ko.observable array []

  self.parameters = {
    method = ko.observable 'GET'
    url = ko.observable ''
    consumer key = ko.observable ''
    consumer secret = ko.observable ''
    token = ko.observable ''
    token secret = ko.observable ''
    nonce = ko.observable ''
    timestamp = ko.observable ''
    version = ko.observable '1.0'
    body = ko.observable ''
    body encoding = ko.observable 'application/json'
    fields array = ko.observable array ()
    fields = ko.observable
  
    add field () =
      fields array.push {value = ko.observable '', name = ko.observable ''}
  
    fields array = fields array
  
    remove field () =
      fields array.remove (this)

    fields = ko.computed
      f = {}
      for each @(field) in (fields array ())
        f.(field.name ()) = field.value ()

      f
  }
  
  self.signature = {
    query string = ko.observable ''
    base string = ko.observable ''
    hmac key = ko.observable ''
    base64 signature = ko.observable ''
    signature = ko.observable ''
    authorization header = ko.observable ''
    curl = ko.observable ''
  }
  
  self.refresh timestamp () =
    self.parameters.timestamp (self.timestamp for now ())
  
  self.refresh timestamp ()
  
  self.new nonce () =
    self.parameters.nonce ((Math.floor(Math.random () * 1000000000)).to string ())
  
  self.new nonce ()
  
  self.method options = ko.observable array ['GET', 'POST', 'PUT', 'DELETE']
  self.encoding options = ko.observable array ['application/json', 'application/xml']
  
  self.sign () =
    oauth signature = oauth signer (self.parameters)
    
    self.signature.query string (oauth signature.query string ())
    self.signature.base string (oauth signature.base string ())
    self.signature.hmac key (oauth signature.hmac key ())
    self.signature.base64 signature (oauth signature.base64 signature ())
    self.signature.signature (oauth signature.signature ())
    self.signature.authorization header (oauth signature.authorization header ())
    self.signature.curl (oauth signature.curl ())
    
  undefined

window.oauth page = new (oauth parameters)

ko.apply bindings (oauth page)
