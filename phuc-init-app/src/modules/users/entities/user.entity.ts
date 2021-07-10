import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
@Entity()
export class User {
  @ObjectIdColumn() 
  id: ObjectID; 

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;
}
