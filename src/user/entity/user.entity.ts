import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { hash } from '../../helpers/entity-utils';
import { BaseEntity } from '../../database/base.entity';

@Entity()
export class User extends BaseEntity {

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  token: string;

  @Column({ name: 'confirmToken', nullable: true })
  confirmToken: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: true })
  confirmed: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password);
  }

  validatePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
