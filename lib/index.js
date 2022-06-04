


(function () {
    'use strict';

    const qs = require('qs');
    const querystring = require('querystring');

    const applicationJSON = 'application/json'
    const applicationFormUrlEncoded = 'application/x-www-form-urlencoded'

    function Parsa() {}

    Parsa.prototype.urlencoded = function (options){
        return function(req, res, next){
            if(req.headers['content-type'] === applicationFormUrlEncoded){

                if(req.headers['content-length'] > 1 * 1024 * 1024){
                    return next(new Error(`payload size is larger than 1mb`))
                }

                req.setEncoding('utf8');
                req.query = Object.create(null);
                let data = "";
    
                req.on('data', function(chunk){
                    data += chunk
                })
    
                req.on('end', function() {
                    if(options.extended){
                        //options.extendedOptions provide qs settings to Uploada
                        req.query = qs.parse(data, options.extendedOptions)
                    }else{
                        req.query = querystring.parse(data);
                    }
                    console.log(req.query)
                    next()
                });
    
                req.on('error', (err) => {
                    next(err);
                })
            }else{
                next()
            }
            
        }
    }

    Parsa.prototype.json = function(){
        return function (req , res, next) {

            req.setEncoding('utf8')
            req.body = Object.create(null);

            if(req.headers['content-length'] > 1 * 1024 * 1024){
                return next(new Error(`payload size is larger than 1mb`))
            }

            if (req.headers['content-type'] === applicationJSON) {
                let data = '';
                req.on('data', (chunk) => {
                    data += chunk;
                })
    
                req.on('error', (err) => {
                    return next(err)
                })
    
                req.on('end', () => {
                    req.body = JSON.parse(data);
                   return next()
                })
            }else{ 
                next()
            }
        }
    }

    module.exports =  new Parsa();

}())


