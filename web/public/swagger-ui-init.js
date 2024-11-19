
window.onload = function() {
    // Build a system
    var url = window.location.search.match(/url=([^&]+)/);
    if (url && url.length > 1) {
      url = decodeURIComponent(url[1]);
    } else {
      url = window.location.origin;
    }
    var options = {
    "swaggerDoc": {
      "openapi": "3.0.0",
      "paths": {
        "/": {
          "get": {
            "operationId": "AppController_getHello",
            "parameters": [],
            "responses": {
              "200": {
                "description": ""
              }
            }
          }
        },
        "/networks/new": {
          "post": {
            "operationId": "NetworkController_create",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreateNetworkDto"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "networks"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/networks/findById": {
          "get": {
            "operationId": "NetworkController_findDefaultNetwork",
            "parameters": [],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "networks"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/networks/configuration": {
          "get": {
            "operationId": "NetworkController_findConfig",
            "parameters": [],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "networks"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/networks/update": {
          "post": {
            "operationId": "NetworkController_update",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UpdateNetworkDto"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "networks"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/networks/config": {
          "get": {
            "operationId": "NetworkController_config",
            "parameters": [],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "networks"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/networks/manifest.json": {
          "get": {
            "operationId": "NetworkController_manifest",
            "parameters": [],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "networks"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/networks/logo/{resolution}": {
          "get": {
            "operationId": "NetworkController_logo",
            "parameters": [
              {
                "name": "resolution",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "number"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "networks"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/tags/findByTag/{tag}": {
          "get": {
            "operationId": "TagController_findOne",
            "parameters": [
              {
                "name": "tag",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "Tags"
            ]
          }
        },
        "/files/get/{imgpath}": {
          "get": {
            "operationId": "StorageController_get",
            "parameters": [],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "Files"
            ]
          }
        },
        "/users/whoAmI": {
          "get": {
            "operationId": "UserController_whoAmI",
            "parameters": [],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/users/find/{username}": {
          "get": {
            "operationId": "UserController_find",
            "parameters": [
              {
                "name": "username",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/users/findExtra/{userId}": {
          "get": {
            "operationId": "UserController_findExtra",
            "parameters": [
              {
                "name": "userId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/users/invites": {
          "get": {
            "operationId": "UserController_invites",
            "parameters": [],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/users/createInvite": {
          "post": {
            "operationId": "UserController_createInvite",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/InviteCreateDto"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/users/updateRole/{userId}/{role}": {
          "post": {
            "operationId": "UserController_updateRole",
            "parameters": [
              {
                "name": "userId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "role",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/users/moderationList/{page}": {
          "get": {
            "operationId": "UserController_moderationList",
            "parameters": [
              {
                "name": "page",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "number"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/users/unsubscribe/{email}": {
          "post": {
            "operationId": "UserController_unsubscribe",
            "parameters": [
              {
                "name": "email",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/users/followTag/{tag}": {
          "post": {
            "operationId": "UserController_follow",
            "parameters": [
              {
                "name": "tag",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/users/followTags/{tags}": {
          "post": {
            "operationId": "UserController_followTags",
            "parameters": [
              {
                "name": "tags",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/users/getPhone/{userId}": {
          "get": {
            "operationId": "UserController_getPhone",
            "parameters": [
              {
                "name": "userId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/buttons/new": {
          "post": {
            "operationId": "ButtonController_create",
            "parameters": [
              {
                "name": "networkId",
                "required": true,
                "in": "query",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreateButtonDto"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "buttons"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/buttons/findh3/{resolution}": {
          "post": {
            "operationId": "ButtonController_findh3",
            "parameters": [
              {
                "name": "resolution",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "number"
                }
              }
            ],
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "buttons"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/buttons/findById/{buttonId}": {
          "get": {
            "operationId": "ButtonController_findOne",
            "parameters": [
              {
                "name": "buttonId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "buttons"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/buttons/update/{buttonId}": {
          "post": {
            "operationId": "ButtonController_update",
            "parameters": [
              {
                "name": "buttonId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UpdateButtonDto"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "buttons"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/buttons/delete/{buttonId}": {
          "delete": {
            "operationId": "ButtonController_delete",
            "parameters": [
              {
                "name": "buttonId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "buttons"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/buttons/follow/{buttonId}": {
          "get": {
            "operationId": "ButtonController_follow",
            "parameters": [
              {
                "name": "buttonId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "buttons"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/buttons/unfollow/{buttonId}": {
          "get": {
            "operationId": "ButtonController_unfollow",
            "parameters": [
              {
                "name": "buttonId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "buttons"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/buttons/findByOwner/{userId}": {
          "get": {
            "operationId": "ButtonController_findByOwner",
            "parameters": [
              {
                "name": "userId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "buttons"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/buttons/getphone/{buttonId}": {
          "get": {
            "operationId": "ButtonController_getPhone",
            "parameters": [
              {
                "name": "buttonId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "buttons"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/buttons/renew/{buttonId}": {
          "get": {
            "operationId": "ButtonController_renew",
            "parameters": [
              {
                "name": "buttonId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "buttons"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/buttons/monthCalendar/{month}/{year}": {
          "get": {
            "operationId": "ButtonController_monthCalendar",
            "parameters": [
              {
                "name": "month",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "number"
                }
              },
              {
                "name": "year",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "number"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "buttons"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/buttons/moderationList/{page}": {
          "get": {
            "operationId": "ButtonController_moderationList",
            "parameters": [
              {
                "name": "page",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "number"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "buttons"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/buttons/approve/{buttonId}": {
          "get": {
            "operationId": "ButtonController_approve",
            "parameters": [
              {
                "name": "buttonId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "buttons"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/buttons/bulletin/{page}/{take}/{days}": {
          "get": {
            "operationId": "ButtonController_bulletin",
            "parameters": [
              {
                "name": "page",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "number"
                }
              },
              {
                "name": "take",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "number"
                }
              },
              {
                "name": "days",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "number"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "buttons"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/buttons/embbed/{page}/{take}": {
          "get": {
            "operationId": "ButtonController_embbed",
            "parameters": [
              {
                "name": "page",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "number"
                }
              },
              {
                "name": "take",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "number"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "buttons"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/buttons/rss": {
          "get": {
            "operationId": "ButtonController_rss",
            "parameters": [],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "buttons"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/post/new/{buttonId}": {
          "post": {
            "operationId": "PostController_new",
            "parameters": [
              {
                "name": "buttonId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/MessageDto"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "post"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/post/new/comment/{privacy}/{postId}": {
          "post": {
            "operationId": "PostController_newComment",
            "parameters": [
              {
                "name": "privacy",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "postId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/MessageDto"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "post"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/post/new/comment/{privacy}/{postId}/{commentParentId}": {
          "post": {
            "operationId": "PostController_newCommentReply",
            "parameters": [
              {
                "name": "privacy",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "postId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "commentParentId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/MessageDto"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "post"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/post/update": {
          "post": {
            "operationId": "PostController_update",
            "parameters": [
              {
                "name": "postId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "buttonId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/MessageDto"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "post"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/post/delete/{postId}": {
          "delete": {
            "operationId": "PostController_delete",
            "parameters": [
              {
                "name": "postId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "post"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/post/comment/delete/{commentId}": {
          "delete": {
            "operationId": "PostController_deleteMessage",
            "parameters": [
              {
                "name": "commentId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "post"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/post/findByButtonId/{buttonId}": {
          "get": {
            "operationId": "PostController_findByButtonId",
            "parameters": [
              {
                "name": "buttonId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "post"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/templateButtons/new": {
          "post": {
            "operationId": "TemplateButtonController_create",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreateTemplateButtonDto"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "templateButtons"
            ]
          }
        },
        "/templateButtons/findById/{templateButtonId}": {
          "get": {
            "operationId": "TemplateButtonController_findOne",
            "parameters": [
              {
                "name": "templateButtonId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "templateButtons"
            ]
          }
        },
        "/templateButtons/edit/{templateButtonId}": {
          "patch": {
            "operationId": "TemplateButtonController_update",
            "parameters": [
              {
                "name": "templateButtonId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UpdateTemplateButtonDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "templateButtons"
            ]
          }
        },
        "/templateButtons/delete/{templateButtonId}": {
          "delete": {
            "operationId": "TemplateButtonController_remove",
            "parameters": [
              {
                "name": "templateButtonId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "templateButtons"
            ]
          }
        },
        "/users/signupQR": {
          "post": {
            "operationId": "AuthController_signupQR",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SignupQRRequestDto"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/users/signup": {
          "post": {
            "operationId": "AuthController_signup",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SignupRequestDto"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/users/requestNewLoginToken/{email}": {
          "get": {
            "operationId": "AuthController_requestNewLoginToken",
            "parameters": [
              {
                "name": "email",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/users/loginToken/{verificationToken}": {
          "get": {
            "operationId": "AuthController_loginToken",
            "parameters": [
              {
                "name": "verificationToken",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/users/login": {
          "post": {
            "operationId": "AuthController_login",
            "parameters": [],
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ]
          }
        },
        "/users/loginqr/{qrcode}": {
          "post": {
            "operationId": "AuthController_loginqr",
            "parameters": [
              {
                "name": "qrcode",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/users/update": {
          "post": {
            "operationId": "AuthController_update",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserUpdateDto"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/activity/messages/search/{query}": {
          "get": {
            "operationId": "ActivityController_messagesSearch",
            "parameters": [
              {
                "name": "query",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "activity"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/activity/messages/markAllAsRead": {
          "get": {
            "operationId": "ActivityController_messagesMarkAllAsRead",
            "parameters": [],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "activity"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/activity/messages/unread": {
          "get": {
            "operationId": "ActivityController_messagesUnread",
            "parameters": [],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "activity"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/activity/messages/read/{page}": {
          "get": {
            "operationId": "ActivityController_messagesRead",
            "parameters": [
              {
                "name": "page",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "activity"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/activity/notifications/search/{query}": {
          "get": {
            "operationId": "ActivityController_notificationsSearch",
            "parameters": [
              {
                "name": "query",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "activity"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/activity/notifications/{page}": {
          "get": {
            "operationId": "ActivityController_notificationsRead",
            "parameters": [
              {
                "name": "page",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "activity"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/activity/markAsRead/{notificationId}": {
          "post": {
            "operationId": "ActivityController_markAsRead",
            "parameters": [
              {
                "name": "notificationId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "activity"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/activity/network": {
          "get": {
            "operationId": "ActivityController_findNetworkActivity",
            "parameters": [
              {
                "name": "lang",
                "required": true,
                "in": "query",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "activity"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/geo/search/{address}": {
          "get": {
            "operationId": "GeoController_new",
            "parameters": [
              {
                "name": "address",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "geo"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/geo/reverse/{lat}/{lng}": {
          "get": {
            "operationId": "GeoController_reverse",
            "parameters": [
              {
                "name": "lat",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "lng",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "geo"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        },
        "/setup": {
          "get": {
            "operationId": "SetupController_get",
            "parameters": [],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "setup"
            ]
          }
        },
        "/setup/smtpTest": {
          "post": {
            "operationId": "SetupController_smtpTest",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SmtpConfigTest"
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": ""
              }
            },
            "tags": [
              "setup"
            ]
          }
        },
        "/users/deleteme": {
          "get": {
            "operationId": "DeletemeController_deleteme",
            "parameters": [],
            "responses": {
              "200": {
                "description": ""
              }
            },
            "tags": [
              "User"
            ],
            "security": [
              {
                "bearer": []
              }
            ]
          }
        }
      },
      "info": {
        "title": "Helpbuttons backend",
        "description": ".",
        "version": "1.0",
        "contact": {}
      },
      "tags": [
        {
          "name": "hb",
          "description": ""
        }
      ],
      "servers": [],
      "components": {
        "securitySchemes": {
          "bearer": {
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "type": "http"
          }
        },
        "schemas": {
          "CreateNetworkDto": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "privacy": {
                "type": "string",
                "enum": [
                  "public",
                  "private"
                ],
                "description": "Public or private"
              },
              "tags": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            },
            "required": [
              "name",
              "description"
            ]
          },
          "UpdateNetworkDto": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "privacy": {
                "type": "string",
                "enum": [
                  "public",
                  "private"
                ],
                "description": "Public or private"
              },
              "tags": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          },
          "InviteCreateDto": {
            "type": "object",
            "properties": {}
          },
          "CreateButtonDto": {
            "type": "object",
            "properties": {
              "title": {
                "type": "string"
              },
              "type": {
                "type": "string"
              },
              "tags": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "description": {
                "type": "string"
              },
              "latitude": {
                "type": "number",
                "title": "Latitude",
                "description": "Latitude of the button",
                "example": 39.23864
              },
              "longitude": {
                "type": "number",
                "title": "Longitude",
                "description": "Longitude of the button",
                "example": -8.67096
              },
              "address": {
                "type": "string"
              }
            },
            "required": [
              "title",
              "type",
              "description",
              "latitude",
              "longitude",
              "address"
            ]
          },
          "UpdateButtonDto": {
            "type": "object",
            "properties": {
              "title": {
                "type": "string"
              },
              "type": {
                "type": "string"
              },
              "tags": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "description": {
                "type": "string"
              },
              "latitude": {
                "type": "number",
                "title": "Latitude",
                "description": "Latitude of the button",
                "example": 39.23864
              },
              "longitude": {
                "type": "number",
                "title": "Longitude",
                "description": "Longitude of the button",
                "example": -8.67096
              },
              "address": {
                "type": "string"
              }
            }
          },
          "MessageDto": {
            "type": "object",
            "properties": {}
          },
          "CreateTemplateButtonDto": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "formFields": {
                "type": "string"
              },
              "type": {
                "type": "string"
              }
            },
            "required": [
              "name",
              "description",
              "formFields",
              "type"
            ]
          },
          "UpdateTemplateButtonDto": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "formFields": {
                "type": "string"
              },
              "type": {
                "type": "string"
              }
            }
          },
          "SignupQRRequestDto": {
            "type": "object",
            "properties": {
              "username": {
                "type": "string",
                "default": ""
              },
              "name": {
                "type": "string",
                "default": "",
                "nullable": true
              },
              "tags": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            },
            "required": [
              "username",
              "name"
            ]
          },
          "SignupRequestDto": {
            "type": "object",
            "properties": {
              "email": {
                "type": "string",
                "description": "Email should be also unique",
                "default": "sample@example.com",
                "example": "sample@example.com",
                "format": "email"
              },
              "username": {
                "type": "string",
                "default": ""
              },
              "name": {
                "type": "string",
                "default": "",
                "nullable": true
              },
              "password": {
                "type": "string",
                "description": "User password should follow this conditions:\n      1. At least 8 character\n    ",
                "example": "111222AvvD!@"
              },
              "tags": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            },
            "required": [
              "email",
              "username",
              "name",
              "password"
            ]
          },
          "UserUpdateDto": {
            "type": "object",
            "properties": {}
          },
          "SmtpConfigTest": {
            "type": "object",
            "properties": {
              "smtpHost": {
                "type": "string"
              },
              "smtpPort": {
                "type": "string"
              },
              "smtpUser": {
                "type": "string"
              },
              "smtpPass": {
                "type": "string"
              }
            },
            "required": [
              "smtpHost",
              "smtpPort",
              "smtpUser",
              "smtpPass"
            ]
          }
        }
      }
    },
    "customOptions": {},
    "swaggerUrl": "http://localhost:3000/documentation"
  };
    url = options.swaggerUrl || url
    var urls = options.swaggerUrls
    var customOptions = options.customOptions
    var spec1 = options.swaggerDoc
    var swaggerOptions = {
      spec: spec1,
      url: url,
      urls: urls,
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      plugins: [
        SwaggerUIBundle.plugins.DownloadUrl
      ],
      layout: "StandaloneLayout"
    }
    for (var attrname in customOptions) {
      swaggerOptions[attrname] = customOptions[attrname];
    }
    var ui = SwaggerUIBundle(swaggerOptions)
  
    if (customOptions.oauth) {
      ui.initOAuth(customOptions.oauth)
    }
  
    if (customOptions.authAction) {
      ui.authActions.authorize(customOptions.authAction)
    }
  
    window.ui = ui
  }
  