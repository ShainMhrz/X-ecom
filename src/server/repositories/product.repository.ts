import { prisma } from '../db/prisma';

export class ProductRepository {
  findFeatured(limit = 10) {
    return prisma.product.findMany({
      where: { isFeatured: true, active: true },
      take: limit,
      include: { variants: true, images: true }
    });
  }
  findBySlug(slug: string) {
    return prisma.product.findUnique({ where: { slug }, include: { variants: true, images: true } });
  }
  listAll() {
    return prisma.product.findMany({ include: { variants: true } });
  }
}
