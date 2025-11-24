import { ProductRepository } from '../repositories/product.repository';

const productRepo = new ProductRepository();

export class ProductService {
  static async getHomepageFeatured() {
    return productRepo.findFeatured(4);
  }
  static async getProduct(slug: string) {
    return productRepo.findBySlug(slug);
  }
}
