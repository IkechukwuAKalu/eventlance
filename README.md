# Eventlance

This is freelancing app built using Node.js and MongoDB. It is basically just a REST API with no views added to it yet. 

## Security
It uses OAuth2 for requests authentication. The Node.js module `oauth2orize` is used to implement it, together with the `passport` module. 
Follows the password grant flow, but requests are actually authenticated using access tokens.

Feel free to contact me incase of any issues