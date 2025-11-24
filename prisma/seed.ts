// @ts-nocheck
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Create/Update the Theme
  // NOTE: For SQLite, we must stringify the JSON data
  const themeData = JSON.stringify({
    background: '30 20% 98%',
    foreground: '20 14.3% 4.1%',
    primary: '24 90% 35%',
    'primary-foreground': '60 9.1% 97.8%',
    secondary: '35 50% 90%',
    'secondary-foreground': '24 9.8% 10%',
    border: '20 5.9% 90%',
  })

  await prisma.themeSetting.upsert({
    where: { name: 'Earthen' },
    update: {},
    create: {
      name: 'Earthen',
      active: true,
      data: themeData, // Passing stringified JSON
    },
  })

  // 2. Create Admin User
  const adminEmail = 'admin@store.com'
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      password: 'admin123' // Matches the hint in Admin Login page
    },
    create: {
      email: adminEmail,
      name: 'Store Admin',
      password: 'admin123',
      role: 'ADMIN',
    },
  })
  console.log('👤 Admin user created: admin@store.com / admin123')

  // 3. Create Category
  const category = await prisma.category.upsert({
    where: { slug: 'kitchen-vessels' },
    update: {},
    create: {
      name: 'Traditional Vessels',
      slug: 'kitchen-vessels',
    },
  })

  // 3. Create Parent Product
  const product = await prisma.product.upsert({
    where: { slug: 'traditional-handcrafted-vessel' },
    update: {},
    create: {
      title: 'Handcrafted Heritage Vessel',
      slug: 'traditional-handcrafted-vessel',
      description: 'A timeless piece for your kitchen.',
      categoryId: category.id,
      basePrice: 2500,
      isFeatured: true,
      active: true,
    },
  })

  // 4. Create Variants
  const variants = [
    { sku: 'VESSEL-COPPER', name: 'Pure Copper', price: 3500, material: 'Copper' },
    { sku: 'VESSEL-BRASS', name: 'Antique Brass', price: 3200, material: 'Brass' },
    { sku: 'VESSEL-CLAY', name: 'Natural Clay', price: 1200, material: 'Clay' },
  ]

  for (const v of variants) {
    await prisma.productVariant.upsert({
      where: { sku: v.sku },
      update: {},
      create: {
        productId: product.id,
        sku: v.sku,
        price: v.price,
        material: v.material,
        stock: 10,
        isActive: true,
      },
    })
  }
  
  console.log('✨ Variants added successfully.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })