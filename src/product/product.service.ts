import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getMongoManager, getMongoRepository, ObjectID, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { IResponse } from '../interfaces/api-interfaces';
import { mapFromDto, sendUserNotification } from '../helpers/entity-utils';
import { responseToInterface } from '../helpers/return-utils';
import { ISearchFilter } from './interface/search-filter';
import { Product } from './entity/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { ISubscription } from './interface/subscription';
import { UserService } from '../user/user.service';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private userService: UserService,
  ) {
  }

  /**
   * Create new product
   *
   * @param createProductDTO
   */
  async create(createProductDTO: CreateProductDto): Promise<IResponse> {
    const manager = getMongoManager();
    try {
      const product = new Product();
      mapFromDto(product, createProductDTO);
      const newProduct = await manager.save(product);
      return responseToInterface({ _id: newProduct._id });
    } catch (e) {
      return responseToInterface({}, false, e.message);
    }
  }

  /**
   * List Products
   */
  async list(searchFilter: ISearchFilter): Promise<IResponse> {
    console.log(searchFilter);
    try {
      const find = searchFilter.find
        ? new RegExp(`${searchFilter.find}`, 'i')
        : new RegExp(`.*`);
      const inStock = searchFilter.inStock ? searchFilter.inStock : 'both';
      const priceFrom = searchFilter.priceFrom ? +searchFilter.priceFrom : null;
      const priceTo = searchFilter.priceTo ? +searchFilter.priceTo : null;

      const productRepository = getMongoRepository(Product);

      const products = await productRepository.find({
        where: {
          $or: [
            { name: find },
            { 'attributes.color': find },
            { 'attributes.size': find },
          ],
          $and: [
            {
              stock: inStock === 'true'
                ? { $gt: 0 }
                : inStock === 'false'
                  ? { $eq: 0 }
                  : { $gte: 0 },
            },
            {
              price: {
                $gte: priceFrom ? priceFrom : 0,
                $lte: priceTo ? priceTo : Number.POSITIVE_INFINITY,
              },
            },
          ],
        },
      });

      return responseToInterface(products);
    } catch (e) {
      return responseToInterface({}, false, e.message);
    }
  }

  /**
   * Update one product
   *
   * @param id
   * @param updateDTO
   */
  async update(id, updateDTO: UpdateProductDto): Promise<IResponse> {
    try {
      const manager = getMongoManager();
      const currentProduct = await this.findById(id);
      if (!currentProduct)
        throw new BadRequestException({ message: 'Product id Not Found' });

      mapFromDto(currentProduct, updateDTO);

      // If product has subscribers and stock increase then send notification by email
      if (
        currentProduct.subscribers.length &&
        updateDTO.stock > 0
      ) {
        const notifications = [];
        const indexToDelete = [];
        let qty = 0;
        currentProduct.subscribers
          .forEach((subscription, index) => {

            // Notify to customer only while stock is enough
            qty += subscription.qty;
            if (qty <= updateDTO.stock) {
              notifications.push(sendUserNotification(subscription.email, currentProduct.name));
              indexToDelete.push(subscription.email);
            }

          });
        await Promise.all(notifications);
        currentProduct.subscribers = currentProduct.subscribers.filter((subs) => !indexToDelete.includes(subs.email));
        await manager.save(currentProduct);
      }
      return responseToInterface();
    } catch (e) {
      return responseToInterface({}, false, e.message);
    }

  }

  /**
   * Subscribe one user for notification
   *
   * @param subscription
   */
  async subscribe(subscription: ISubscription): Promise<IResponse> {
    try {
      const manager = getMongoManager();
      const { productId, qty, userId } = subscription;
      const { data: { email } } = await this.userService.findById(userId);
      if (!email) throw new UnauthorizedException({ message: 'User Not Found in our system' });
      const product = await this.findById(productId);
      if (!product) throw new BadRequestException({ message: 'Product Id Not Found' });
      const existSubscriptionIndex = product.subscribers
        ? product.subscribers.findIndex((subs) => subs.email === email)
        : null;

      existSubscriptionIndex === null
        ? product.subscribers = [{ qty, email }]
        : existSubscriptionIndex !== -1
          ? product.subscribers[existSubscriptionIndex].qty = qty
          : product.subscribers.push({ qty, email });
      await manager.save(product);
      return responseToInterface();
    } catch (e) {
      return responseToInterface({}, false, e.message);
    }
  }

  /**
   * Delete product by Id
   *
   * @param id
   */
  async delete(id: ObjectID): Promise<IResponse> {
    try {
      const product = await this.productRepository.findOne(id);
      if (product) {
        await this.productRepository.delete(id);
        return responseToInterface(
          {}, true, `Product ${id} deleted successfully.`,
        );
      }
      return responseToInterface(
        {}, true, 'The product id not found in database',
      );
    } catch (e) {
      return responseToInterface({}, false, e.message);
    }
  }

  /**
   * Find product by Id
   *
   * @param productId
   */
  async findById(productId: string): Promise<Product | null> {
    try {
      return this.productRepository.findOne(productId);
    } catch (e) {
      return null;
    }
  }
}
