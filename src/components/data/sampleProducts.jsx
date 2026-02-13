// Sample products data for localStorage
export const sampleProducts = [
  {
    id: '1',
    name: 'Organic Turmeric Powder',
    description: 'Premium organic turmeric powder with high curcumin content. Known for its anti-inflammatory and antioxidant properties.',
    short_description: 'Premium organic turmeric with high curcumin',
    price: 24.99,
    original_price: 29.99,
    category: 'herbs',
    image_url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&q=80',
    stock: 50,
    featured: true,
    rating: 4.8,
    review_count: 124,
    benefits: ['Anti-inflammatory', 'Boosts immunity', 'Supports joint health'],
    ingredients: '100% Organic Turmeric Root Powder',
    created_date: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Ashwagandha Root Extract',
    description: 'Pure ashwagandha root extract to support stress relief and energy. Traditionally used in Ayurvedic medicine.',
    short_description: 'Stress relief and energy support',
    price: 32.99,
    original_price: null,
    category: 'supplements',
    image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
    stock: 35,
    featured: true,
    rating: 4.9,
    review_count: 89,
    benefits: ['Reduces stress', 'Increases energy', 'Improves focus'],
    ingredients: 'Ashwagandha Root Extract 600mg',
    created_date: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Chamomile Herbal Tea',
    description: 'Calming chamomile tea blend for relaxation and better sleep. Made from premium dried chamomile flowers.',
    short_description: 'Calming tea for relaxation and sleep',
    price: 18.99,
    original_price: 22.99,
    category: 'teas',
    image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80',
    stock: 100,
    featured: true,
    rating: 4.7,
    review_count: 156,
    benefits: ['Promotes relaxation', 'Aids sleep', 'Soothes digestion'],
    ingredients: 'Organic Chamomile Flowers',
    created_date: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Lavender Essential Oil',
    description: 'Pure therapeutic-grade lavender essential oil. Perfect for aromatherapy, relaxation, and skin care.',
    short_description: 'Pure lavender oil for aromatherapy',
    price: 28.99,
    original_price: null,
    category: 'oils',
    image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
    stock: 45,
    featured: true,
    rating: 4.9,
    review_count: 203,
    benefits: ['Promotes calm', 'Aids sleep', 'Natural skin care'],
    ingredients: '100% Pure Lavender Essential Oil',
    created_date: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Aloe Vera Gel',
    description: 'Organic aloe vera gel for skin hydration and soothing. Made from freshly harvested aloe leaves.',
    short_description: 'Organic gel for skin hydration',
    price: 19.99,
    original_price: 24.99,
    category: 'skincare',
    image_url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80',
    stock: 80,
    featured: false,
    rating: 4.6,
    review_count: 98,
    benefits: ['Hydrates skin', 'Soothes irritation', 'Natural moisturizer'],
    ingredients: '99% Pure Organic Aloe Vera Gel',
    created_date: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Ginger Root Capsules',
    description: 'Natural ginger root capsules for digestive health and immunity support.',
    short_description: 'Digestive health support',
    price: 21.99,
    original_price: null,
    category: 'supplements',
    image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80',
    stock: 60,
    featured: true,
    rating: 4.5,
    review_count: 67,
    benefits: ['Aids digestion', 'Reduces nausea', 'Anti-inflammatory'],
    ingredients: 'Organic Ginger Root Extract 500mg',
    created_date: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Peppermint Tea Blend',
    description: 'Refreshing peppermint tea for digestive comfort and mental clarity.',
    short_description: 'Refreshing tea for digestion',
    price: 15.99,
    original_price: null,
    category: 'teas',
    image_url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80',
    stock: 90,
    featured: false,
    rating: 4.7,
    review_count: 112,
    benefits: ['Aids digestion', 'Refreshing taste', 'Mental clarity'],
    ingredients: 'Organic Peppermint Leaves',
    created_date: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Eucalyptus Essential Oil',
    description: 'Pure eucalyptus oil for respiratory support and aromatherapy.',
    short_description: 'Respiratory support oil',
    price: 22.99,
    original_price: 26.99,
    category: 'oils',
    image_url: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=800&q=80',
    stock: 55,
    featured: true,
    rating: 4.8,
    review_count: 145,
    benefits: ['Respiratory support', 'Clears sinuses', 'Energizing aroma'],
    ingredients: '100% Pure Eucalyptus Essential Oil',
    created_date: new Date().toISOString()
  }
];

// Initialize products in localStorage
export const initializeProducts = () => {
  const existingProducts = localStorage.getItem('drherbs_products');
  if (!existingProducts) {
    localStorage.setItem('drherbs_products', JSON.stringify(sampleProducts));
  }
  return JSON.parse(localStorage.getItem('drherbs_products') || '[]');
};

// Get all products
export const getProducts = () => {
  initializeProducts();
  return JSON.parse(localStorage.getItem('drherbs_products') || '[]');
};

// Get featured products
export const getFeaturedProducts = () => {
  return getProducts().filter(p => p.featured);
};

// Get product by ID
export const getProductById = (id) => {
  return getProducts().find(p => p.id === id);
};

// Filter products by category
export const getProductsByCategory = (category) => {
  return getProducts().filter(p => p.category === category);
};

// Create product
export const createProduct = (productData) => {
  const products = getProducts();
  const newProduct = {
    ...productData,
    id: Date.now().toString(),
    created_date: new Date().toISOString()
  };
  products.push(newProduct);
  localStorage.setItem('drherbs_products', JSON.stringify(products));
  return newProduct;
};

// Update product
export const updateProduct = (id, data) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...data };
    localStorage.setItem('drherbs_products', JSON.stringify(products));
    return products[index];
  }
  return null;
};

// Delete product
export const deleteProduct = (id) => {
  const products = getProducts().filter(p => p.id !== id);
  localStorage.setItem('drherbs_products', JSON.stringify(products));
};

// Orders
export const getOrders = () => {
  return JSON.parse(localStorage.getItem('drherbs_orders') || '[]');
};

export const createOrder = (orderData) => {
  const orders = getOrders();
  const newOrder = {
    ...orderData,
    id: Date.now().toString(),
    created_date: new Date().toISOString(),
    status: 'pending'
  };
  orders.unshift(newOrder);
  localStorage.setItem('drherbs_orders', JSON.stringify(orders));
  return newOrder;
};

export const updateOrder = (id, data) => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index !== -1) {
    orders[index] = { ...orders[index], ...data };
    localStorage.setItem('drherbs_orders', JSON.stringify(orders));
    return orders[index];
  }
  return null;
};

// Reviews
export const getReviews = (productId) => {
  const allReviews = JSON.parse(localStorage.getItem('drherbs_reviews') || '[]');
  if (productId) {
    return allReviews.filter(r => r.product_id === productId);
  }
  return allReviews;
};

export const createReview = (reviewData) => {
  const reviews = getReviews();
  const newReview = {
    ...reviewData,
    id: Date.now().toString(),
    created_date: new Date().toISOString()
  };
  reviews.unshift(newReview);
  localStorage.setItem('drherbs_reviews', JSON.stringify(reviews));
  return newReview;
};