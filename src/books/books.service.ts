import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Publisher } from './entities/publisher.entity';
import { Author } from './entities/author.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Publisher)
    private readonly publisherReposytory: Repository<Publisher>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  findAll() {
    return this.bookRepository.find({ relations: ['authors', 'publishers'] });
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id: +id },
      relations: ['authors', 'publishers'],
    });
    if (!book) {
      throw new NotFoundException(`Book #${id} not found`);
    }
    return book;
  }

  async create(CreateBookDto: CreateBookDto) {
    const publishers = await Promise.all(
      CreateBookDto.publisher.map((name) => this.preloadPublisherByName(name)),
    );

    const authors = await Promise.all(
      CreateBookDto.author.map((name) => this.preloadAuthorByName(name)),
    );

    const book = this.bookRepository.create({
      ...CreateBookDto,
      publishers,
      authors,
    });

    return this.bookRepository.save(book);
  }

  async update(id: number, UpdateBookDto: UpdateBookDto) {
    const publishers =
      UpdateBookDto.publisher &&
      (await Promise.all(
        UpdateBookDto.publisher.map((name) =>
          this.preloadPublisherByName(name),
        ),
      ));

    const authors =
      UpdateBookDto.author &&
      (await Promise.all(
        UpdateBookDto.author.map((name) => this.preloadAuthorByName(name)),
      ));

    const book = await this.bookRepository.preload({
      id: +id,
      ...UpdateBookDto,
      publishers,
      authors,
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

  private async preloadPublisherByName(name: string): Promise<Publisher> {
    const existingPublisher = await this.publisherReposytory.findOne({
      where: { name: name },
    });
    if (existingPublisher) {
      return existingPublisher;
    }
    return this.publisherReposytory.create({ name });
  }

  private async preloadAuthorByName(name: string): Promise<Author> {
    const existingAuthor = await this.authorRepository.findOne({
      where: { name: name },
    });
    if (existingAuthor) {
      return existingAuthor;
    }
    return this.authorRepository.create({ name });
  }
}
