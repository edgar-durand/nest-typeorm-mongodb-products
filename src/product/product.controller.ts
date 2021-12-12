import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { AuthJwt } from '../auth/jwt-auth.guard';
import { IResponse } from '../interfaces/api-interfaces';
import { ISearchFilter } from './interface/search-filter';
import { UpdateProductDto } from './dto/update-product.dto';
import { responseToInterface } from '../helpers/return-utils';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(
    private productService: ProductService
  ) { }

  @ApiOperation({
    summary: 'Create product',
    description: 'Create one product.'
  })
  @ApiResponse({
    status: 200, description: 'Success-Response',
    schema: {
      example: {
        result: true,
        data: { _id: '6160f5a9186609045c989652' }
      }
    }
  })
  @ApiResponse({
    status: 404, description: 'Error-Response',
    schema: {
      example: {
        'result': false,
        'message': 'Error message'
      }
    }
  })
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthJwt)
  create(@Body() createDTO: CreateProductDto): Promise<IResponse> {
    return this.productService.create(createDTO);
  }

  @ApiOperation({
    summary: 'Delete Product',
    description: 'Delete one product from database.'
  })
  @ApiResponse({
    status: 200, description: 'Success-Response',
    schema: {
      example: {
        'result': true,
        'message': 'success message'
      }
    }
  })
  @ApiResponse({
    status: 404, description: 'Error-Response',
    schema: {
      example: {
        'result': false,
        'message': 'Error text'
      }
    }
  })
  @ApiParam({
    name: 'id',
    description: 'Product Id',
    required: true
  })
  @ApiBearerAuth()
  @UseGuards(AuthJwt)
  @Delete(':id')
  delete(@Param('id')id): Promise<IResponse> {
    return this.productService.delete(id);
  }

  @ApiOperation({
    summary: 'Update Product',
    description: 'Update one product by Id.'
  })
  @ApiResponse({
    status: 200, description: 'Success-Response',
    schema: {
      example: {
        'result': true,
        'message': 'success message'
      }
    }
  })
  @ApiResponse({
    status: 404, description: 'Error-Response',
    schema: {
      example: {
        'result': false,
        'message': 'Error text'
      }
    }
  })
  @ApiParam({
    name: 'id',
    description: 'Product Id',
    required: true
  })
  @ApiBearerAuth()
  @UseGuards(AuthJwt)
  @Put(':id')
  async update(
    @Param('id')id,
    @Body() update: UpdateProductDto
  ): Promise<IResponse> {
      return this.productService.update(id, update);
  }

  @ApiOperation({
    summary: 'List products',
    description: 'Returns the list of all products with search filter.'
  })
  @ApiResponse({
    status: 200, description: 'Success-Response',
    schema: {
      example: {
        result: true,
        data: []
      }
    }
  })
  @ApiResponse({
    status: 404, description: 'Error-Response',
    schema: {
      example: {
        'result': false,
        'message': 'Error message'
      }
    }
  })
  @ApiQuery({
    name: 'find',
    required: false
  })
  @ApiQuery({
    name: 'priceFrom',
    required: false
  })
  @ApiQuery({
    name: 'priceTo',
    required: false
  })
  @ApiQuery({
    name: 'inStock',
    required: false
  })
  @ApiBearerAuth()
  @UseGuards(AuthJwt)
  @Get()
  list(@Request() { query }): Promise<IResponse> {
    const searchFilter: ISearchFilter = query;
    return this.productService.list(searchFilter);
  }

  @ApiOperation({
    summary: 'Subscribe for product',
    description: 'Subscribe for product and get an email once available in stock'
  })
  @ApiResponse({
    status: 200, description: 'Success-Response',
    schema: {
      example: {
        result: true,
        data: []
      }
    }
  })
  @ApiResponse({
    status: 404, description: 'Error-Response',
    schema: {
      example: {
        'result': false,
        'message': 'Error message'
      }
    }
  })
  @ApiParam({
    name: 'id',
    description: 'Product id'
  })
  @ApiBody({
    description: 'Product quantity for subscription',
    schema: {
      example: {
        qty: 1
      }
    }
  })
  @ApiBearerAuth()
  @UseGuards(AuthJwt)
  @Post('subscribe/:id')
  subscribe(
    @Param('id') productId,
    @Body() { qty },
    @Request() { user: { userId } },
  ): Promise<IResponse> {
    return this.productService.subscribe({ qty, productId, userId });
  }
}
