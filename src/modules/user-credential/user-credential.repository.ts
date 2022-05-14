import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

import { UserCredential } from './user-credential.entity';

@EntityRepository(UserCredential)
export class UserCredentialRepository extends BaseRepository<UserCredential> {}
