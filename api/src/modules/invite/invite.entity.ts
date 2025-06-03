import { BaseEntity } from '@src/shared/types/base.entity.js';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity.js';

@Entity()
export class Invite extends BaseEntity {
    @Column({})
    @PrimaryColumn()
    public id: string;

    @Column({})
    usage: number;

    @Column({})
    maximumUsage: number;

    @Column({type: 'timestamp', nullable: true})
    expiration: Date

    @ManyToOne((type) => User)
    owner: User;

    @Column('boolean', {default: false})
    deleted: boolean;
}