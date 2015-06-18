define({ "api": [  {    "type": "post",    "url": "/api/auth",    "title": "Login",    "name": "Login",    "group": "Auth",    "description": "<p>Authenticates the user and returns the auth token. The token is also saved to a Redis store so it can be revoked at any time.</p> ",    "examples": [      {        "title": "Example usage:",        "content": "curl -4 -i -X POST http://localhost:9000/api/auth --data \"username=demo&password=demo\"",        "type": "json"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": false,            "field": "username",            "description": "<p>User name.</p> "          },          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": false,            "field": "password",            "description": "<p>User password.</p> "          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "id",            "description": "<p>User id.</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "username",            "description": "<p>Username.</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "email",            "description": "<p>User email.</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "token",            "description": "<p>JWT.</p> "          },          {            "group": "Success 200",            "type": "<p>Number</p> ",            "optional": false,            "field": "token_exp",            "description": "<p>Token expiry date (Unix time).</p> "          },          {            "group": "Success 200",            "type": "<p>Number</p> ",            "optional": false,            "field": "token_iat",            "description": "<p>Token issue date (Unix time).</p> "          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\" : {\n    \"id\": \"54ee6175465eaee35cd237ed\",\n    \"username\": \"demo\",\n    \"email\": \"demo@demo.demo\",\n    \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTQ0ODYsImV4cCI6MTQyNzgxODA4Nn0.pZVBE_GKvJUr4BI7BDeTmIIy9gQ2p3tlrG2pcMcjm3U\",\n    \"token_exp\": 1427818086,\n    \"token_iat\": 1427814486\n  }\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "401": [          {            "group": "401",            "type": "<p>Boolean</p> ",            "optional": false,            "field": "error",            "description": "<p>Error.</p> "          },          {            "group": "401",            "type": "<p>Number</p> ",            "optional": false,            "field": "errorCode",            "description": "<p>Error code.</p> "          },          {            "group": "401",            "type": "<p>String</p> ",            "optional": false,            "field": "message",            "description": "<p>Error description.</p> "          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": {\n    \"code\": \"401\",\n    \"message\": \"Invalid username or password\"\n  }\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/modules/api/routes/_auth.js",    "groupTitle": "Auth"  },  {    "type": "delete",    "url": "/api/auth/{token}",    "title": "Logout",    "name": "Logout",    "group": "Auth",    "description": "<p>Deauthenticates the user by invalidating the token.</p> ",    "examples": [      {        "title": "Example usage:",        "content": "curl -4 -i -X DELETE http://localhost:9000/api/auth/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8 --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",        "type": "json"      }    ],    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Auth. header containing the token.</p> "          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "message",            "description": "<p>Logout success message.</p> "          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\" : {\n    \"message\": \"User has been successfully logged out\"\n  }\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "401": [          {            "group": "401",            "type": "<p>Boolean</p> ",            "optional": false,            "field": "error",            "description": "<p>Error.</p> "          },          {            "group": "401",            "type": "<p>Number</p> ",            "optional": false,            "field": "errorCode",            "description": "<p>Error code.</p> "          },          {            "group": "401",            "type": "<p>String</p> ",            "optional": false,            "field": "message",            "description": "<p>Error description.</p> "          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": {\n    \"code\": \"401\",\n    \"message\": \"invalid_token\"\n  }\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/modules/api/routes/_auth.js",    "groupTitle": "Auth"  },  {    "type": "put",    "url": "/api/auth/:token",    "title": "Token renewal",    "name": "TokenRenew",    "group": "Auth",    "description": "<p>Creates a new token with a new expiry date without requiring the user to send again its credentials.</p> ",    "examples": [      {        "title": "Example usage:",        "content": "curl -4 -i -X PUT http://localhost:9000/api/auth/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8 --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",        "type": "json"      }    ],    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Auth. header containing the token.</p> "          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "id",            "description": "<p>User id.</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "username",            "description": "<p>Username.</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "email",            "description": "<p>User email.</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "token",            "description": "<p>JWT.</p> "          },          {            "group": "Success 200",            "type": "<p>Number</p> ",            "optional": false,            "field": "token_exp",            "description": "<p>Token expiry date (Unix time).</p> "          },          {            "group": "Success 200",            "type": "<p>Number</p> ",            "optional": false,            "field": "token_iat",            "description": "<p>Token issue date (Unix time).</p> "          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\" : {\n    \"id\": \"54ee6175465eaee35cd237ed\",\n    \"username\": \"demo\",\n    \"email\": \"demo@demo.demo\",\n    \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTQ0ODYsImV4cCI6MTQyNzgxODA4Nn0.pZVBE_GKvJUr4BI7BDeTmIIy9gQ2p3tlrG2pcMcjm3U\",\n    \"token_exp\": 1427818086,\n    \"token_iat\": 1427814486\n  }\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "401": [          {            "group": "401",            "type": "<p>Boolean</p> ",            "optional": false,            "field": "error",            "description": "<p>Error.</p> "          },          {            "group": "401",            "type": "<p>Number</p> ",            "optional": false,            "field": "errorCode",            "description": "<p>Error code.</p> "          },          {            "group": "401",            "type": "<p>String</p> ",            "optional": false,            "field": "message",            "description": "<p>Error description.</p> "          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": {\n    \"code\": \"401\",\n    \"message\": \"invalid_token\"\n  }\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/modules/api/routes/_auth.js",    "groupTitle": "Auth"  },  {    "type": "get",    "url": "/api/auth/:token",    "title": "Token verification",    "name": "Verify",    "group": "Auth",    "description": "<p>Verifies if the token is valid and has not expired.</p> ",    "examples": [      {        "title": "Example usage:",        "content": "curl -4 -i http://localhost:9000/api/auth/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8 --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",        "type": "json"      }    ],    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Auth. header containing the token.</p> "          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "message",            "description": "<p>Auth. verification result.</p> "          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\" : {\n    \"message\": \"Token is valid\"\n  }\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "401": [          {            "group": "401",            "type": "<p>Boolean</p> ",            "optional": false,            "field": "error",            "description": "<p>Error.</p> "          },          {            "group": "401",            "type": "<p>Number</p> ",            "optional": false,            "field": "errorCode",            "description": "<p>Error code.</p> "          },          {            "group": "401",            "type": "<p>String</p> ",            "optional": false,            "field": "message",            "description": "<p>Error description.</p> "          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": {\n    \"code\": \"401\",\n    \"message\": \"invalid_token\"\n  }\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/modules/api/routes/_auth.js",    "groupTitle": "Auth"  },  {    "type": "post",    "url": "/blog/articles",    "title": "Create a medianew article",    "name": "Create",    "group": "Blog_Articles",    "examples": [      {        "title": "Example usage:",        "content": "curl -X POST -H \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMSIsImlhdCI6MTQzNDYzMzgwNCwiZXhwIjoxNDM0NjM3NDA0fQ.IwPItcFLIDzA1MvwDXNYjVF0PxVcQ_Mft5wAU-2D8bY\" -H \"Content-Type: application/x-www-form-urlencoded\" -d 'title=Article+title&slug=article-slug&excerpt=Article+excerpt&body=Article+body&commentable=1&author_id=000000000000000000000001&published=1&publish_date=1434540172' http://localhost:9000/api/blog/articles",        "type": "json"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"meta\": {\n    \"url\": \"http://localhost:9001/blog/articles/5582cedfbc15803005798b8f\"\n  },\n  \"data\": {\n    \"author\": \"000000000000000000000001\",\n    \"body\": \"Article body\",\n    \"excerpt\": \"Article excerpt\",\n    \"slug\": \"article-slug-16\",\n    \"title\": \"Article title\",\n    \"updated_at\": 1434636000,\n    \"created_at\": 1434636000,\n    \"commentable\": true,\n    \"publish_date\": 1434540,\n    \"published\": true,\n    \"id\": \"5582cedfbc15803005798b8f\"\n  }\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/modules/api/routes/blog_articles.js",    "groupTitle": "Blog_Articles",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": true,            "field": "expand",            "description": "<p>Nested objects to expand. It can be an array.</p> "          },          {            "group": "Parameter",            "type": "<p>Integer</p> ",            "optional": true,            "field": "per_page",            "description": "<p>The methods that return multiple models are paginated by default. This determines the number of elements returned (by default 20). There's a hard limit (200). Requests with a greater value will return only the maximum allowed items.</p> "          },          {            "group": "Parameter",            "type": "<p>Integer</p> ",            "optional": true,            "field": "page",            "description": "<p>The results page (for paginated results)</p> "          },          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": true,            "field": "sort_by",            "description": "<p>Sort criteria. Accepts multiple values (arrays)</p> "          },          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": true,            "field": "order",            "description": "<p>Sort direction. Accepted values: <code>1</code>, <code>-1</code>, <code>asc</code>, <code>desc</code>. It's applied to all the sort_by (because the backbone.paginator does not support this, anyway, this is really easy to change)</p> "          }        ]      }    }  },  {    "type": "delete",    "url": "/blog/articles",    "title": "Delete the article with this id",    "name": "Delete",    "group": "Blog_Articles",    "examples": [      {        "title": "Example usage:",        "content": "curl -4 -i -X DELETE http://localhost:9000/api/blog/articles/551c31d0430d78991f5931e1 --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",        "type": "json"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"meta\": {},\n  \"data\": {\n    \"title\": \"Test\",\n    \"slug\": \"this-is-a-test\",\n    \"excerpt\": \"Holaquetal\",\n    \"body\": \"HOCTL·LA\",\n    \"author\": \"000000000000000000000001\",\n    \"updated_at\": 1434636343,\n    \"created_at\": 1434518089,\n    \"commentable\": true,\n    \"publish_date\": 1434540,\n    \"published\": true,\n    \"id\": \"5581f70e4901e5baa84a9652\"\n  }\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/modules/api/routes/blog_articles.js",    "groupTitle": "Blog_Articles",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": true,            "field": "expand",            "description": "<p>Nested objects to expand. It can be an array.</p> "          },          {            "group": "Parameter",            "type": "<p>Integer</p> ",            "optional": true,            "field": "per_page",            "description": "<p>The methods that return multiple models are paginated by default. This determines the number of elements returned (by default 20). There's a hard limit (200). Requests with a greater value will return only the maximum allowed items.</p> "          },          {            "group": "Parameter",            "type": "<p>Integer</p> ",            "optional": true,            "field": "page",            "description": "<p>The results page (for paginated results)</p> "          },          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": true,            "field": "sort_by",            "description": "<p>Sort criteria. Accepts multiple values (arrays)</p> "          },          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": true,            "field": "order",            "description": "<p>Sort direction. Accepted values: <code>1</code>, <code>-1</code>, <code>asc</code>, <code>desc</code>. It's applied to all the sort_by (because the backbone.paginator does not support this, anyway, this is really easy to change)</p> "          }        ]      }    }  },  {    "type": "get",    "url": "/blog/articles",    "title": "Get the article with that id",    "name": "Get",    "group": "Blog_Articles",    "examples": [      {        "title": "Example usage:",        "content": "curl -4 -i http://localhost:9000/api/blog/articles/551c31d0430d78991f5931e1 --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",        "type": "json"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"meta\": {\n    \"url\": \"http://localhost:9001/blog/articles/5581f70e4901e5baa84a9652\"\n  },\n  \"data\": {\n    \"title\": \"Test\",\n    \"slug\": \"this-is-a-test\",\n    \"excerpt\": \"Holaquetal\",\n    \"body\": \"HOCTL·LA\",\n    \"author\": \"000000000000000000000001\",\n    \"updated_at\": 1434622332,\n    \"created_at\": 1434518089,\n    \"commentable\": true,\n    \"publish_date\": 1434540,\n    \"published\": true,\n    \"id\": \"5581f70e4901e5baa84a9652\"\n  }\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/modules/api/routes/blog_articles.js",    "groupTitle": "Blog_Articles",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": true,            "field": "expand",            "description": "<p>Nested objects to expand. It can be an array.</p> "          },          {            "group": "Parameter",            "type": "<p>Integer</p> ",            "optional": true,            "field": "per_page",            "description": "<p>The methods that return multiple models are paginated by default. This determines the number of elements returned (by default 20). There's a hard limit (200). Requests with a greater value will return only the maximum allowed items.</p> "          },          {            "group": "Parameter",            "type": "<p>Integer</p> ",            "optional": true,            "field": "page",            "description": "<p>The results page (for paginated results)</p> "          },          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": true,            "field": "sort_by",            "description": "<p>Sort criteria. Accepts multiple values (arrays)</p> "          },          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": true,            "field": "order",            "description": "<p>Sort direction. Accepted values: <code>1</code>, <code>-1</code>, <code>asc</code>, <code>desc</code>. It's applied to all the sort_by (because the backbone.paginator does not support this, anyway, this is really easy to change)</p> "          }        ]      }    }  },  {    "type": "get",    "url": "/blog/articles",    "title": "List all the articles owned by the authenticated user",    "name": "List",    "group": "Blog_Articles",    "examples": [      {        "title": "Example usage:",        "content": "curl -4 -i http://localhost:9000/api/blog/articles --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",        "type": "json"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {\n    \"url\": \"http://localhost:9001/blog/articles\",\n    \"paginator\": {\n      \"total_entries\": 100,\n      \"total_pages\": 5,\n      \"page\": 1,\n      \"per_page\": 20\n    }\n  },\n  \"data\": [\n    {\n      \"author\": \"000000000000000000000001\",\n      \"body\": \"Article body\",\n      \"excerpt\": \"Article excerpt\",\n      \"slug\": \"article-slug-1\",\n      \"title\": \"Article title\",\n      \"updated_at\": 1434627873,\n      \"created_at\": 1434627873,\n      \"commentable\": true,\n      \"publish_date\": 1434540,\n      \"published\": true,\n      \"id\": \"5582af212207075ddbc42210\"\n    },\n    {\n      \"author\": \"000000000000000000000001\",\n      \"body\": \"Article body\",\n      \"excerpt\": \"Article excerpt\",\n      \"slug\": \"article-slug-2\",\n      \"title\": \"Article title\",\n      \"updated_at\": 1434628060,\n      \"created_at\": 1434628060,\n      \"commentable\": true,\n      \"publish_date\": 1434540,\n      \"published\": true,\n      \"id\": \"5582afdc2cf7b648dcf84aba\"\n    }\n  ]\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/modules/api/routes/blog_articles.js",    "groupTitle": "Blog_Articles",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": true,            "field": "expand",            "description": "<p>Nested objects to expand. It can be an array.</p> "          },          {            "group": "Parameter",            "type": "<p>Integer</p> ",            "optional": true,            "field": "per_page",            "description": "<p>The methods that return multiple models are paginated by default. This determines the number of elements returned (by default 20). There's a hard limit (200). Requests with a greater value will return only the maximum allowed items.</p> "          },          {            "group": "Parameter",            "type": "<p>Integer</p> ",            "optional": true,            "field": "page",            "description": "<p>The results page (for paginated results)</p> "          },          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": true,            "field": "sort_by",            "description": "<p>Sort criteria. Accepts multiple values (arrays)</p> "          },          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": true,            "field": "order",            "description": "<p>Sort direction. Accepted values: <code>1</code>, <code>-1</code>, <code>asc</code>, <code>desc</code>. It's applied to all the sort_by (because the backbone.paginator does not support this, anyway, this is really easy to change)</p> "          }        ]      }    }  },  {    "type": "put",    "url": "/blog/articles",    "title": "Update the article with this id",    "name": "Update",    "group": "Blog_Articles",    "examples": [      {        "title": "Example usage:",        "content": "curl -X PUT -H \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMSIsImlhdCI6MTQzNDYzMzgwNCwiZXhwIjoxNDM0NjM3NDA0fQ.IwPItcFLIDzA1MvwDXNYjVF0PxVcQ_Mft5wAU-2D8bY\" -H \"Content-Type: application/x-www-form-urlencoded\" -d 'title=Test&slug=this-is-a-test&excerpt=Holaquetal&body=HOCTL%C2%B7LA&commentable=1&author_id=000000000000000000000001&published=1&publish_date=1434540172' http://localhost:9000/api/blog/articles/5581f70e4901e5baa84a9652",        "type": "json"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"meta\": {\n    \"url\": \"http://localhost:9001/blog/articles/5581f70e4901e5baa84a9652\"\n  },\n  \"data\": {\n    \"title\": \"Test\",\n    \"slug\": \"this-is-a-test\",\n    \"excerpt\": \"Holaquetal\",\n    \"body\": \"HOCTL·LA\",\n    \"author\": \"000000000000000000000001\",\n    \"updated_at\": 1434636343,\n    \"created_at\": 1434518089,\n    \"commentable\": true,\n    \"publish_date\": 1434540,\n    \"published\": true,\n    \"id\": \"5581f70e4901e5baa84a9652\"\n  }\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/modules/api/routes/blog_articles.js",    "groupTitle": "Blog_Articles",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": true,            "field": "expand",            "description": "<p>Nested objects to expand. It can be an array.</p> "          },          {            "group": "Parameter",            "type": "<p>Integer</p> ",            "optional": true,            "field": "per_page",            "description": "<p>The methods that return multiple models are paginated by default. This determines the number of elements returned (by default 20). There's a hard limit (200). Requests with a greater value will return only the maximum allowed items.</p> "          },          {            "group": "Parameter",            "type": "<p>Integer</p> ",            "optional": true,            "field": "page",            "description": "<p>The results page (for paginated results)</p> "          },          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": true,            "field": "sort_by",            "description": "<p>Sort criteria. Accepts multiple values (arrays)</p> "          },          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": true,            "field": "order",            "description": "<p>Sort direction. Accepted values: <code>1</code>, <code>-1</code>, <code>asc</code>, <code>desc</code>. It's applied to all the sort_by (because the backbone.paginator does not support this, anyway, this is really easy to change)</p> "          }        ]      }    }  },  {    "type": "post",    "url": "/media",    "title": "Create a media object",    "name": "Create",    "group": "Media",    "examples": [      {        "title": "Example usage:",        "content": "curl -4 -i -X POST http://localhost:9000/api/media --data \"name=ItemName&description=ItemDescription&url=http%3A%2F%2Florempixel.com%2F640%2F480%2Fcats&active=true\" --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",        "type": "json"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\" : {\n    \"active\": true,\n    \"url\": \"http://lorempixel.com/640/480/cats\",\n    \"description\": \"ItemDescription\",\n    \"name\": \"ItemName\",\n    \"id\": \"551c31d0430d78991f5931e1\"\n  }\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/modules/api/routes/media.js",    "groupTitle": "Media"  },  {    "type": "delete",    "url": "/media",    "title": "Delete the media with this id",    "name": "Delete",    "group": "Media",    "examples": [      {        "title": "Example usage:",        "content": "curl -4 -i -X DELETE http://localhost:9000/api/media/551c31d0430d78991f5931e1 --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",        "type": "json"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\" : {\n    \"active\": true,\n    \"url\": \"http://lorempixel.com/640/480/cats\",\n    \"description\": \"ItemDescription\",\n    \"name\": \"ItemName\",\n    \"id\": \"551c31d0430d78991f5931e1\"\n  }\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/modules/api/routes/media.js",    "groupTitle": "Media"  },  {    "type": "get",    "url": "/media",    "title": "Get the media with that id",    "name": "Get",    "group": "Media",    "examples": [      {        "title": "Example usage:",        "content": "curl -4 -i http://localhost:9000/api/media/551c31d0430d78991f5931e1 --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",        "type": "json"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\" : {\n    \"active\": true,\n    \"url\": \"http://lorempixel.com/640/480/cats\",\n    \"description\": \"ItemDescription\",\n    \"name\": \"ItemName\",\n    \"id\": \"551c31d0430d78991f5931e1\"\n  }\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/modules/api/routes/media.js",    "groupTitle": "Media"  },  {    "type": "get",    "url": "/media",    "title": "List all media objects",    "name": "List",    "group": "Media",    "examples": [      {        "title": "Example usage:",        "content": "curl -4 -i http://localhost:9000/api/media --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",        "type": "json"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\": [\n    {\n      \"id\": \"54f1a3dc2d4714c77f4d8bce\",\n      \"name\": \"corporis incidunt est labore\",\n      \"description\": \"necessitatibus enim cupiditate ex ullam autem hic natus nihil nostrum\",\n      \"url\": \"http://lorempixel.com/640/480/cats\",\n      \"active\": true\n    },\n    {\n      \"id\": \"54f1a3dc2d4714c77f4d8bcf\",\n      \"name\": \"ex nisi\",\n      \"description\": \"tenetur at et hic alias id iusto et repudiandae soluta\",\n      \"url\": \"http://lorempixel.com/640/480/cats\",\n      \"active\": true\n    }\n  ]\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/modules/api/routes/media.js",    "groupTitle": "Media"  },  {    "type": "put",    "url": "/media",    "title": "Update the media with this id",    "name": "Update",    "group": "Media",    "examples": [      {        "title": "Example usage:",        "content": "curl -4 -i -X PUT http://localhost:9000/api/media/551c31d0430d78991f5931e1 --data \"name=ItemName&description=ItemDescription&active=false\" --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",        "type": "json"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\" : {\n    \"active\": false,\n    \"url\": \"http://lorempixel.com/640/480/cats\",\n    \"description\": \"ItemDescription2\",\n    \"name\": \"ItemName2\",\n    \"id\": \"551c31d0430d78991f5931e1\"\n  }\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/modules/api/routes/media.js",    "groupTitle": "Media"  },  {    "type": "get",    "url": "/api/",    "title": "API entry point",    "name": "Index",    "group": "ROOT",    "description": "<p>Test route to make sure everything is working</p> ",    "examples": [      {        "title": "Example usage:",        "content": "curl -4 -i http://localhost:9000/api",        "type": "json"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "message",            "description": "<p>Success message.</p> "          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"hooray! welcome to our api!\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "src/modules/api/index.js",    "groupTitle": "ROOT"  }] });