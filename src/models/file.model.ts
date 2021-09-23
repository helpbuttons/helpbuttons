import {Entity, model, property} from '@loopback/repository';

@model()
export class File extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id?: string;

  @property({
    type: 'string',
  })
  filename?: string;

  @property({
    type: 'string'
  })
  url? : string;

  @property({
    type: 'string',
  })
  originalName?: string;

  @property({
    type: 'string',
  })
  encoding?: string;

  @property({
    type: 'string',
  })
  mimetype?: string;

  @property({
    type: 'number',
  })
  size?: number;


  constructor(data?: Partial<File>) {
    super(data);
  }
}

export interface FileRelations {
  // describe navigational properties here
}

export type FileWithRelations = File & FileRelations;
