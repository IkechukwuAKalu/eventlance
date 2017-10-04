# Eventlance

This is a Node.js (`express`) app. It is basically a REST API with no views.

**Note:** The `node_modules` directory was unintentionally pushed and this has caused a huge spike in the file size.

## Security
It uses OAuth2 for requests authentication which are sent via headers. The Node.js module `oauth2orize` is used to implement it, together with the `passport` module. 
Follows the password grant flow, but requests are actually authenticated using access tokens.

## Databse
MongoDB is used for storage.
