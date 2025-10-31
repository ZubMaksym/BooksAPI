import { IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  readonly edition?: number;

  @IsString({ each: true })
  readonly publisher: string[];

  @IsString({ each: true })
  readonly author: string[];
}
