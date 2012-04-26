browser = require 'zombie'
express = require 'express'

port = 4001

serve directory (dir) over http; port (4000) =
    app = express: create server!
    app: use (express: static (dir))
    
    app: listen (port)

serve directory "#(__dirname)/.." over http; port (port)

describe 'OAuth'
    b = nil

    before
        b = new (browser)

    it 'should' @(done)
        b: visit "http://localhost:#(port)/"
            b: fill 'url' 'http://photos.example.net/photos'
            b: fill 'consumer key' 'dpf43f3p2l4k3l03'
            b: fill 'consumer secret' 'kd94hf93k423kf44'
            b: fill '#token' 'nnch734d00sl2jdk'
            b: fill '#token-secret' 'pfkkdhi9sl3r4s00'
            b: fill 'nonce' 'kllo9940pd9333jh'
            b: fill 'timestamp' '1191242096'
            
            b: press button 'add'
                b: fill '.field-name:last' 'file'
                b: fill '.field-value:last' 'vacation.jpg'
            
                b: press button 'add'
                    b: fill '.field-name:last' 'size'
                    b: fill '.field-value:last' 'original'

                    b: press button 'sign!'
                        (b: text '#query-string'): should: equal "file=vacation.jpg&oauth_consumer_key=dpf43f3p2l4k3l03&oauth_nonce=kllo9940pd9333jh&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1191242096&oauth_token=nnch734d00sl2jdk&oauth_version=1.0&size=original"
                        (b: text '#base-string'): should: equal "GET&http%3A%2F%2Fphotos.example.net%2Fphotos&file%3Dvacation.jpg%26oauth_consumer_key%3Ddpf43f3p2l4k3l03%26oauth_nonce%3Dkllo9940pd9333jh%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1191242096%26oauth_token%3Dnnch734d00sl2jdk%26oauth_version%3D1.0%26size%3Doriginal"
                        (b: field '#hmac-key': value): should: equal "kd94hf93k423kf44&pfkkdhi9sl3r4s00"
                        (b: field '#base64-signature': value): should: equal "tR3+Ty81lMeYAr/Fid0kMTYa/WM="
                        (b: field '#signature': value): should: equal "tR3%2BTy81lMeYAr%2FFid0kMTYa%2FWM%3D"
                        (b: field '#authorization-header': value): should: equal 'oauth_consumer_key="dpf43f3p2l4k3l03", oauth_nonce="kllo9940pd9333jh", oauth_timestamp="1191242096", oauth_signature_method="HMAC-SHA1", oauth_token="nnch734d00sl2jdk", oauth_version="1.0", oauth_signature="tR3%2BTy81lMeYAr%2FFid0kMTYa%2FWM%3D"'
                        (b: field '#curl': value): should: equal "curl 'http://photos.example.net/photos?file=vacation.jpg&oauth_consumer_key=dpf43f3p2l4k3l03&oauth_nonce=kllo9940pd9333jh&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1191242096&oauth_token=nnch734d00sl2jdk&oauth_version=1.0&size=original&oauth_signature=tR3%2BTy81lMeYAr%2FFid0kMTYa%2FWM%3D'"
                    
                        done!
