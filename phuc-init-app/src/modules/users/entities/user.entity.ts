import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
@Entity('user')
export class User {
  @ObjectIdColumn()
  public id: ObjectID;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;
}
