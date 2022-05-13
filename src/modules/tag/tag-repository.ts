import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

import { Tag } from './tag.entity';

@EntityRepository(Tag)
export class TagRepository extends BaseRepository<Tag> {}
