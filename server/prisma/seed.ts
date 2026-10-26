import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@demoweb.com' },
    update: {},
    create: {
      email: 'admin@demoweb.com',
      name: 'Store Admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });
  console.log(`Admin user ensured: ${admin.email}`);

  const categoriesData = [
    { name: 'Electronics', slug: 'electronics', description: 'Gadgets, devices, and modern accessories.' },
    { name: 'Apparel', slug: 'apparel', description: 'Modern, comfortable fashion and footwear.' },
    { name: 'Home & Living', slug: 'home-living', description: 'Essentials for workspace and living.' },
  ];

  const categoriesMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoriesMap.set(cat.slug, created.id);
  }

  const products = [
    {
      title: 'Wireless Noise-Canceling Headphones',
      slug: 'wireless-noise-canceling-headphones',
      description: 'Premium acoustic architecture with 40-hour battery life and active noise cancellation.',
      price: 29900,
      inventoryCount: 45,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      categoryId: categoriesMap.get('electronics')!,
    },
    {
      title: 'Mechanical Ergonomic Keyboard',
      slug: 'mechanical-ergonomic-keyboard',
      description: 'Hot-swappable switches, PBT keycaps, and custom RGB backlighting.',
      price: 14900,
      inventoryCount: 60,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
      categoryId: categoriesMap.get('electronics')!,
    },
    {
      title: 'Minimalist Oxford Cotton Shirt',
      slug: 'minimalist-oxford-cotton-shirt',
      description: '100% organic combed cotton with tailored fit and reinforced seams.',
      price: 6800,
      inventoryCount: 120,
      imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
      categoryId: categoriesMap.get('apparel')!,
    },
    {
      title: 'Classic Everyday Wool Hoodie',
      slug: 'classic-everyday-wool-hoodie',
      description: 'Heavyweight fleece with brushed interior for thermal comfort and durability.',
      price: 9500,
      inventoryCount: 80,
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
      categoryId: categoriesMap.get('apparel')!,
    },
    {
      title: 'Solid Oak Desk Mat & Stand',
      slug: 'solid-oak-desk-mat-and-stand',
      description: 'Handcrafted sustainably-sourced oak wood monitor riser with integrated cable management.',
      price: 12000,
      inventoryCount: 30,
      imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80',
      categoryId: categoriesMap.get('home-living')!,
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
  }

  console.log(`Seeded ${products.length} products successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
