function getClientIp(req) {
  
  var ipAddress;
  // Amazon EC2 / Heroku workaround to get real client IP
  var forwardedIpsStr = req.header('x-forwarded-for'); 
  if (forwardedIpsStr) {
    
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // Ensure getting client IP address still works in
    // development environment
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
};

/*
 * GET home page.
 */







exports.index = function(req, res) {
  //res.end('Hello World');  
  res.render('index.ejs', {foo: 'data'}, function (err, result2) {
       console.log('Render result:');
       //console.log(result2);
       res.send(result2); // send rendered HTML back to client
     });
     
};
