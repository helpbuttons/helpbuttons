import { BaseEntity } from '@src/shared/types/base.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class KeyLocation extends BaseEntity {
    @Column({})
    @PrimaryColumn()
    public id: string;

    @Column({})
    address: string;

    @Expose()
    @Column({ type: 'double precision' })
    public latitude: number;
  
    @Expose()
    @Column({ type: 'double precision' })
    public longitude: number;
  
    @Exclude()
    @Column({ type: 'geometry' })
    location: object;

    @Expose()
    @Column('text')
    hexagon: string;
}