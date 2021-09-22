export interface OpenApi {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
    contact: {
      name: string;
      email: string;
    }
  }
  paths: [uri: string]: Path;
}


export interface Path {
  [method: string]: {
    operationId: string;
    tags: string[];
    parameters: {
      name: string;
      in: string;
      schema: {
        type: string;
      }
    }[];
    responses: [code: string]: {
      description: string;
      content: object;
    }
  }
}

