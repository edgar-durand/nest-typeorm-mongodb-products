import { CreateDateColumn, DeleteDateColumn, Entity, ObjectID, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export abstract class BaseEntity {

  @ObjectIdColumn()
  _id: ObjectID

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: string;
}
