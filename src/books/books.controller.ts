import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @Get()
  findAll() {
    return this.booksService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.booksService.findOne(id);
  }

  @Post()
  create(@Body() CreateBookDto: CreateBookDto) {
    return this.booksService.create(CreateBookDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() UpdateBookDto: UpdateBookDto) {
    return this.booksService.update(id, UpdateBookDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.booksService.remove(id);
  }
}
