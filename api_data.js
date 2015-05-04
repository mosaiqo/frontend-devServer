define({ "api": [
  {
    "type": "post",
    "url": "/api/auth",
    "title": "Login",
    "name": "Login",
    "group": "Auth",
    "description": "<p>Authenticates the user and returns the auth token. The token                 is also saved to a Redis store so it can be revoked at any time.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -4 -i -X POST http://localhost:9000/api/auth --data \"username=demo&password=demo\"",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>User name.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>User id.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>JWT.</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "token_exp",
            "description": "<p>Token expiry date (Unix time).</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "token_iat",
            "description": "<p>Token issue date (Unix time).</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\" : {\n    \"id\": \"54ee6175465eaee35cd237ed\",\n    \"username\": \"demo\",\n    \"email\": \"demo@demo.demo\",\n    \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTQ0ODYsImV4cCI6MTQyNzgxODA4Nn0.pZVBE_GKvJUr4BI7BDeTmIIy9gQ2p3tlrG2pcMcjm3U\",\n    \"token_exp\": 1427818086,\n    \"token_iat\": 1427814486\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Error.</p> "
          },
          {
            "group": "401",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>Error code.</p> "
          },
          {
            "group": "401",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error description.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": true,\n  \"errorCode\": 401,\n  \"message\": \"Invalid username or password\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/modules/api/routes/_auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "delete",
    "url": "/api/auth/{token}",
    "title": "Logout",
    "name": "Logout",
    "group": "Auth",
    "description": "<p>Deauthenticates the user by invalidating the token.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -4 -i -X DELETE http://localhost:9000/api/auth/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8 --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Auth. header containing the token.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Logout success message.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\" : {\n    \"message\": \"User has been successfully logged out\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Error.</p> "
          },
          {
            "group": "401",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>Error code.</p> "
          },
          {
            "group": "401",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error description.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": true,\n  \"errorCode\": 401,\n  \"message\": \"invalid_token\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/modules/api/routes/_auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "put",
    "url": "/api/auth/:token",
    "title": "Token renewal",
    "name": "TokenRenew",
    "group": "Auth",
    "description": "<p>Creates a new token with a new expiry date without requiring the user to send again its credentials.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -4 -i -X PUT http://localhost:9000/api/auth/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8 --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Auth. header containing the token.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>User id.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>JWT.</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "token_exp",
            "description": "<p>Token expiry date (Unix time).</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "token_iat",
            "description": "<p>Token issue date (Unix time).</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\" : {\n    \"id\": \"54ee6175465eaee35cd237ed\",\n    \"username\": \"demo\",\n    \"email\": \"demo@demo.demo\",\n    \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTQ0ODYsImV4cCI6MTQyNzgxODA4Nn0.pZVBE_GKvJUr4BI7BDeTmIIy9gQ2p3tlrG2pcMcjm3U\",\n    \"token_exp\": 1427818086,\n    \"token_iat\": 1427814486\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Error.</p> "
          },
          {
            "group": "401",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>Error code.</p> "
          },
          {
            "group": "401",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error description.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": true,\n  \"errorCode\": 401,\n  \"message\": \"invalid_token\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/modules/api/routes/_auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/api/auth/:token",
    "title": "Token verification",
    "name": "Verify",
    "group": "Auth",
    "description": "<p>Verifies if the token is valid and has not expired.</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -4 -i http://localhost:9000/api/auth/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8 --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Auth. header containing the token.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Auth. verification result.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\" : {\n    \"message\": \"Token is valid\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Error.</p> "
          },
          {
            "group": "401",
            "type": "Number",
            "optional": false,
            "field": "errorCode",
            "description": "<p>Error code.</p> "
          },
          {
            "group": "401",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error description.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": true,\n  \"errorCode\": 401,\n  \"message\": \"invalid_token\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/modules/api/routes/_auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/media",
    "title": "Create a media object",
    "name": "Create",
    "group": "Media",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -4 -i -X POST http://localhost:9000/api/media --data \"name=ItemName&description=ItemDescription&url=http%3A%2F%2Florempixel.com%2F640%2F480%2Fcats&active=true\" --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\" : {\n    \"active\": true,\n    \"url\": \"http://lorempixel.com/640/480/cats\",\n    \"description\": \"ItemDescription\",\n    \"name\": \"ItemName\",\n    \"id\": \"551c31d0430d78991f5931e1\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/modules/api/routes/media.js",
    "groupTitle": "Media"
  },
  {
    "type": "delete",
    "url": "/media",
    "title": "Delete the media with this id",
    "name": "Delete",
    "group": "Media",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -4 -i -X DELETE http://localhost:9000/api/media/551c31d0430d78991f5931e1 --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\" : {\n    \"active\": true,\n    \"url\": \"http://lorempixel.com/640/480/cats\",\n    \"description\": \"ItemDescription\",\n    \"name\": \"ItemName\",\n    \"id\": \"551c31d0430d78991f5931e1\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/modules/api/routes/media.js",
    "groupTitle": "Media"
  },
  {
    "type": "get",
    "url": "/media",
    "title": "Get the media with that id",
    "name": "Get",
    "group": "Media",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -4 -i http://localhost:9000/api/media/551c31d0430d78991f5931e1 --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\" : {\n    \"active\": true,\n    \"url\": \"http://lorempixel.com/640/480/cats\",\n    \"description\": \"ItemDescription\",\n    \"name\": \"ItemName\",\n    \"id\": \"551c31d0430d78991f5931e1\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/modules/api/routes/media.js",
    "groupTitle": "Media"
  },
  {
    "type": "get",
    "url": "/media",
    "title": "List all media objects",
    "name": "List",
    "group": "Media",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -4 -i http://localhost:9000/api/media --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\": [\n    {\n      \"id\": \"54f1a3dc2d4714c77f4d8bce\",\n      \"name\": \"corporis incidunt est labore\",\n      \"description\": \"necessitatibus enim cupiditate ex ullam autem hic natus nihil nostrum\",\n      \"url\": \"http://lorempixel.com/640/480/cats\",\n      \"active\": true\n    },\n    {\n      \"id\": \"54f1a3dc2d4714c77f4d8bcf\",\n      \"name\": \"ex nisi\",\n      \"description\": \"tenetur at et hic alias id iusto et repudiandae soluta\",\n      \"url\": \"http://lorempixel.com/640/480/cats\",\n      \"active\": true\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/modules/api/routes/media.js",
    "groupTitle": "Media"
  },
  {
    "type": "put",
    "url": "/media",
    "title": "Update the media with this id",
    "name": "Update",
    "group": "Media",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -4 -i -X PUT http://localhost:9000/api/media/551c31d0430d78991f5931e1 --data \"name=ItemName&description=ItemDescription&active=false\" --header \"Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8\"",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"meta\" : {},\n  \"data\" : {\n    \"active\": false,\n    \"url\": \"http://lorempixel.com/640/480/cats\",\n    \"description\": \"ItemDescription2\",\n    \"name\": \"ItemName2\",\n    \"id\": \"551c31d0430d78991f5931e1\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/modules/api/routes/media.js",
    "groupTitle": "Media"
  },
  {
    "type": "get",
    "url": "/api/",
    "title": "API entry point",
    "name": "Index",
    "group": "ROOT",
    "description": "<p>Test route to make sure everything is working</p> ",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -4 -i http://localhost:9000/api",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"hooray! welcome to our api!\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/modules/api/index.js",
    "groupTitle": "ROOT"
  }
] });