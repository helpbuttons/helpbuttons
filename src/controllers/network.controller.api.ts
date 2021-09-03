import {Network} from '../models';

export const def = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Accounts Microservice',
    description:
      'This is the api for the accounts service created by loopback.',
  },
  paths: {
    '/networks/new': {
      post: {
        'x-operation-name': 'new',
        summary: "Create a new network",
        tags: ["networks"],
        "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string"
                    },
                    "url": {
                      "type": "string"
                    },
                    "avatar": {
                      "type": "string"
                    },
                    "description": {
                      "type": "string"
                    },
                    "privacy": {
                      "type": "string",
                      "enum": [
                        "private",
                        "public"
                      ]
                    },
                    "place": {
                      "type": "string"
                    },
                    "latitude": {
                      "type": "number"
                    },
                    "longitude": {
                      "type": "number"
                    },
                    "radius": {
                      "type": "number"
                    },
                    "template": {
                      "type": "string"
                    }
                  }
                },
                "examples": {
                  "network": {
                    "summary": "example of a new network",
                    "value": {
                      "name": "Network of animal support Andalucia",
                      "url": "https://andaluciaanimal.org",
                      "avatar": "/image/gfdusigfsdg7f8dsf",
                      "description": "a network where you can support animals in need in andalucia and report animals that need support",
                      "privacy": "private",
                      "place": "Andalucia",
                      "latitude": -9.1790771484375,
                      "longitude": 38.81831117374662,
                      "radius": 50,
                      "template": "toBeDefinedByFrontend"
                    }
                  }
                }
              }
            }
        },
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Network: Network,
    },
  },
};
