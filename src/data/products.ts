export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Pisco Quebranta Premium",
    price: 89.99,
    image: "https://placehold.co/200x300/222222/FFFFFF.png?text=Pisco",
    category: "Piscos",
    description: "Pisco puro de uva quebranta, perfecto para pisco sour"
  },
  {
    id: 2,
    name: "Vino Tinto Reserva",
    price: 129.99,
    image: "https://placehold.co/200x300/722F37/FFFFFF.png?text=Vino",
    category: "Vinos",
    description: "Vino tinto reserva con 24 meses de barrica"
  },
  {
    id: 3,
    name: "Whisky Escocés 12 años",
    price: 159.99,
    image: "https://placehold.co/200x300/B7833A/FFFFFF.png?text=Whisky",
    category: "Whiskies",
    description: "Whisky escocés de malta única, añejado 12 años"
  },
  {
    id: 4,
    name: "Ron Añejo Premium",
    price: 119.99,
    image: "https://placehold.co/200x300/8B4513/FFFFFF.png?text=Ron",
    category: "Rones",
    description: "Ron añejo premium, perfecto para degustar"
  },
  {
    id: 5,
    name: "Vodka Premium",
    price: 79.99,
    image: "https://placehold.co/200x300/C0C0C0/000000.png?text=Vodka",
    category: "Vodkas",
    description: "Vodka premium destilado 5 veces"
  },
  {
    id: 6,
    name: "Gin London Dry",
    price: 94.99,
    image: "https://placehold.co/200x300/4682B4/FFFFFF.png?text=Gin",
    category: "Gin",
    description: "Gin estilo London Dry con botánicos seleccionados"
  },
  {
    id: 7,
    name: "Tequila Reposado",
    price: 139.99,
    image: "https://placehold.co/200x300/DAA520/000000.png?text=Tequila",
    category: "Tequilas",
    description: "Tequila 100% agave reposado en barricas de roble"
  },
  {
    id: 8,
    name: "Champagne Brut",
    price: 199.99,
    image: "https://placehold.co/200x300/FFD700/000000.png?text=Champagne",
    category: "Champagnes",
    description: "Champagne brut de la región de Champagne"
  },
  {
    id: 9,
    name: "Pisco Italia",
    price: 95.99,
    image: "https://placehold.co/200x300/222222/FFFFFF.png?text=Pisco",
    category: "Piscos",
    description: "Pisco aromático de uva Italia, ideal para chilcanos"
  },
  {
    id: 10,
    name: "Pisco Acholado",
    price: 92.99,
    image: "https://placehold.co/200x300/222222/FFFFFF.png?text=Pisco",
    category: "Piscos",
    description: "Blend de diferentes variedades de uvas pisqueras"
  },
  {
    id: 11,
    name: "Vino Blanco Chardonnay",
    price: 85.99,
    image: "https://placehold.co/200x300/F0E68C/000000.png?text=Vino",
    category: "Vinos",
    description: "Vino blanco con notas de frutas tropicales y vainilla"
  },
  {
    id: 12,
    name: "Vino Malbec",
    price: 110.99,
    image: "https://placehold.co/200x300/722F37/FFFFFF.png?text=Vino",
    category: "Vinos",
    description: "Vino tinto argentino con cuerpo robusto y taninos suaves"
  },
  {
    id: 13,
    name: "Whisky Bourbon",
    price: 145.99,
    image: "https://placehold.co/200x300/B7833A/FFFFFF.png?text=Whisky",
    category: "Whiskies",
    description: "Bourbon americano añejado en barricas nuevas de roble"
  },
  {
    id: 14,
    name: "Whisky Irlandés",
    price: 139.99,
    image: "https://placehold.co/200x300/B7833A/FFFFFF.png?text=Whisky",
    category: "Whiskies",
    description: "Whisky irlandés triple destilado, suave y elegante"
  },
  {
    id: 15,
    name: "Ron Blanco Premium",
    price: 79.99,
    image: "https://placehold.co/200x300/FFFFFF/000000.png?text=Ron",
    category: "Rones",
    description: "Ron blanco premium, perfecto para cócteles"
  },
  {
    id: 16,
    name: "Ron Extra Añejo",
    price: 189.99,
    image: "https://placehold.co/200x300/8B4513/FFFFFF.png?text=Ron",
    category: "Rones",
    description: "Ron extra añejo con más de 15 años de añejamiento"
  },
  {
    id: 17,
    name: "Vodka Sabor Frambuesa",
    price: 85.99,
    image: "https://placehold.co/200x300/FF69B4/FFFFFF.png?text=Vodka",
    category: "Vodkas",
    description: "Vodka premium con sabor natural a frambuesa"
  },
  {
    id: 18,
    name: "Vodka de Trigo",
    price: 92.99,
    image: "https://placehold.co/200x300/C0C0C0/000000.png?text=Vodka",
    category: "Vodkas",
    description: "Vodka premium elaborado 100% con trigo seleccionado"
  },
  {
    id: 19,
    name: "Gin Rosa",
    price: 99.99,
    image: "https://placehold.co/200x300/FFB6C1/000000.png?text=Gin",
    category: "Gin",
    description: "Gin con infusión de frutos rojos y pétalos de rosa"
  },
  {
    id: 20,
    name: "Gin Premium Navy Strength",
    price: 115.99,
    image: "https://placehold.co/200x300/4682B4/FFFFFF.png?text=Gin",
    category: "Gin",
    description: "Gin de alta graduación con botánicos intensos"
  },
  {
    id: 21,
    name: "Tequila Blanco",
    price: 89.99,
    image: "https://placehold.co/200x300/FFFFFF/000000.png?text=Tequila",
    category: "Tequilas",
    description: "Tequila 100% agave azul, sin añejar"
  },
  {
    id: 22,
    name: "Tequila Añejo",
    price: 179.99,
    image: "https://placehold.co/200x300/DAA520/000000.png?text=Tequila",
    category: "Tequilas",
    description: "Tequila añejado por más de 3 años en barricas de roble"
  },
  {
    id: 23,
    name: "Champagne Rosé",
    price: 219.99,
    image: "https://placehold.co/200x300/FFB6C1/000000.png?text=Champagne",
    category: "Champagnes",
    description: "Champagne rosé con notas de frutos rojos"
  },
  {
    id: 24,
    name: "Champagne Vintage",
    price: 299.99,
    image: "https://placehold.co/200x300/FFD700/000000.png?text=Champagne",
    category: "Champagnes",
    description: "Champagne vintage de una cosecha excepcional"
  }
];

// Initialize products in localStorage if they don't exist
export const initializeProducts = () => {
  const storedProducts = localStorage.getItem('products');
  if (!storedProducts) {
    localStorage.setItem('products', JSON.stringify(products));
  }
};

// Get all products from localStorage
export const getProducts = (): Product[] => {
  const storedProducts = localStorage.getItem('products');
  return storedProducts ? JSON.parse(storedProducts) : [];
};

// Add a new product
export const addProduct = (product: Omit<Product, 'id'>): Product => {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
  };
  products.push(newProduct);
  localStorage.setItem('products', JSON.stringify(products));
  return newProduct;
};

// Update an existing product
export const updateProduct = (product: Product): void => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index !== -1) {
    products[index] = product;
    localStorage.setItem('products', JSON.stringify(products));
  }
};

// Delete a product
export const deleteProduct = (id: number): void => {
  const products = getProducts();
  const filteredProducts = products.filter(p => p.id !== id);
  localStorage.setItem('products', JSON.stringify(filteredProducts));
}; 