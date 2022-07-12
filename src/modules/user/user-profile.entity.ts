import { BaseEntity } from '@src/shared/types/base.entity';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'profile' })
export class UserProfile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    type: 'varchar',
    length: 320,
  })
  name: string;

  @Column({})
  description: string;

  @Column('text', { array: true, nullable: true, default: [] })
  languages: string[];

  @Column({})
  defaultLanguage: string;

  @Column({ type: 'geography' })
  location: object;
  
  @Column({default: false})
  receiveNotifications: boolean;

  @Column({})
  phone: string;

  @Column({})
  telegram: string;
  
  @Column({})
  whatsapp: string;

  @Column('text', { array: true, nullable: true, default: [] })
  interests: string[];
}