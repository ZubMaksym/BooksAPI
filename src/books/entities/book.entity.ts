import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Publisher } from './publisher.entity';
import { Author } from './author.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  edition: number;

  @JoinTable()
  @ManyToMany(() => Publisher, (publisher) => publisher.books, {
    cascade: true,
  })
  publishers: Publisher[];

  @JoinTable()
  @ManyToMany(() => Author, (author) => author.books, {
    cascade: true,
  })
  authors: Author[];
}
