export interface ISearchFilter {

  /**
   * Search for name, description or attribute that matches with find criteria
   * body ex. { find: 'shoes' | 42 | 'red' }
   */
  find: string;

  /**
   * minimum price to search product
   * body ex. { priceFrom: 20.00 }
   */
  priceFrom: number;

  /**
   * maximum price to search product
   * body ex. { priceFrom: 100.00 }
   */
  priceTo: number;

  /**
   * flag for search if product has in stock > 0
   * ex. { inStock: true }
   */
  inStock: 'true' | 'false' | 'both';
}