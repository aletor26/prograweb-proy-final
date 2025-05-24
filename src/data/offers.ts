import type { Product } from './products';

export interface Offer extends Product {
  originalPrice: number;
  discountPercentage: number;
  validUntil: string;
}

export const offers: Offer[] = [
  {
    id: 101,
    name: "Pack Piscos Premium",
    price: 249.99,
    originalPrice: 299.99,
    discountPercentage: 17,
    image: "https://placehold.co/200x300/222222/FFFFFF.png?text=Pack+Piscos",
    category: "Piscos",
    description: "Pack de 3 Piscos Premium: Quebranta, Italia y Acholado",
    validUntil: "2024-05-30"
  },
  {
    id: 102,
    name: "Whisky Escocés 18 años",
    price: 199.99,
    originalPrice: 299.99,
    discountPercentage: 33,
    image: "https://placehold.co/200x300/B7833A/FFFFFF.png?text=Whisky+18",
    category: "Whiskies",
    description: "Whisky escocés premium con 18 años de añejamiento - Edición Limitada",
    validUntil: "2024-05-15"
  },
  {
    id: 103,
    name: "Duo Champagne Brut & Rosé",
    price: 349.99,
    originalPrice: 419.98,
    discountPercentage: 17,
    image: "https://placehold.co/200x300/FFD700/000000.png?text=Duo+Champagne",
    category: "Champagnes",
    description: "Pack especial de Champagne Brut y Rosé para ocasiones especiales",
    validUntil: "2024-05-20"
  },
  {
    id: 104,
    name: "Gin Premium Collection",
    price: 279.99,
    originalPrice: 359.99,
    discountPercentage: 22,
    image: "https://placehold.co/200x300/4682B4/FFFFFF.png?text=Gin+Collection",
    category: "Gin",
    description: "Colección de 3 Gins Premium: London Dry, Rosa y Navy Strength",
    validUntil: "2024-05-25"
  },
  {
    id: 105,
    name: "Vinos del Mundo Set",
    price: 299.99,
    originalPrice: 399.99,
    discountPercentage: 25,
    image: "https://placehold.co/200x300/722F37/FFFFFF.png?text=Vinos+Set",
    category: "Vinos",
    description: "Set de 4 vinos premium de diferentes regiones del mundo",
    validUntil: "2024-05-18"
  }
]; 