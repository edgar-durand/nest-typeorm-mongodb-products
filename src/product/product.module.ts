import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthJwt } from '../auth/jwt-auth.guard';
import { Product } from './entity/product.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    UserModule
  ],
  controllers: [ProductController],
  providers: [ProductService, AuthJwt],
  exports: [ProductService]
})
export class ProductModule {}
