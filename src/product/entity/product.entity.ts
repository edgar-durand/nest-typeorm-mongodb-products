import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IAttributes } from '../interface/attributes';
import { ISubscriber } from '../interface/subscriber';

@Entity()
export class Product extends BaseEntity {

  @ApiProperty({
    description: 'The name of product',
    example: 'Shoes',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: "Under Armor Men's Charged Assert Running Shoes",
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Product attributes',
    example: { color: 'black', size: '42' },
  })
  @Column({ nullable: true })
  attributes: IAttributes;

  @ApiProperty({
    description: 'Product price',
    example: 29.99,
  })
  @Column()
  price: number;

  @ApiProperty({
    description: 'Product in stock quantity',
    example: 6,
  })
  @Column({ default: 1 })
  stock: number;

  @ApiProperty({
    description: 'Users email subscribed to this product'
  })
  @Column({ nullable: true })
  subscribers: ISubscriber[];

}
