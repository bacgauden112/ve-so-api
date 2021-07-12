import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('post')
export class Post {
  @ObjectIdColumn()
  public id: ObjectID;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @Column({ nullable: true })
  public category?: string;
}
