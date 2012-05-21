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
  
  self.refresh timestamp () =
    self.parameters.timestamp (self.timestamp for now ())
  
  self.refresh timestamp ()
  
  self.new nonce () =
    self.parameters.nonce ((Math.floor(Math.random () * 1000000000)).to string ())
  
  self.new nonce ()
  
  self.method options = ko.observable array ['GET', 'POST', 'PUT', 'DELETE']
  self.encoding options = ko.observable array ['application/json', 'application/xml']
  
  self.oauth signature = ko.computed
    oauth signer (self.parameters)
      
  self.signature = {
    query string = ko.computed
      self.oauth signature ().query string ()
      
    base string = ko.computed
      self.oauth signature ().base string ()

    hmac key = ko.computed
      self.oauth signature ().hmac key ()

    base64 signature = ko.computed
      self.oauth signature ().base64 signature ()

    signature = ko.computed
      self.oauth signature ().signature ()
          
    authorization header = ko.computed
      self.oauth signature ().authorization header ()
    
    curl = ko.computed
      self.oauth signature ().curl ()
  }

  undefined

window.oauth page = new (oauth parameters)

ko.apply bindings (oauth page)
