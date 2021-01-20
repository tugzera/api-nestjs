import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import * as bcrypt from 'bcrypt';

@Entity()
// @Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  async isValidPassword(password: string, hash: string): Promise<boolean> {
    const isValid = bcrypt.compareSync(password, hash);
    return isValid;
  }
}
