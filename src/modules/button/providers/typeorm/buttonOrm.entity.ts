import { Index, Column, Entity, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
// https://stackoverflow.com/a/67557083

@Entity()
export class ButtonOrm {
  
  @Column({type: 'varchar'})
  @PrimaryColumn()
  public id: string;
 
  @Column({type: 'double precision'})
  public latitude: number;
 
  @Column({type: 'double precision'})
  public longitude: number;

  @Column({
    type: 'geography',
  })
  location: string;
}