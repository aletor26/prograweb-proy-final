export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  active?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Pisco Quebranta Premium",
    price: 89.99,
    image: "https://metroio.vtexassets.com/arquivos/ids/241844-800-auto?v=638173835354700000&width=800&height=auto&aspect=true",
    category: "Piscos",
    description: "Pisco puro de uva quebranta, perfecto para pisco sour",
    active: true
  },
  {
    "id": 2,
    "name": "Marqués de Riscal Rioja Reserva",
    "price": 219.99,
    "image": "https://oechsle.vteximg.com.br/arquivos/ids/16740351-1000-1000/image-022ca51e64404868a95df8833ab60642.jpg?v=638351562203200000",
    "category": "Vinos",
    "description": "Vino tinto reserva con 24 meses de barrica de roble americano, elaborado con uvas Tempranillo, Graciano y Mazuelo.",
    active: true
  },
  {
    "id": 3,
    "name": "Glenfiddich 12 años",
    "price": 189.99,
    "image": "https://wongfood.vtexassets.com/arquivos/ids/710217-800-auto?v=638527201643730000&width=800&height=auto&aspect=true",
    "category": "Whiskies",
    "description": "Whisky escocés de malta única, añejado 12 años en barricas de roble americano y europeo. Sabor suave con toques de pera y roble.",
    active: true
  },
  {
    "id": 4,
    "name": "Ron Diplomático Reserva Exclusiva",
    "price": 119.99,
    "image": "https://wongfood.vtexassets.com/arquivos/ids/758040/frontal-2485.jpg?v=638772465820170000",
    "category": "Rones",
    "description": "Ron añejo premium, destilado en Venezuela y envejecido por más de 12 años en barricas de roble.",
    active: true
  },
  {
    "id": 5,
    "name": "Belvedere Vodka",
    "price": 79.99,
    "image": "https://minuman.com/cdn/shop/products/220493470_10158987281160709_5753452219880279999_n_059c247a-ba86-4d9f-b16e-72e23a645e1b_1200x.jpg?v=1681445662",
    "category": "Vodkas",
    "description": "Vodka premium de trigo polaco, destilado 4 veces para una suavidad inigualable.",
    active: true
  },
  {
    "id": 6,
    "name": "Tanqueray London Dry Gin",
    "price": 94.99,
    "image": "https://plazavea.vteximg.com.br/arquivos/ids/30563616-450-450/20208344.jpg?v=638743843671970000",
    "category": "Gin",
    "description": "Gin estilo London Dry con un equilibrio perfecto de botánicos, incluidos enebro, cilantro y regaliz.",
    active: true
  },
  {
    "id": 7,
    "name": "Patrón Tequila Reposado",
    "price": 139.99,
    "image": "https://bodegaslacatedral.com/cdn/shop/files/Tequila_patron_reposado_bodegas_la_catedral.jpg?v=1704478196&width=640",
    "category": "Tequilas",
    "description": "Tequila reposado 100% agave azul, madurado en barricas de roble durante 6 meses.",
    active: true
  },
  {
    "id": 8,
    "name": "Veuve Clicquot Brut",
    "price": 199.99,
    "image": "https://licoreriasunidas.pe/cdn/shop/files/cuentas-2025-03-24T133207.250.png?v=1742841148",
    "category": "Champagnes",
    "description": "Champagne brut de la región de Champagne, elaborado con un 50-55% de Pinot Noir.",
    active: true
  },
  {
    "id": 9,
    "name": "Pisco Mistral Italia",
    "price": 95.99,
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWMUj9svkCRv-74Nc1WEHIAl7nZXQeyUPm0w&s",
    "category": "Piscos",
    "description": "Pisco aromático de uva Italia, ideal para chilcanos y cócteles.",
    active: true
  },
  {
    "id": 10,
    "name": "Pisco El Gobernador Acholado",
    "price": 92.99,
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd3ld_9Zwk3jN1UJgG0HAc4HTm558rCC21daQ9iy907OzSERKBqnRXyBTHvGxQt-jA2b8&usqp=CAU",
    "category": "Piscos",
    "description": "Blend de uvas pisqueras, con notas florales y frutales, perfecto para cócteles.",
    active: true
  },
  {
    "id": 11,
    "name": "Cloudy Bay Sauvignon Blanc",
    "price": 95.99,
    "image": "https://preview.redd.it/cloudy-bay-sauvignon-blanc-2022-2021-v0-lyjjsc42n5jc1.jpg?width=640&crop=smart&auto=webp&s=05517902c83f4f122df761ef7368726bf002156a",
    "category": "Vinos",
    "description": "Vino blanco de Nueva Zelanda con notas de cítricos frescos, hierba y un toque mineral, ideal para maridar con mariscos.",
    active: true
  },
  {
    "id": 12,
    "name": "Trapiche Malbec",
    "price": 110.99,
    "image": "https://plazavea.vteximg.com.br/arquivos/ids/324548-450-450/1991936002.jpg?v=637252467216770000",
    "category": "Vinos",
    "description": "Vino tinto argentino con cuerpo robusto y taninos suaves, ideal para carnes.",
    active: true
  },
  {
    "id": 13,
    "name": "Woodford Reserve Bourbon",
    "price": 145.99,
    "image": "https://topshelfwineandspirits.com/cdn/shop/products/Screenshot2023-01-10at11.53.11AM.jpg?v=1673380771&width=2068",
    "category": "Whiskies",
    "description": "Bourbon americano añejado en barricas nuevas de roble, con toques de vainilla y caramelo.",
    active: true
  },
  {
    "id": 14,
    "name": "Jameson Irish Whiskey",
    "price": 139.99,
    "image": "https://wongfood.vtexassets.com/arquivos/ids/386954/395600-1.jpg?v=637385130583200000",
    "category": "Whiskies",
    "description": "Whisky irlandés triple destilado, suave y elegante con notas de vainilla y miel.",
    active: true
  },
  {
    "id": 15,
    "name": "Ron Bacardi Superior Blanco",
    "price": 79.99,
    "image": "https://wongfood.vtexassets.com/arquivos/ids/506669/324681-01-8500.jpg?v=637759210275530000",
    "category": "Rones",
    "description": "Ron blanco premium, perfecto para cócteles como mojitos o piña colada.",
    active: true
  },
  {
    "id": 16,
    "name": "Ron Flor de Caña 18 Años",
    "price": 189.99,
    "image": "https://media.falabella.com/tottusPE/40001413_1/w=1500,h=1500,fit=pad",
    "category": "Rones",
    "description": "Ron extra añejo nicaragüense, envejecido 18 años en barricas de roble.",
    active: true
  },
  {
    "id": 17,
    "name": "Absolut Raspberry Vodka",
    "price": 85.99,
    "image": "https://plazavea.vteximg.com.br/arquivos/ids/16778531-450-450/20283104.jpg?v=637974199978200000",
    "category": "Vodkas",
    "description": "Vodka premium con un delicioso sabor natural a frambuesa.",
    active: true
  },
  {
    "id": 18,
    "name": "Grey Goose Vodka",
    "price": 92.99,
    "image": "https://plazavea.vteximg.com.br/arquivos/ids/4220549-450-450/983714.jpg?v=637751865352130000",
    "category": "Vodkas",
    "description": "Vodka premium elaborado con trigo de la más alta calidad, destilado 5 veces.",
    active: true
  },
  {
    "id": 19,
    "name": "Hendrick's Gin",
    "price": 99.99,
    "image": "https://plazavea.vteximg.com.br/arquivos/ids/30249371-450-450/20093025.jpg?v=638682048920770000",
    "category": "Gin",
    "description": "Gin con infusión de pepino y pétalos de rosa, muy suave y refrescante.",
    active: true
  },
  {
    "id": 20,
    "name": "Bombay Sapphire Navy Strength Gin",
    "price": 115.99,
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj78qGk93WS27NS_SoZ6A40RrK9tXcbhDAfQ&s",
    "category": "Gin",
    "description": "Gin de alta graduación, con botánicos intensos y un sabor fuerte y delicioso.",
    active: true
  },
  {
    "id": 21,
    "name": "Patrón Tequila Blanco",
    "price": 89.99,
    "image": "https://wongfood.vtexassets.com/arquivos/ids/768965/Tequila-Blanco-Patr-n-Silver-Botella-700ml-1-8494.jpg?v=638826682136070000",
    "category": "Tequilas",
    "description": "Tequila blanco 100% agave azul, ideal para cócteles como margaritas.",
    active: true
  },
  {
    "id": 22,
    "name": "Don Julio 1942 Añejo",
    "price": 179.99,
    "image": "https://licoreriasunidas.pe/cdn/shop/products/tequila-don-julio-1942-botella-750ml.webp?v=1677796941",
    "category": "Tequilas",
    "description": "Tequila añejado más de 3 años en barricas de roble, con un sabor suave y elegante.",
    active: true
  },
  {
    "id": 23,
    "name": "Dom Pérignon Rosé Champagne",
    "price": 219.99,
    "image": "https://licoreriasunidas.pe/cdn/shop/products/champagne-don-perignon-rose-vintage-botella-750ml.webp?v=1677518169",
    "category": "Champagnes",
    "description": "Champagne rosé de lujo, con notas de frutos rojos y un final largo y cremoso.",
    active: true
  },
  {
    "id": 24,
    "name": "Krug Vintage Champagne",
    "price": 299.99,
    "image": "https://cdn11.bigcommerce.com/s-9hu30/images/stencil/2048x2048/products/1751/4257/krug_vintage_brut_2011__88923.1725472765.jpg?c=2",
    "category": "Champagnes",
    "description": "Champagne vintage de la región de Champagne, elaborado con una sola cosecha de excepcional calidad.",
    active: true
  }
];

// Initialize products in localStorage if they don't exist
export const initializeProducts = () => {
  const storedProducts = localStorage.getItem('products');
  if (!storedProducts || JSON.parse(storedProducts).length === 0) {
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