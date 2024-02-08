import { IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1980)
  @Max(2050)
  year: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;
}
