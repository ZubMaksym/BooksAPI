import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  findAll() {
    return this.bookRepository.find();
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({ where: { id: +id } });
    if (!book) {
      throw new NotFoundException(`Book #${id} not found`);
    }
    return book;
  }

  create(CreateBookDto: CreateBookDto) {
    const book = this.bookRepository.create(CreateBookDto);
    return this.bookRepository.save(book);
  }

  async update(id: number, UpdateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.preload({
      id: +id,
      ...UpdateBookDto,
    });
    if (!book) {
      throw new NotFoundException(`Book #${id} not found`);
    }
    return this.bookRepository.save(book);
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    return this.bookRepository.remove(book);
  }
}
