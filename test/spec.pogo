browser = require 'zombie'
express = require 'express'

port = 4001

serve directory (dir) over http (port: 4000) =
    app = express.create server ()
    app.use (express.static (dir))
    
    app.listen (port)

serve directory "#(__dirname)/.." over http (port: port)

object (o) as array =
    a = []
    
    for @(field) in (o)
        if (o.has own property (field))
            a.push {name = field, value = o.(field)}
    
    a

describe 'OAuth'
    b = nil

    before
        b = new (browser)

    oauth parameters (params) should produce (results) (done) =
        b.visit "http://localhost:#(port)/"
            b.fill 'url' (params.url)
            b.select 'method' (params.method || 'GET')
            b.fill 'consumer key' (params.consumer key)
            b.fill 'consumer secret' (params.consumer secret)
            b.fill '#token' (params.token)
            b.fill '#token-secret' (params.token secret)
            b.fill 'nonce' (params.nonce)
            b.fill 'timestamp' (params.timestamp)
            
            if (params.body)
                b.fill '#body' (params.body)
                
            if (params.body encoding)
                b.select 'body encoding' (params.body encoding)
            
            add field (name, value, then) =
                b.press button 'add'
                    b.fill '.field-name:last' (name)
                    b.fill '.field-value:last' (value)
                    
                    then ()
            
            sign (then) =
                b.press button 'sign!'
                    (b.text '#query-string').should.equal (results.query string)
                    (b.text '#base-string').should.equal (results.base string)
                    (b.field '#hmac-key'.value).should.equal (results.hmac key)
                    (b.field '#base64-signature'.value).should.equal (results.base64 signature)
                    (b.field '#signature'.value).should.equal (results.signature)
                    (b.field '#authorization-header'.value).should.equal (results.authorization header)
                    (b.field '#curl'.value).should.equal (results.curl)
            
                    then ()
            
            add fields (fields, then) =
                if (fields.length > 0)
                    field = fields.pop ()
                
                    add field (field.name, field.value)
                        add fields (fields, then)
                else
                    then ()

            add fields (object (params.fields) as array)
                sign (done)

    it 'produces the OAuth 1.0a reference sample' @(done)
        oauth parameters {
            url 'http://photos.example.net/photos'
            consumer key 'dpf43f3p2l4k3l03'
            consumer secret 'kd94hf93k423kf44'
            token 'nnch734d00sl2jdk'
            token secret 'pfkkdhi9sl3r4s00'
            nonce 'kllo9940pd9333jh'
            timestamp '1191242096'
            fields = {
                file 'vacation.jpg'
                size 'original'
            }
        } should produce {
            query string "file=vacation.jpg&oauth_consumer_key=dpf43f3p2l4k3l03&oauth_nonce=kllo9940pd9333jh&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1191242096&oauth_token=nnch734d00sl2jdk&oauth_version=1.0&size=original"
            base string "GET&http%3A%2F%2Fphotos.example.net%2Fphotos&file%3Dvacation.jpg%26oauth_consumer_key%3Ddpf43f3p2l4k3l03%26oauth_nonce%3Dkllo9940pd9333jh%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1191242096%26oauth_token%3Dnnch734d00sl2jdk%26oauth_version%3D1.0%26size%3Doriginal"
            hmac key "kd94hf93k423kf44&pfkkdhi9sl3r4s00"
            base64 signature "tR3+Ty81lMeYAr/Fid0kMTYa/WM="
            signature "tR3%2BTy81lMeYAr%2FFid0kMTYa%2FWM%3D"
            authorization header 'oauth_consumer_key="dpf43f3p2l4k3l03", oauth_nonce="kllo9940pd9333jh", oauth_timestamp="1191242096", oauth_signature_method="HMAC-SHA1", oauth_token="nnch734d00sl2jdk", oauth_version="1.0", oauth_signature="tR3%2BTy81lMeYAr%2FFid0kMTYa%2FWM%3D"'
            curl "curl 'http://photos.example.net/photos?file=vacation.jpg&oauth_consumer_key=dpf43f3p2l4k3l03&oauth_nonce=kllo9940pd9333jh&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1191242096&oauth_token=nnch734d00sl2jdk&oauth_version=1.0&size=original&oauth_signature=tR3%2BTy81lMeYAr%2FFid0kMTYa%2FWM%3D'"
        } (done)


    it 'signs signed POST for application/x-www-form-urlencoded' @(done)
        oauth parameters {
            url 'http://photos.example.net/photos'
            method 'POST'
            consumer key 'dpf43f3p2l4k3l03'
            consumer secret 'kd94hf93k423kf44'
            token 'nnch734d00sl2jdk'
            token secret 'pfkkdhi9sl3r4s00'
            nonce 'kllo9940pd9333jh'
            timestamp '1191242096'
            fields = {
                file 'vacation.jpg'
                size 'original'
            }
        } should produce {
            query string "file=vacation.jpg&oauth_consumer_key=dpf43f3p2l4k3l03&oauth_nonce=kllo9940pd9333jh&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1191242096&oauth_token=nnch734d00sl2jdk&oauth_version=1.0&size=original"
            base string "POST&http%3A%2F%2Fphotos.example.net%2Fphotos&file%3Dvacation.jpg%26oauth_consumer_key%3Ddpf43f3p2l4k3l03%26oauth_nonce%3Dkllo9940pd9333jh%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1191242096%26oauth_token%3Dnnch734d00sl2jdk%26oauth_version%3D1.0%26size%3Doriginal"
            hmac key "kd94hf93k423kf44&pfkkdhi9sl3r4s00"
            base64 signature "wPkvxykrw+BTdCcGqKr+3I+PsiM="
            signature "wPkvxykrw%2BBTdCcGqKr%2B3I%2BPsiM%3D"
            authorization header 'oauth_consumer_key="dpf43f3p2l4k3l03", oauth_nonce="kllo9940pd9333jh", oauth_timestamp="1191242096", oauth_signature_method="HMAC-SHA1", oauth_token="nnch734d00sl2jdk", oauth_version="1.0", oauth_signature="wPkvxykrw%2BBTdCcGqKr%2B3I%2BPsiM%3D"'
            curl "curl -X POST 'http://photos.example.net/photos' -d 'file=vacation.jpg&oauth_consumer_key=dpf43f3p2l4k3l03&oauth_nonce=kllo9940pd9333jh&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1191242096&oauth_token=nnch734d00sl2jdk&oauth_version=1.0&size=original&oauth_signature=wPkvxykrw%2BBTdCcGqKr%2B3I%2BPsiM%3D'"
        } (done)

    it 'signs signed POST for application/json' @(done)
        oauth parameters {
            url 'http://photos.example.net/photos'
            method 'POST'
            consumer key 'dpf43f3p2l4k3l03'
            consumer secret 'kd94hf93k423kf44'
            token 'nnch734d00sl2jdk'
            token secret 'pfkkdhi9sl3r4s00'
            nonce 'kllo9940pd9333jh'
            timestamp '1191242096'
            fields {
                file 'vacation.jpg'
                size 'original'
            }
            body '{"x": "eks", "y": "why"}'
            body encoding 'application/json'
        } should produce {
            query string "file=vacation.jpg&oauth_consumer_key=dpf43f3p2l4k3l03&oauth_nonce=kllo9940pd9333jh&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1191242096&oauth_token=nnch734d00sl2jdk&oauth_version=1.0&size=original"
            base string "POST&http%3A%2F%2Fphotos.example.net%2Fphotos&file%3Dvacation.jpg%26oauth_consumer_key%3Ddpf43f3p2l4k3l03%26oauth_nonce%3Dkllo9940pd9333jh%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1191242096%26oauth_token%3Dnnch734d00sl2jdk%26oauth_version%3D1.0%26size%3Doriginal"
            hmac key "kd94hf93k423kf44&pfkkdhi9sl3r4s00"
            base64 signature "wPkvxykrw+BTdCcGqKr+3I+PsiM="
            signature "wPkvxykrw%2BBTdCcGqKr%2B3I%2BPsiM%3D"
            authorization header 'oauth_consumer_key="dpf43f3p2l4k3l03", oauth_nonce="kllo9940pd9333jh", oauth_timestamp="1191242096", oauth_signature_method="HMAC-SHA1", oauth_token="nnch734d00sl2jdk", oauth_version="1.0", oauth_signature="wPkvxykrw%2BBTdCcGqKr%2B3I%2BPsiM%3D"'
            curl "curl -X POST 'http://photos.example.net/photos?size=original&file=vacation.jpg' -d '{\"x\": \"eks\", \"y\": \"why\"}' -H 'Authorization: oauth_consumer_key=\"dpf43f3p2l4k3l03\", oauth_nonce=\"kllo9940pd9333jh\", oauth_timestamp=\"1191242096\", oauth_signature_method=\"HMAC-SHA1\", oauth_token=\"nnch734d00sl2jdk\", oauth_version=\"1.0\", oauth_signature=\"wPkvxykrw%2BBTdCcGqKr%2B3I%2BPsiM%3D\"' -H 'Content-Type: application/json'"
        } (done)
