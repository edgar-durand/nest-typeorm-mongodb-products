import { IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IAttributes } from '../interface/attributes';


export class CreateProductDto {
  @IsDefined()
  @ApiProperty({
    description: 'The name of product',
    example: 'Shoes',
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: "Under Armor Men's Charged Assert Running Shoes",
  })
  description: string

  @ApiProperty({
    description: 'Product attributes',
    example: { color: 'black', size: '42' },
  })
  attributes: IAttributes;

  @ApiProperty({
    description: 'Product price',
    example: 29.99,
  })
  price: number;

  @ApiProperty({
    description: 'Product in stock quantity',
    example: 6,
  })
  stock: number;
}
