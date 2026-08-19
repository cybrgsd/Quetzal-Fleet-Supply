import React, { useState, useMemo, useRef, useEffect } from "react";
import { ShoppingCart, Plus, Minus, X, Check, ChevronRight, ChevronLeft, Anchor, MessageCircle, Globe } from "lucide-react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
`;

const COLORS = {
  navy: "#0E1E2E",
  navyMid: "#1C3350",
  steel: "#56626D",
  amber: "#A9863F",
  paper: "#F4F4F1",
  ink: "#1B2430",
  rust: "#6E2A2A",
  white: "#FFFFFF",
  panel: "#E6E7E3",
};

const EXCHANGE_RATE = 7.75; // GTQ per 1 USD (referencial / reference rate)

const CATEGORIES = [
  { id: "carne_res", code: "CARN", label: { es: "Carne de res", en: "Beef" }, emoji: "🥩" },
  { id: "aves", code: "AVES", label: { es: "Aves", en: "Poultry" }, emoji: "🍗" },
  { id: "carne_cerdo", code: "CERD", label: { es: "Carne de cerdo", en: "Pork" }, emoji: "🥓" },
  { id: "marisco", code: "MAR", label: { es: "Mariscos", en: "Seafood" }, emoji: "🦐" },
  { id: "embutidos", code: "EMBU", label: { es: "Embutidos", en: "Deli & sausages" }, emoji: "🌭" },
  { id: "congelados", code: "CONG", label: { es: "Congelados", en: "Frozen" }, emoji: "🧊" },
  { id: "lacteos", code: "LACT", label: { es: "Lácteos", en: "Dairy" }, emoji: "🧀" },
  { id: "secos_granos", code: "GRAN", label: { es: "Secos y granos", en: "Dry goods & grains" }, emoji: "🌾" },
  { id: "bebidas", code: "BEB", label: { es: "Bebidas, gaseosas y jugos", en: "Beverages, sodas & juices" }, emoji: "🥤" },
  { id: "galletas_snacks", code: "SNK", label: { es: "Galletas y snacks", en: "Cookies & snacks" }, emoji: "🍪" },
  { id: "enlatados", code: "ENL", label: { es: "Enlatados", en: "Canned goods" }, emoji: "🥫" },
  { id: "panaderia", code: "PAN", label: { es: "Panadería, harinas y féculas", en: "Bakery, flours & starches" }, emoji: "🍞" },
  { id: "infusiones", code: "INF", label: { es: "Infusiones", en: "Coffee & tea" }, emoji: "☕" },
  { id: "grasas_aceites", code: "ACEI", label: { es: "Grasas y aceites", en: "Fats & oils" }, emoji: "🛢️" },
  { id: "condimentos", code: "COND", label: { es: "Condimentos", en: "Condiments & seasonings" }, emoji: "🧂" },
  { id: "limpieza", code: "LIMP", label: { es: "Limpieza, utensilios y otros", en: "Cleaning, utensils & other" }, emoji: "🧹" },
  { id: "puente", code: "PUEN", label: { es: "Puente (bebidas extra)", en: "Bridge supplies (extra drinks)" }, emoji: "🥤" },
  { id: "anexo_cocina", code: "ANEX", label: { es: "Anexo cocina", en: "Kitchen annex" }, emoji: "🍽️" },
];

const PRODUCTS = [
  { id: 1, category: "carne_res", price: 42, name: { es: "Bola de res o palomilla", en: "Beef round (bola)" }, unit: { es: "KG", en: "kg" } },
  { id: 2, category: "carne_res", price: 38, name: { es: "Carne molida", en: "Ground beef" }, unit: { es: "KG", en: "kg" } },
  { id: 3, category: "carne_res", price: 45, name: { es: "Costilla de res", en: "Beef short ribs" }, unit: { es: "KG", en: "kg" } },
  { id: 4, category: "carne_res", price: 40, name: { es: "Falda de res", en: "Beef flank" }, unit: { es: "KG", en: "kg" } },
  { id: 5, category: "carne_res", price: 320, name: { es: "Hamburguesas en caja (4 oz, 72 p/caja)", en: "Beef burger patties, boxed (4 oz, 72/box)" }, unit: { es: "PAQUETES", en: "packs" } },
  { id: 6, category: "carne_res", price: 28, name: { es: "Hígado de res", en: "Beef liver" }, unit: { es: "KG", en: "kg" } },
  { id: 7, category: "carne_res", price: 22, name: { es: "Hueso blanco de res, cortado carnudo", en: "Beef soup bones, meaty cut" }, unit: { es: "KG", en: "kg" } },
  { id: 8, category: "carne_res", price: 95, name: { es: "Lomo ancho / entrecot", en: "Beef ribeye" }, unit: { es: "KG", en: "kg" } },
  { id: 9, category: "carne_res", price: 130, name: { es: "Lomo fino / solomillo", en: "Beef tenderloin" }, unit: { es: "KG", en: "kg" } },
  { id: 10, category: "carne_res", price: 48, name: { es: "Rabo entero", en: "Beef oxtail" }, unit: { es: "KG", en: "kg" } },
  { id: 11, category: "carne_res", price: 35, name: { es: "Zancarrón o lagarto", en: "Beef shank" }, unit: { es: "KG", en: "kg" } },
  { id: 12, category: "aves", price: 26, name: { es: "Alas de pollo, funda 1kg", en: "Chicken wings, 1kg bag" }, unit: { es: "KG", en: "kg" } },
  { id: 13, category: "aves", price: 85, name: { es: "Gallina de campo", en: "Free-range hen" }, unit: { es: "UDS", en: "units" } },
  { id: 14, category: "aves", price: 24, name: { es: "Muslos de pollo", en: "Chicken thighs" }, unit: { es: "KG", en: "kg" } },
  { id: 15, category: "aves", price: 20, name: { es: "Pollo entero", en: "Whole chicken" }, unit: { es: "KG", en: "kg" } },
  { id: 16, category: "carne_cerdo", price: 42, name: { es: "Chuletas de cerdo, sin hueso", en: "Pork chops, boneless" }, unit: { es: "KG", en: "kg" } },
  { id: 17, category: "carne_cerdo", price: 50, name: { es: "Costillas de cerdo, magras, sin manteca", en: "Pork ribs, lean, no fat" }, unit: { es: "KG", en: "kg" } },
  { id: 18, category: "carne_cerdo", price: 44, name: { es: "Lomo de cerdo", en: "Pork loin" }, unit: { es: "KG", en: "kg" } },
  { id: 19, category: "carne_cerdo", price: 55, name: { es: "Lomo fino de cerdo", en: "Pork tenderloin" }, unit: { es: "KG", en: "kg" } },
  { id: 20, category: "carne_cerdo", price: 20, name: { es: "Patitas de cerdo", en: "Pork feet" }, unit: { es: "KG", en: "kg" } },
  { id: 21, category: "marisco", price: 65, name: { es: "Calamar grande fresco, entero", en: "Fresh squid, whole, large" }, unit: { es: "KG", en: "kg" } },
  { id: 22, category: "marisco", price: 95, name: { es: "Calamar limpio, filete", en: "Squid, cleaned fillet" }, unit: { es: "KG", en: "kg" } },
  { id: 23, category: "marisco", price: 120, name: { es: "Camarón 31/35", en: "Shrimp, 31/35 count" }, unit: { es: "KG", en: "kg" } },
  { id: 24, category: "marisco", price: 68, name: { es: "Camotillo / pargo (1.5 lb/u)", en: "Red snapper (1.5 lb/ea)" }, unit: { es: "UDS", en: "units" } },
  { id: 25, category: "marisco", price: 90, name: { es: "Concha sacada, talla L", en: "Shucked clam meat, large" }, unit: { es: "KG", en: "kg" } },
  { id: 26, category: "marisco", price: 70, name: { es: "Corvina fresca (1.5 lb/u)", en: "Fresh corvina (1.5 lb/ea)" }, unit: { es: "KG", en: "kg" } },
  { id: 27, category: "marisco", price: 180, name: { es: "Langostino U10", en: "Jumbo prawns, U10" }, unit: { es: "KG", en: "kg" } },
  { id: 28, category: "marisco", price: 85, name: { es: "Mixtura de mariscos", en: "Mixed seafood" }, unit: { es: "KG", en: "kg" } },
  { id: 29, category: "marisco", price: 110, name: { es: "Pulpo, tentáculos", en: "Octopus tentacles" }, unit: { es: "KG", en: "kg" } },
  { id: 30, category: "embutidos", price: 65, name: { es: "Chistorra", en: "Chistorra sausage" }, unit: { es: "KG", en: "kg" } },
  { id: 31, category: "embutidos", price: 55, name: { es: "Chorizo parrillero, tipo II", en: "Grilling chorizo, type II" }, unit: { es: "KG", en: "kg" } },
  { id: 32, category: "embutidos", price: 48, name: { es: "Chorizo vela extra", en: "Extra dry-cured chorizo" }, unit: { es: "BARRAS", en: "bars" } },
  { id: 33, category: "embutidos", price: 580, name: { es: "Jamón serrano deshuesado, pieza 5kg", en: "Boneless serrano ham, 5kg piece" }, unit: { es: "PIEZA", en: "piece" } },
  { id: 34, category: "embutidos", price: 210, name: { es: "Jamón tipo II, variedad para sándwich, 3.5kg", en: "Sandwich-style ham, 3.5kg" }, unit: { es: "PIEZA", en: "piece" } },
  { id: 35, category: "embutidos", price: 95, name: { es: "Mortadela bologna", en: "Bologna mortadella" }, unit: { es: "BARRAS", en: "bars" } },
  { id: 36, category: "embutidos", price: 85, name: { es: "Mortadela especial con grasa", en: "Mortadella, fatty style" }, unit: { es: "BARRAS", en: "bars" } },
  { id: 37, category: "embutidos", price: 70, name: { es: "Pepperoni", en: "Pepperoni" }, unit: { es: "KG", en: "kg" } },
  { id: 38, category: "embutidos", price: 68, name: { es: "Salami cocido", en: "Cooked salami" }, unit: { es: "KG", en: "kg" } },
  { id: 39, category: "embutidos", price: 42, name: { es: "Salchicha de pollo", en: "Chicken sausage" }, unit: { es: "KG", en: "kg" } },
  { id: 40, category: "embutidos", price: 45, name: { es: "Salchichas de carne", en: "Beef hot dogs" }, unit: { es: "KG", en: "kg" } },
  { id: 41, category: "embutidos", price: 65, name: { es: "Tocino en rebanadas", en: "Sliced bacon" }, unit: { es: "KG", en: "kg" } },
  { id: 42, category: "congelados", price: 210, name: { es: "Coliflor congelada, 2.5kg x4", en: "Frozen cauliflower, 2.5kg x4" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 43, category: "congelados", price: 35, name: { es: "Helado de vainilla, 1lt", en: "Vanilla ice cream, 1L" }, unit: { es: "LITROS", en: "liters" } },
  { id: 44, category: "congelados", price: 320, name: { es: "Maíz dulce congelado, 24 latas", en: "Frozen sweet corn, 24 cans" }, unit: { es: "CAJA", en: "box" } },
  { id: 45, category: "congelados", price: 28, name: { es: "Masa para pizza, familiar x2 discos", en: "Pizza dough, family x2 rounds" }, unit: { es: "FUNDAS", en: "bags" } },
  { id: 46, category: "congelados", price: 32, name: { es: "Masa de hojaldre", en: "Puff pastry dough" }, unit: { es: "UDS", en: "units" } },
  { id: 47, category: "congelados", price: 45, name: { es: "Masa para empanadas x20", en: "Empanada dough, x20" }, unit: { es: "UDS", en: "units" } },
  { id: 48, category: "congelados", price: 12, name: { es: "Pan baguette congelado 250g", en: "Frozen baguette, 250g" }, unit: { es: "UDS", en: "units" } },
  { id: 49, category: "congelados", price: 22, name: { es: "Pan de yuca congelado 500g", en: "Frozen yuca bread, 500g" }, unit: { es: "PAQUETES", en: "packs" } },
  { id: 50, category: "congelados", price: 30, name: { es: "Pulpa de naranja, 1kg", en: "Orange pulp, 1kg" }, unit: { es: "KG", en: "kg" } },
  { id: 51, category: "congelados", price: 32, name: { es: "Pulpa de fresa, 1kg", en: "Strawberry pulp, 1kg" }, unit: { es: "KG", en: "kg" } },
  { id: 52, category: "congelados", price: 34, name: { es: "Pulpa de maracuyá, 1kg", en: "Passion fruit pulp, 1kg" }, unit: { es: "KG", en: "kg" } },
  { id: 53, category: "congelados", price: 28, name: { es: "Pulpa de piña, 1kg", en: "Pineapple pulp, 1kg" }, unit: { es: "KG", en: "kg" } },
  { id: 54, category: "congelados", price: 26, name: { es: "Pulpa de coco, 1kg", en: "Coconut pulp, 1kg" }, unit: { es: "KG", en: "kg" } },
  { id: 55, category: "congelados", price: 22, name: { es: "Vainita precocida recortada, 1kg", en: "Precooked trimmed green beans, 1kg" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 56, category: "lacteos", price: 42, name: { es: "Crema de leche, 1lt", en: "Heavy cream, 1L" }, unit: { es: "LITROS", en: "liters" } },
  { id: 57, category: "lacteos", price: 8, name: { es: "Flan sabor a vainilla", en: "Vanilla flan mix" }, unit: { es: "CAJITAS", en: "small boxes" } },
  { id: 58, category: "lacteos", price: 6, name: { es: "Gelatina sin sabor, 30g", en: "Unflavored gelatin, 30g" }, unit: { es: "CAJITAS", en: "small boxes" } },
  { id: 59, category: "lacteos", price: 32, name: { es: "Huevos en cubetas x30", en: "Eggs, flats of 30" }, unit: { es: "CUBETAS", en: "flats (30)" } },
  { id: 60, category: "lacteos", price: 14, name: { es: "Leche chocolatada", en: "Chocolate milk" }, unit: { es: "LITROS", en: "liters" } },
  { id: 61, category: "lacteos", price: 13, name: { es: "Leche entera, caja 12x1lt", en: "Whole milk, box 12x1L" }, unit: { es: "LITROS", en: "liters" } },
  { id: 62, category: "lacteos", price: 9, name: { es: "Leche evaporada", en: "Evaporated milk" }, unit: { es: "UDS", en: "units" } },
  { id: 63, category: "lacteos", price: 12, name: { es: "Leche semidescremada", en: "Semi-skim milk" }, unit: { es: "LITROS", en: "liters" } },
  { id: 64, category: "lacteos", price: 48, name: { es: "Mantequilla, tarro 500g", en: "Butter, 500g tub" }, unit: { es: "UDS", en: "units" } },
  { id: 65, category: "lacteos", price: 22, name: { es: "Margarina, 500g", en: "Margarine, 500g" }, unit: { es: "TARRINAS", en: "tubs" } },
  { id: 66, category: "lacteos", price: 38, name: { es: "Nata líquida, 1lt", en: "Liquid table cream, 1L" }, unit: { es: "UDS", en: "units" } },
  { id: 67, category: "lacteos", price: 210, name: { es: "Queso cheddar, barra 2.5kg", en: "Cheddar cheese, 2.5kg block" }, unit: { es: "BARRA", en: "bar" } },
  { id: 68, category: "lacteos", price: 22, name: { es: "Queso crema, 250g", en: "Cream cheese, 250g" }, unit: { es: "TARRINAS", en: "tubs" } },
  { id: 69, category: "lacteos", price: 26, name: { es: "Queso criollo duro", en: "Hard local cheese" }, unit: { es: "LIBRAS", en: "lb" } },
  { id: 70, category: "lacteos", price: 85, name: { es: "Queso en porciones para piqueo", en: "Cheese, snack portions" }, unit: { es: "BARRAS", en: "bars" } },
  { id: 71, category: "lacteos", price: 32, name: { es: "Queso mozzarella rallado, funda 400g", en: "Shredded mozzarella, 400g bag" }, unit: { es: "FUNDAS", en: "bags" } },
  { id: 72, category: "lacteos", price: 95, name: { es: "Queso parmesano, 500g", en: "Parmesan cheese, 500g" }, unit: { es: "FUNDAS", en: "bags" } },
  { id: 73, category: "lacteos", price: 24, name: { es: "Yogurt, 1lt", en: "Yogurt, 1L" }, unit: { es: "UDS", en: "units" } },
  { id: 74, category: "secos_granos", price: 320, name: { es: "Arroz flor, enfundado", en: "White rice, bagged" }, unit: { es: "QUINTALES", en: "quintals (100 lb)" } },
  { id: 75, category: "secos_granos", price: 35, name: { es: "Carbón vegetal, 3kg", en: "Charcoal, 3kg" }, unit: { es: "SACOS", en: "sacks" } },
  { id: 76, category: "secos_granos", price: 18, name: { es: "Chifles (plátano frito)", en: "Plantain chips" }, unit: { es: "FUNDAS", en: "bags" } },
  { id: 77, category: "secos_granos", price: 7, name: { es: "Frijol rojo", en: "Red beans" }, unit: { es: "LIBRA", en: "lb" } },
  { id: 78, category: "secos_granos", price: 16, name: { es: "Lentejas", en: "Lentils" }, unit: { es: "KG", en: "kg" } },
  { id: 79, category: "secos_granos", price: 22, name: { es: "Mayonesa", en: "Mayonnaise" }, unit: { es: "UDS", en: "units" } },
  { id: 80, category: "secos_granos", price: 42, name: { es: "Miel de abeja, 600g", en: "Honey, 600g" }, unit: { es: "FRASCOS", en: "jars" } },
  { id: 81, category: "secos_granos", price: 28, name: { es: "Pasas, 450g", en: "Raisins, 450g" }, unit: { es: "FUNDAS", en: "bags" } },
  { id: 82, category: "secos_granos", price: 14, name: { es: "Salsa de tomate, 395g", en: "Ketchup, 395g" }, unit: { es: "UDS", en: "units" } },
  { id: 83, category: "bebidas", price: 38, name: { es: "Agua embotellada 500ml x24", en: "Bottled water 500ml x24" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 84, category: "bebidas", price: 12, name: { es: "Agua, galón", en: "Water, gallon" }, unit: { es: "UDS", en: "units" } },
  { id: 85, category: "bebidas", price: 95, name: { es: "Coca-Cola en lata, caja", en: "Coca-Cola cans, box" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 86, category: "bebidas", price: 22, name: { es: "Colas de tres litros, Inka Cola", en: "Three-liter soda, Inca Kola" }, unit: { es: "UDS", en: "units" } },
  { id: 87, category: "bebidas", price: 24, name: { es: "Colas de tres litros, Coca-Cola", en: "Three-liter soda, Coca-Cola" }, unit: { es: "UDS", en: "units" } },
  { id: 88, category: "bebidas", price: 22, name: { es: "Colas de tres litros, sabor manzana", en: "Three-liter soda, apple flavor" }, unit: { es: "UDS", en: "units" } },
  { id: 89, category: "bebidas", price: 22, name: { es: "Fanta, 3 litros", en: "Fanta, 3 liters" }, unit: { es: "UDS", en: "units" } },
  { id: 90, category: "bebidas", price: 10, name: { es: "Agua mineral con gas, frasco 330ml", en: "Sparkling mineral water, 330ml bottle" }, unit: { es: "UDS", en: "units" } },
  { id: 91, category: "bebidas", price: 8, name: { es: "Jugo surtido en tetra pack", en: "Assorted boxed juice" }, unit: { es: "LITROS", en: "liters" } },
  { id: 92, category: "bebidas", price: 22, name: { es: "Sprite, 3 litros", en: "Sprite, 3 liters" }, unit: { es: "UDS", en: "units" } },
  { id: 93, category: "bebidas", price: 35, name: { es: "Tang surtido, paquete x12", en: "Tang powdered drink, pack of 12" }, unit: { es: "PAQUETES", en: "packs" } },
  { id: 94, category: "bebidas", price: 45, name: { es: "Vino blanco, tetra", en: "White wine, tetra pack" }, unit: { es: "LITROS", en: "liters" } },
  { id: 95, category: "bebidas", price: 45, name: { es: "Vino tinto, tetra", en: "Red wine, tetra pack" }, unit: { es: "LITROS", en: "liters" } },
  { id: 96, category: "galletas_snacks", price: 28, name: { es: "Cereal Chocapic, 400g", en: "Chocapic cereal, 400g" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 97, category: "galletas_snacks", price: 26, name: { es: "Cereal Corn Flakes, 400g", en: "Corn Flakes cereal, 400g" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 98, category: "galletas_snacks", price: 32, name: { es: "Cereal Froot Loops, 480g", en: "Froot Loops cereal, 480g" }, unit: { es: "CAJA", en: "box" } },
  { id: 99, category: "galletas_snacks", price: 30, name: { es: "Cereal Zucaritas", en: "Frosted Flakes cereal" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 100, category: "galletas_snacks", price: 65, name: { es: "Galletas Amor, 24x100g", en: "Amor wafer cookies, 24x100g" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 101, category: "galletas_snacks", price: 95, name: { es: "Galletas choco chips, 24x270g", en: "Chocolate chip cookies, 24x270g" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 102, category: "galletas_snacks", price: 120, name: { es: "Galletas Club Social, 24x234g", en: "Club Social crackers, 24x234g" }, unit: { es: "CAJA", en: "box" } },
  { id: 103, category: "galletas_snacks", price: 110, name: { es: "Galletas de coco, 18x540g", en: "Coconut cookies, 18x540g" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 104, category: "galletas_snacks", price: 180, name: { es: "Galletas Oreo, 12x432g", en: "Oreo cookies, 12x432g" }, unit: { es: "CAJA", en: "box" } },
  { id: 105, category: "galletas_snacks", price: 75, name: { es: "Galletas saladas Noel, x24", en: "Noel saltine crackers, x24" }, unit: { es: "CAJA", en: "box" } },
  { id: 106, category: "galletas_snacks", price: 90, name: { es: "Galletas surtidas", en: "Assorted cookies" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 107, category: "galletas_snacks", price: 18, name: { es: "Torta Royal, 500g", en: "Royal cake mix, 500g" }, unit: { es: "UDS", en: "units" } },
  { id: 108, category: "enlatados", price: 12, name: { es: "Atún en lata, 175g, en aceite", en: "Canned tuna, 175g, in oil" }, unit: { es: "UDS", en: "units" } },
  { id: 109, category: "enlatados", price: 10, name: { es: "Choclo en lata, maíz dulce, 425g", en: "Canned sweet corn, 425g" }, unit: { es: "UDS", en: "units" } },
  { id: 110, category: "enlatados", price: 22, name: { es: "Cóctel de frutas, 820g", en: "Fruit cocktail, 820g" }, unit: { es: "UDS", en: "units" } },
  { id: 111, category: "enlatados", price: 24, name: { es: "Duraznos en almíbar, 820g", en: "Peaches in syrup, 820g" }, unit: { es: "UDS", en: "units" } },
  { id: 112, category: "enlatados", price: 16, name: { es: "Jalapeños, 250g", en: "Jalapeños, 250g" }, unit: { es: "UDS", en: "units" } },
  { id: 113, category: "enlatados", price: 18, name: { es: "Mermeladas surtidas, 300g", en: "Assorted jams, 300g" }, unit: { es: "UDS", en: "units" } },
  { id: 114, category: "enlatados", price: 20, name: { es: "Pepinillos", en: "Pickles" }, unit: { es: "UDS", en: "units" } },
  { id: 115, category: "enlatados", price: 24, name: { es: "Peras, 800g", en: "Canned pears, 800g" }, unit: { es: "UDS", en: "units" } },
  { id: 116, category: "enlatados", price: 28, name: { es: "Pimientos de piquillo", en: "Piquillo peppers" }, unit: { es: "UDS", en: "units" } },
  { id: 117, category: "enlatados", price: 16, name: { es: "Salsa de pizza, 490g", en: "Pizza sauce, 490g" }, unit: { es: "UDS", en: "units" } },
  { id: 118, category: "enlatados", price: 10, name: { es: "Sardinas en salsa de tomate", en: "Sardines in tomato sauce" }, unit: { es: "UDS", en: "units" } },
  { id: 119, category: "panaderia", price: 14, name: { es: "Empanizador / apanadura, 500g", en: "Breadcrumbs, 500g" }, unit: { es: "UDS", en: "units" } },
  { id: 120, category: "panaderia", price: 16, name: { es: "Coco rallado", en: "Shredded coconut" }, unit: { es: "FUNDAS", en: "bags" } },
  { id: 121, category: "panaderia", price: 9, name: { es: "Fideo codito, 400g", en: "Elbow pasta, 400g" }, unit: { es: "FUNDAS", en: "bags" } },
  { id: 122, category: "panaderia", price: 10, name: { es: "Fideo espiral de colores", en: "Colored spiral pasta" }, unit: { es: "UDS", en: "units" } },
  { id: 123, category: "panaderia", price: 14, name: { es: "Fideo lasaña, 400g", en: "Lasagna noodles, 400g" }, unit: { es: "CAJITAS", en: "small boxes" } },
  { id: 124, category: "panaderia", price: 9, name: { es: "Fideo lazo, 400g", en: "Bowtie pasta, 400g" }, unit: { es: "FUNDA", en: "bag" } },
  { id: 125, category: "panaderia", price: 4, name: { es: "Fideo sopita, sobres", en: "Soup pasta, sachets" }, unit: { es: "UDS", en: "units" } },
  { id: 126, category: "panaderia", price: 9, name: { es: "Fideo spaghetti, 400g", en: "Spaghetti, 400g" }, unit: { es: "UDS", en: "units" } },
  { id: 127, category: "panaderia", price: 10, name: { es: "Harina de maíz, 1kg", en: "Corn flour, 1kg" }, unit: { es: "FUNDAS", en: "bags" } },
  { id: 128, category: "panaderia", price: 16, name: { es: "Pan de hot dog, x8, 600g", en: "Hot dog buns, x8, 600g" }, unit: { es: "PAQUETES", en: "packs" } },
  { id: 129, category: "panaderia", price: 18, name: { es: "Pan de molde blanco, 500g", en: "White sandwich bread, 500g" }, unit: { es: "UDS", en: "units" } },
  { id: 130, category: "panaderia", price: 20, name: { es: "Pan de molde integral, 500g", en: "Whole wheat sandwich bread, 500g" }, unit: { es: "UDS", en: "units" } },
  { id: 131, category: "panaderia", price: 14, name: { es: "Tortillas de maíz mexicanas", en: "Mexican-style corn tortillas" }, unit: { es: "PAQUETES", en: "packs" } },
  { id: 132, category: "panaderia", price: 16, name: { es: "Tortillas de harina, x12", en: "Flour tortillas, x12" }, unit: { es: "PAQUETES", en: "packs" } },
  { id: 133, category: "infusiones", price: 28, name: { es: "Cacao en polvo, 400g", en: "Cocoa powder, 400g" }, unit: { es: "FUNDA", en: "bag" } },
  { id: 134, category: "infusiones", price: 45, name: { es: "Café descafeinado, 170g", en: "Decaf coffee, 170g" }, unit: { es: "UNIDAD", en: "unit" } },
  { id: 135, category: "infusiones", price: 65, name: { es: "Café instantáneo, 200g", en: "Instant coffee, 200g" }, unit: { es: "UDS", en: "units" } },
  { id: 136, category: "infusiones", price: 22, name: { es: "Chocolate de repostería, 44x200g", en: "Baking chocolate, 44x200g" }, unit: { es: "BARRAS", en: "bars" } },
  { id: 137, category: "infusiones", price: 38, name: { es: "Coffee mate original", en: "Coffee mate creamer, original" }, unit: { es: "UDS", en: "units" } },
  { id: 138, category: "infusiones", price: 42, name: { es: "Cola Cao, 790g", en: "Cola Cao chocolate drink mix, 790g" }, unit: { es: "UDS", en: "units" } },
  { id: 139, category: "infusiones", price: 12, name: { es: "Té de cedrón", en: "Lemon verbena tea" }, unit: { es: "CAJITAS", en: "small boxes" } },
  { id: 140, category: "infusiones", price: 12, name: { es: "Té de frutos rojos", en: "Red berry tea" }, unit: { es: "CAJITAS", en: "small boxes" } },
  { id: 141, category: "infusiones", price: 12, name: { es: "Té de tilo", en: "Linden tea" }, unit: { es: "CAJITAS", en: "small boxes" } },
  { id: 142, category: "infusiones", price: 10, name: { es: "Té de manzanilla, sobres", en: "Chamomile tea, sachets" }, unit: { es: "UDS", en: "units" } },
  { id: 143, category: "grasas_aceites", price: 28, name: { es: "Aceite de girasol", en: "Sunflower oil" }, unit: { es: "LITRO", en: "liter" } },
  { id: 144, category: "grasas_aceites", price: 95, name: { es: "Aceite de oliva", en: "Olive oil" }, unit: { es: "LITROS", en: "liters" } },
  { id: 145, category: "grasas_aceites", price: 26, name: { es: "Aceite vegetal", en: "Vegetable oil" }, unit: { es: "LITROS", en: "liters" } },
  { id: 146, category: "condimentos", price: 22, name: { es: "Ablandador de carne", en: "Meat tenderizer" }, unit: { es: "BOLSA", en: "bag" } },
  { id: 147, category: "condimentos", price: 28, name: { es: "Ajo en polvo, 250g", en: "Garlic powder, 250g" }, unit: { es: "FUNDAS", en: "bags" } },
  { id: 148, category: "condimentos", price: 32, name: { es: "Ajo granulado", en: "Granulated garlic" }, unit: { es: "BOTE", en: "jar" } },
  { id: 149, category: "condimentos", price: 24, name: { es: "Ajonjolí blanco y negro", en: "Sesame seeds, black & white" }, unit: { es: "BOTE", en: "jar" } },
  { id: 150, category: "condimentos", price: 20, name: { es: "Aliño completo, 500g", en: "All-purpose seasoning, 500g" }, unit: { es: "UDS", en: "units" } },
  { id: 151, category: "condimentos", price: 18, name: { es: "Caldo Maggi de carne", en: "Maggi beef bouillon" }, unit: { es: "CAJITAS", en: "small boxes" } },
  { id: 152, category: "condimentos", price: 18, name: { es: "Caldo Maggi de gallina", en: "Maggi chicken bouillon" }, unit: { es: "CAJITAS", en: "small boxes" } },
  { id: 153, category: "condimentos", price: 18, name: { es: "Caldo Maggi de verduras", en: "Maggi vegetable bouillon" }, unit: { es: "CAJA", en: "box" } },
  { id: 154, category: "condimentos", price: 16, name: { es: "Canela en polvo", en: "Ground cinnamon" }, unit: { es: "UDS", en: "units" } },
  { id: 155, category: "condimentos", price: 26, name: { es: "Canela entera", en: "Whole cinnamon sticks" }, unit: { es: "BOTE", en: "jar" } },
  { id: 156, category: "condimentos", price: 30, name: { es: "Cebolla granulada", en: "Granulated onion" }, unit: { es: "BOTE", en: "jar" } },
  { id: 157, category: "condimentos", price: 8, name: { es: "Crema de champiñones, sobres", en: "Cream of mushroom mix, sachets" }, unit: { es: "SOBRES", en: "sachets" } },
  { id: 158, category: "condimentos", price: 8, name: { es: "Crema de espárragos, sobres", en: "Cream of asparagus mix, sachets" }, unit: { es: "SOBRES", en: "sachets" } },
  { id: 159, category: "condimentos", price: 9, name: { es: "Crema de mariscos, sobres", en: "Cream of seafood mix, sachets" }, unit: { es: "SOBRES", en: "sachets" } },
  { id: 160, category: "condimentos", price: 8, name: { es: "Crema de pollo, sobres", en: "Cream of chicken mix, sachets" }, unit: { es: "SOBRES", en: "sachets" } },
  { id: 161, category: "condimentos", price: 18, name: { es: "Maní molido con achiote", en: "Ground peanut with achiote" }, unit: { es: "LIBRAS", en: "lb" } },
  { id: 162, category: "condimentos", price: 35, name: { es: "Pimentón español (pimienta roja)", en: "Spanish paprika" }, unit: { es: "POTE", en: "jar" } },
  { id: 163, category: "condimentos", price: 40, name: { es: "Pimienta blanca molida", en: "Ground white pepper" }, unit: { es: "POTE", en: "jar" } },
  { id: 164, category: "condimentos", price: 15, name: { es: "Sal parrillera", en: "Grilling salt" }, unit: { es: "UNIDAD", en: "unit" } },
  { id: 165, category: "condimentos", price: 20, name: { es: "Salsa agridulce, no picante", en: "Sweet & sour sauce, mild" }, unit: { es: "UDS", en: "units" } },
  { id: 166, category: "condimentos", price: 24, name: { es: "Salsa BBQ, 530g", en: "BBQ sauce, 530g" }, unit: { es: "FRASCOS", en: "jars" } },
  { id: 167, category: "condimentos", price: 22, name: { es: "Salsa china, 520ml", en: "Chinese-style soy sauce, 520ml" }, unit: { es: "FRASCOS", en: "jars" } },
  { id: 168, category: "condimentos", price: 45, name: { es: "Salsa de anguila", en: "Eel sauce" }, unit: { es: "FRASCOS", en: "jars" } },
  { id: 169, category: "condimentos", price: 26, name: { es: "Salsa de ostras, 400g", en: "Oyster sauce, 400g" }, unit: { es: "UDS", en: "units" } },
  { id: 170, category: "condimentos", price: 22, name: { es: "Salsa inglesa, 175ml", en: "Worcestershire sauce, 175ml" }, unit: { es: "UDS", en: "units" } },
  { id: 171, category: "condimentos", price: 24, name: { es: "Salsa soya", en: "Soy sauce" }, unit: { es: "FRASCOS", en: "jars" } },
  { id: 172, category: "condimentos", price: 6, name: { es: "Sopa de pollo con fideos", en: "Chicken noodle soup mix" }, unit: { es: "SOBRES", en: "sachets" } },
  { id: 173, category: "condimentos", price: 25, name: { es: "Vinagreta César", en: "Caesar vinaigrette" }, unit: { es: "UDS", en: "units" } },
  { id: 174, category: "limpieza", price: 24, name: { es: "Ambientador en spray", en: "Air freshener spray" }, unit: { es: "UDS", en: "units" } },
  { id: 175, category: "limpieza", price: 28, name: { es: "Insecticida mata cucarachas, 475ml", en: "Roach spray, 475ml" }, unit: { es: "UDS", en: "units" } },
  { id: 176, category: "limpieza", price: 28, name: { es: "Insecticida mata moscas, 475ml", en: "Fly spray, 475ml" }, unit: { es: "UDS", en: "units" } },
  { id: 177, category: "limpieza", price: 12, name: { es: "Bicarbonato, 300g", en: "Baking soda, 300g" }, unit: { es: "UDS", en: "units" } },
  { id: 178, category: "limpieza", price: 8, name: { es: "Brochas plásticas", en: "Plastic basting brushes" }, unit: { es: "UDS", en: "units" } },
  { id: 179, category: "limpieza", price: 85, name: { es: "Cuchillo grande, 25cm", en: "Chef's knife, 25cm" }, unit: { es: "UDS", en: "units" } },
  { id: 180, category: "limpieza", price: 35, name: { es: "Cuchillo pequeño para pelar, puntilla #3", en: "Paring knife, #3" }, unit: { es: "UDS", en: "units" } },
  { id: 181, category: "limpieza", price: 55, name: { es: "Detergente en polvo, 2kg", en: "Powder laundry detergent, 2kg" }, unit: { es: "FUNDAS", en: "bags" } },
  { id: 182, category: "limpieza", price: 30, name: { es: "Escobas", en: "Brooms" }, unit: { es: "UDS", en: "units" } },
  { id: 183, category: "limpieza", price: 25, name: { es: "Bolsas de basura 20x35", en: "Trash bags 20x35" }, unit: { es: "PAQUETE", en: "pack" } },
  { id: 184, category: "limpieza", price: 65, name: { es: "Bolsas de basura industrial, grandes 39x55", en: "Industrial trash bags, large 39x55" }, unit: { es: "PAQUETES", en: "packs" } },
  { id: 185, category: "limpieza", price: 45, name: { es: "Bolsas Ziploc, grandes", en: "Ziploc bags, large" }, unit: { es: "CAJA", en: "box" } },
  { id: 186, category: "limpieza", price: 22, name: { es: "Guantes para horno", en: "Oven mitts" }, unit: { es: "PARES", en: "pairs" } },
  { id: 187, category: "limpieza", price: 65, name: { es: "Guantes quirúrgicos, talla L", en: "Surgical gloves, size L" }, unit: { es: "CAJA", en: "box" } },
  { id: 188, category: "limpieza", price: 35, name: { es: "Jabón líquido de manos", en: "Liquid hand soap" }, unit: { es: "BOTES", en: "jugs" } },
  { id: 189, category: "limpieza", price: 22, name: { es: "Jabón Palmolive x3", en: "Palmolive soap, pack of 3" }, unit: { es: "PAQUETES", en: "packs" } },
  { id: 190, category: "limpieza", price: 26, name: { es: "Jabón Protex x3", en: "Protex soap, pack of 3" }, unit: { es: "PAQUETES", en: "packs" } },
  { id: 191, category: "limpieza", price: 18, name: { es: "Jarra plástica, 4 litros", en: "Plastic pitcher, 4L" }, unit: { es: "UDS", en: "units" } },
  { id: 192, category: "limpieza", price: 14, name: { es: "Lavavajillas en barra, 500ml", en: "Dish soap bar, 500ml" }, unit: { es: "UDS", en: "units" } },
  { id: 193, category: "limpieza", price: 14, name: { es: "Lavavajillas en barra, 500g", en: "Dish soap bar, 500g" }, unit: { es: "UDS", en: "units" } },
  { id: 194, category: "limpieza", price: 10, name: { es: "Limpión de cocina de tela", en: "Kitchen cleaning cloth" }, unit: { es: "UDS", en: "units" } },
  { id: 195, category: "limpieza", price: 35, name: { es: "Mandiles azules", en: "Blue aprons" }, unit: { es: "UDS", en: "units" } },
  { id: 196, category: "limpieza", price: 8, name: { es: "Palillos de bambú, 30g", en: "Bamboo toothpicks, 30g" }, unit: { es: "CAJITAS", en: "small boxes" } },
  { id: 197, category: "limpieza", price: 20, name: { es: "Palos para chuzo, 30cm x100", en: "Skewer sticks, 30cm x100" }, unit: { es: "FUNDAS", en: "bags" } },
  { id: 198, category: "limpieza", price: 15, name: { es: "Paño absorbente", en: "Absorbent cloth" }, unit: { es: "UDS", en: "units" } },
  { id: 199, category: "limpieza", price: 95, name: { es: "Papel aluminio, 300mt", en: "Aluminum foil, 300m" }, unit: { es: "ROLLOS", en: "rolls" } },
  { id: 200, category: "limpieza", price: 65, name: { es: "Papel encerado", en: "Wax paper" }, unit: { es: "UDS", en: "units" } },
  { id: 201, category: "limpieza", price: 18, name: { es: "Pasta de dientes", en: "Toothpaste" }, unit: { es: "UDS", en: "units" } },
  { id: 202, category: "limpieza", price: 45, name: { es: "Piedra para afilar cuchillos, pequeña", en: "Small knife sharpening stone" }, unit: { es: "UDS", en: "units" } },
  { id: 203, category: "limpieza", price: 32, name: { es: "Repelente de mosquitos spray", en: "Mosquito repellent spray" }, unit: { es: "UDS", en: "units" } },
  { id: 204, category: "limpieza", price: 120, name: { es: "Servilletas x100, caja x36", en: "Napkins x100, box of 36" }, unit: { es: "BULTOS", en: "bundles" } },
  { id: 205, category: "limpieza", price: 25, name: { es: "Soperas de cristal", en: "Glass soup bowls" }, unit: { es: "UDS", en: "units" } },
  { id: 206, category: "limpieza", price: 95, name: { es: "Suavizante de telas", en: "Fabric softener" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 207, category: "limpieza", price: 20, name: { es: "Toallas de cocina de tela, 70x40", en: "Kitchen towels, 70x40" }, unit: { es: "UDS", en: "units" } },
  { id: 208, category: "limpieza", price: 35, name: { es: "Trapeadores", en: "Mops" }, unit: { es: "UDS", en: "units" } },
  { id: 209, category: "limpieza", price: 8, name: { es: "Velas con vaso", en: "Candles with holder" }, unit: { es: "UDS", en: "units" } },
  { id: 210, category: "puente", price: 42, name: { es: "Agua 1.2lt x6", en: "Water 1.2L x6" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 211, category: "puente", price: 95, name: { es: "Coca-Cola normal x24 en lata", en: "Coca-Cola x24 cans" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 212, category: "puente", price: 95, name: { es: "Sprite x24 en lata", en: "Sprite x24 cans" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 213, category: "puente", price: 95, name: { es: "Fanta x24 en lata", en: "Fanta x24 cans" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 214, category: "anexo_cocina", price: 16, name: { es: "Leche condensada, 250ml", en: "Condensed milk, 250ml" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 215, category: "anexo_cocina", price: 95, name: { es: "Nutella, 1kg", en: "Nutella, 1kg" }, unit: { es: "UDS", en: "units" } },
  { id: 216, category: "anexo_cocina", price: 8, name: { es: "Sal fina de mesa", en: "Fine table salt" }, unit: { es: "UDS", en: "units" } },
  { id: 217, category: "anexo_cocina", price: 28, name: { es: "Desengrasante en spray", en: "Degreaser spray" }, unit: { es: "UDS", en: "units" } },
  { id: 218, category: "anexo_cocina", price: 65, name: { es: "Cloro, botella", en: "Bleach, bottle" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 219, category: "anexo_cocina", price: 85, name: { es: "Desinfectante para piso", en: "Floor disinfectant" }, unit: { es: "CAJAS", en: "boxes" } },
  { id: 220, category: "anexo_cocina", price: 22, name: { es: "Filtro para cafetera", en: "Coffee filters" }, unit: { es: "CAJAS", en: "boxes" } },
];

const T = {
  es: {
    brandTag: "CATÁLOGO Y PEDIDOS — SUMINISTRO AL POR MAYOR",
    heroTitle: "Todo lo que necesita su embarcación, en una sola entrega.",
    heroSub:
      "Revise el catálogo, arme su pedido y envíelo. Nosotros lo preparamos y le contactamos para coordinar entrega y forma de pago.",
    priceDisclaimer: "Los precios mostrados no incluyen IVA ni costo de gestión.",
    viewCatalog: "Ver catálogo",
    cart: "Pedido",
    emptyCart: "Aún no ha agregado productos al pedido.",
    total: "Total",
    continueOrder: "Continuar con el pedido",
    sendOrder: "Enviar pedido",
    orderSent: "Solicitud enviada",
    deliveryData: "Datos de entrega",
    company: "Empresa / cooperativa",
    boat: "Nombre de la embarcación (opcional)",
    dock: "Muelle o punto de entrega",
    phone: "Teléfono de contacto",
    notes: "Notas del pedido (opcional)",
    requestNote: "Este pedido queda como solicitud. No se realiza ningún cobro aquí — nuestro equipo le contactará para confirmar disponibilidad, entrega y forma de pago.",
    estimatedTotal: "Total estimado",
    sendRequest: "Enviar solicitud de pedido",
    orderNumber: "Pedido",
    willContact: "Le contactaremos por teléfono para confirmar el pedido, coordinar la entrega y la forma de pago.",
    keepBrowsing: "Seguir viendo el catálogo",
    footer: "QUETZAL FLEET SUPPLY — víveres y repuestos al por mayor para flotas atuneras. Entregas coordinadas por muelle o punto de embarque en Puerto Quetzal.",
    rate: `Tipo de cambio referencial: Q${EXCHANGE_RATE.toFixed(2)} = $1`,
    browseByCategory: "Explorar por categoría",
    itemCount: (n) => `${n} producto${n === 1 ? "" : "s"}`,
    backHome: "Volver al inicio",
    catalogTitle: "Catálogo completo",
  },
  en: {
    brandTag: "CATALOG & ORDERS — WHOLESALE SUPPLY",
    heroTitle: "Everything your vessel needs, in a single delivery.",
    heroSub:
      "Browse the catalog, build your order and send it. We prepare it and contact you to arrange delivery and payment.",
    priceDisclaimer: "Prices shown do not include VAT or handling fee.",
    viewCatalog: "View catalog",
    cart: "Order",
    emptyCart: "You haven't added any products to the order yet.",
    total: "Total",
    continueOrder: "Continue with order",
    sendOrder: "Send order",
    orderSent: "Request sent",
    deliveryData: "Delivery details",
    company: "Company / cooperative",
    boat: "Vessel name (optional)",
    dock: "Dock or delivery point",
    phone: "Contact phone",
    notes: "Order notes (optional)",
    requestNote: "This order is a request only. No payment is taken here — our team will contact you to confirm availability, delivery and payment method.",
    estimatedTotal: "Estimated total",
    sendRequest: "Send order request",
    orderNumber: "Order",
    willContact: "We'll call you to confirm the order and coordinate delivery and payment.",
    keepBrowsing: "Keep browsing the catalog",
    footer: "QUETZAL FLEET SUPPLY — wholesale provisions and parts for tuna fleets. Deliveries coordinated by dock or embarkation point at Puerto Quetzal.",
    rate: `Reference exchange rate: Q${EXCHANGE_RATE.toFixed(2)} = $1`,
    browseByCategory: "Browse by category",
    itemCount: (n) => `${n} product${n === 1 ? "" : "s"}`,
    backHome: "Back to home",
    catalogTitle: "Full catalog",
  },
};

function formatPrice(priceGTQ, currency) {
  if (currency === "usd") {
    return `$${(priceGTQ / EXCHANGE_RATE).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `Q${priceGTQ.toLocaleString("es-GT")}`;
}

function Crate({ children, style }) {
  return (
    <div style={{ background: COLORS.white, border: `1.5px solid ${COLORS.ink}22`, position: "relative", ...style }}>
      {children}
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("es");
  const [currency, setCurrency] = useState("gtq");
  const [page, setPage] = useState("home"); // "home" | "catalog"
  const [activeCategory, setActiveCategory] = useState("carne_res");
  const [scrollTarget, setScrollTarget] = useState(null);
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [orderNum, setOrderNum] = useState("");
  const sectionRefs = useRef({});
  const t = T[lang];

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === Number(id)), qty })),
    [cart]
  );

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const subtotalGTQ = cartItems.reduce((s, i) => s + i.qty * i.price, 0);
  const totalGTQ = subtotalGTQ;

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeOne = (id) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) - 1) }));

  const scrollTo = (id) => {
    setActiveCategory(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goHome = () => {
    setPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCatalog = (categoryId) => {
    setActiveCategory(categoryId || "carne_res");
    setScrollTarget(categoryId || null);
    setPage("catalog");
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    if (page === "catalog" && scrollTarget) {
      const el = sectionRefs.current[scrollTarget];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      setScrollTarget(null);
    }
  }, [page, scrollTarget]);

  const placeOrder = () => {
    setOrderNum("QFS-" + Math.floor(10000 + Math.random() * 89999));
    setOrderDone(true);
  };

  const closeCheckout = () => {
    setCheckout(false);
    if (orderDone) {
      setCart({});
      setCartOpen(false);
    }
    setOrderDone(false);
  };

  const toggleBtnStyle = (active) => ({
    padding: "5px 10px",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "'IBM Plex Mono', monospace",
    background: active ? COLORS.amber : "transparent",
    color: active ? COLORS.navy : COLORS.paper,
    border: `1px solid ${active ? COLORS.amber : COLORS.paper + "55"}`,
  });

  return (
    <div style={{ background: COLORS.paper, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: COLORS.ink }}>
      <style>{FONTS}</style>

      {/* HEADER */}
      <header style={{ background: COLORS.navy, position: "sticky", top: 0, zIndex: 30 }}>
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between flex-wrap gap-2" style={{ minHeight: 68, paddingTop: 10, paddingBottom: 10 }}>
          <div className="flex items-center gap-2" onClick={goHome} style={{ cursor: "pointer" }}>
            <Anchor size={22} color={COLORS.amber} />
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 22, color: COLORS.paper, letterSpacing: "0.03em", textTransform: "uppercase" }}>
              Quetzal Fleet Supply
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* language toggle */}
            <div className="flex items-center gap-1">
              <Globe size={14} color={COLORS.paper} style={{ marginRight: 2 }} />
              <div className="flex" style={{ gap: 0 }}>
                <button style={{ ...toggleBtnStyle(lang === "es"), borderRight: "none" }} onClick={() => setLang("es")}>ES</button>
                <button style={toggleBtnStyle(lang === "en")} onClick={() => setLang("en")}>EN</button>
              </div>
            </div>
            {/* currency toggle */}
            <div className="flex" style={{ gap: 0 }}>
              <button style={{ ...toggleBtnStyle(currency === "gtq"), borderRight: "none" }} onClick={() => setCurrency("gtq")}>Q</button>
              <button style={toggleBtnStyle(currency === "usd")} onClick={() => setCurrency("usd")}>USD</button>
            </div>

            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2"
              style={{ background: COLORS.amber, color: COLORS.navy, fontWeight: 700, fontSize: 14 }}
            >
              <ShoppingCart size={17} />
              <span className="hidden sm:inline">{t.cart}</span>
              <span
                style={{
                  background: COLORS.navy,
                  color: COLORS.paper,
                  borderRadius: 2,
                  minWidth: 20,
                  height: 20,
                  fontSize: 12,
                  fontFamily: "'IBM Plex Mono', monospace",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 5px",
                }}
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>
        {page === "catalog" && (
          <div className="max-w-6xl mx-auto px-5 pb-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => scrollTo(c.id)}
                className="flex items-center gap-2"
                style={{
                  whiteSpace: "nowrap",
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 500,
                  border: `1px solid ${activeCategory === c.id ? COLORS.amber : COLORS.paper + "44"}`,
                  background: activeCategory === c.id ? COLORS.amber : "transparent",
                  color: activeCategory === c.id ? COLORS.navy : COLORS.paper,
                }}
              >
                <span>{c.emoji}</span>
                {c.label[lang]}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HOME PAGE */}
      {page === "home" && (
        <>
          {/* HERO */}
          <section style={{ background: `linear-gradient(180deg, ${COLORS.navy} 0%, ${COLORS.navyMid} 100%)`, color: COLORS.paper, paddingBottom: 44 }}>
            <div className="max-w-6xl mx-auto px-5 pt-10 md:pt-16">
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.15em", color: COLORS.amber, marginBottom: 14 }}>
                {t.brandTag}
              </div>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  fontSize: "clamp(2rem, 4.8vw, 3.2rem)",
                  lineHeight: 1.08,
                  maxWidth: 720,
                  textTransform: "uppercase",
                  letterSpacing: "0.01em",
                }}
              >
                {t.heroTitle}
              </h1>
              <p style={{ maxWidth: 520, marginTop: 16, fontSize: 15.5, color: COLORS.panel }}>
                {t.heroSub}
              </p>
              <div className="flex items-center gap-3 flex-wrap" style={{ marginTop: 14 }}>
                <button
                  onClick={() => openCatalog(null)}
                  className="inline-flex items-center gap-2 px-6 py-3"
                  style={{ background: COLORS.amber, color: COLORS.navy, fontWeight: 700, fontSize: 15 }}
                >
                  {t.viewCatalog} <ChevronRight size={16} />
                </button>
              </div>
              <div style={{ marginTop: 22, borderLeft: `3px solid ${COLORS.rust}`, paddingLeft: 12, maxWidth: 520 }}>
                <p style={{ fontSize: 13, color: COLORS.panel, lineHeight: 1.5 }}>{t.priceDisclaimer}</p>
                {currency === "usd" && (
                  <p style={{ fontSize: 11.5, color: COLORS.panel + "aa", marginTop: 4, fontFamily: "'IBM Plex Mono', monospace" }}>{t.rate}</p>
                )}
              </div>
            </div>
          </section>

          {/* CATEGORY GRID */}
          <main className="max-w-6xl mx-auto px-5 py-12">
            <div className="flex items-baseline gap-3 mb-6">
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 22, textTransform: "uppercase", letterSpacing: "0.01em" }}>
                {t.browseByCategory}
              </h2>
              <div style={{ flex: 1, borderBottom: `1px solid ${COLORS.ink}22` }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map((cat) => {
                const count = PRODUCTS.filter((p) => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => openCatalog(cat.id)}
                    className="flex items-center gap-3 text-left"
                    style={{ background: COLORS.white, border: `1.5px solid ${COLORS.ink}18`, padding: "16px 14px" }}
                  >
                    <div style={{ fontSize: 30, width: 48, height: 48, background: COLORS.panel, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {cat.emoji}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25 }}>{cat.label[lang]}</div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: COLORS.ink + "88", marginTop: 2 }}>
                        {t.itemCount(count)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </main>
        </>
      )}

      {/* CATALOG PAGE */}
      {page === "catalog" && (
        <>
          <div style={{ background: COLORS.navyMid }}>
            <div className="max-w-6xl mx-auto px-5 flex items-center gap-3" style={{ height: 48 }}>
              <button onClick={goHome} className="flex items-center gap-1" style={{ color: COLORS.paper, fontSize: 13, fontWeight: 600 }}>
                <ChevronLeft size={16} /> {t.backHome}
              </button>
              <span style={{ color: COLORS.paper + "55" }}>·</span>
              <span style={{ color: COLORS.panel, fontSize: 13 }}>{t.catalogTitle}</span>
            </div>
          </div>

          <main className="max-w-6xl mx-auto px-5 py-12">
        {CATEGORIES.map((cat) => (
          <section key={cat.id} ref={(el) => (sectionRefs.current[cat.id] = el)} style={{ marginBottom: 52, scrollMarginTop: 96 }}>
            <div className="flex items-baseline gap-3 mb-5">
              <span style={{ fontSize: 20 }}>{cat.emoji}</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 23, textTransform: "uppercase", letterSpacing: "0.01em" }}>
                {cat.label[lang]}
              </h2>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: COLORS.ink + "77" }}>{cat.code}</span>
              <div style={{ flex: 1, borderBottom: `1px solid ${COLORS.ink}22` }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PRODUCTS.filter((p) => p.category === cat.id).map((p) => {
                const qty = cart[p.id] || 0;
                return (
                  <Crate key={p.id} style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        background: COLORS.panel,
                        height: 92,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 36,
                        position: "relative",
                      }}
                    >
                      {cat.emoji}
                      <span
                        style={{
                          position: "absolute",
                          top: 6,
                          left: 6,
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 9,
                          color: COLORS.ink + "99",
                          background: COLORS.white,
                          padding: "1px 5px",
                          border: `1px solid ${COLORS.ink}22`,
                        }}
                      >
                        {cat.code}-{String(p.id).padStart(2, "0")}
                      </span>
                    </div>
                    <div style={{ padding: "11px 12px 13px" }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.25, minHeight: 34 }}>{p.name[lang]}</div>
                      <div style={{ fontSize: 11, color: COLORS.ink + "88", marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>
                        {p.unit[lang]}
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 14 }}>
                          {formatPrice(p.price, currency)}
                        </span>
                        {qty === 0 ? (
                          <button
                            onClick={() => addToCart(p.id)}
                            aria-label="add"
                            style={{ background: COLORS.navy, color: COLORS.paper, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            <Plus size={15} />
                          </button>
                        ) : (
                          <div className="flex items-center gap-1" style={{ background: COLORS.navy }}>
                            <button onClick={() => removeOne(p.id)} style={{ color: COLORS.paper, width: 26, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Minus size={13} />
                            </button>
                            <span style={{ color: COLORS.paper, fontSize: 13, fontFamily: "'IBM Plex Mono', monospace", minWidth: 14, textAlign: "center" }}>{qty}</span>
                            <button onClick={() => addToCart(p.id)} style={{ color: COLORS.paper, width: 26, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Plus size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Crate>
                );
              })}
            </div>
          </section>
        ))}
          </main>
        </>
      )}

      <footer style={{ background: COLORS.navy, color: COLORS.panel, padding: "26px 20px", fontSize: 13, textAlign: "center" }}>
        {t.footer}
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 40 }}>
          <div onClick={() => setCartOpen(false)} style={{ position: "absolute", inset: 0, background: "#0B2138aa" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "100%", maxWidth: 400, background: COLORS.paper, display: "flex", flexDirection: "column" }}>
            <div className="flex items-center justify-between px-5" style={{ height: 60, background: COLORS.navy, color: COLORS.paper }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 18, textTransform: "uppercase" }}>{t.cart}</span>
              <button onClick={() => setCartOpen(false)}><X size={20} color={COLORS.paper} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
              {cartItems.length === 0 && (
                <p style={{ color: COLORS.ink + "88", fontSize: 14, marginTop: 20, textAlign: "center" }}>{t.emptyCart}</p>
              )}
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3" style={{ padding: "10px 0", borderBottom: `1px solid ${COLORS.ink}18` }}>
                  <div style={{ fontSize: 24, background: COLORS.panel, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {CATEGORIES.find((c) => c.id === item.category)?.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name[lang]}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: COLORS.ink + "88" }}>
                      {item.unit[lang]} · {formatPrice(item.price, currency)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1" style={{ background: COLORS.navy }}>
                    <button onClick={() => removeOne(item.id)} style={{ color: COLORS.paper, width: 24, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Minus size={12} />
                    </button>
                    <span style={{ color: COLORS.paper, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", minWidth: 12, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => addToCart(item.id)} style={{ color: COLORS.paper, width: 24, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {cartItems.length > 0 && (
              <div style={{ padding: 16, borderTop: `1.5px solid ${COLORS.ink}22`, background: COLORS.white }}>
                <div className="flex justify-between" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                  <span>{t.total}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatPrice(totalGTQ, currency)}</span>
                </div>
                <div style={{ fontSize: 11, color: COLORS.ink + "77", marginBottom: 12 }}>{t.priceDisclaimer}</div>
                <button
                  onClick={() => setCheckout(true)}
                  style={{
                    width: "100%",
                    background: COLORS.rust,
                    color: COLORS.white,
                    padding: "13px 0",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  {t.continueOrder}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {checkout && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
          <div onClick={closeCheckout} style={{ position: "absolute", inset: 0, background: "#0B2138aa" }} />
          <div className="px-4" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: COLORS.paper, width: "100%", maxWidth: 440, maxHeight: "88vh", overflowY: "auto" }}>
              <div className="flex items-center justify-between px-5" style={{ height: 56, background: COLORS.navy }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 17, color: COLORS.paper, textTransform: "uppercase" }}>
                  {orderDone ? t.orderSent : t.sendOrder}
                </span>
                <button onClick={closeCheckout}><X size={19} color={COLORS.paper} /></button>
              </div>

              {!orderDone ? (
                <div style={{ padding: 20 }}>
                  <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: COLORS.ink + "88", marginBottom: 8 }}>
                    {t.deliveryData}
                  </div>
                  <input placeholder={t.company} style={inputStyle} />
                  <input placeholder={t.boat} style={inputStyle} />
                  <input placeholder={t.dock} style={inputStyle} />
                  <input placeholder={t.phone} style={inputStyle} />
                  <textarea placeholder={t.notes} rows={2} style={{ ...inputStyle, resize: "none" }} />

                  <Crate style={{ padding: 12, fontSize: 12.5, color: COLORS.ink + "aa", lineHeight: 1.6, marginTop: 4, marginBottom: 4 }}>
                    {t.requestNote}
                  </Crate>

                  <div className="flex justify-between" style={{ fontSize: 16, fontWeight: 700, marginTop: 18, marginBottom: 4 }}>
                    <span>{t.estimatedTotal}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatPrice(totalGTQ, currency)}</span>
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.ink + "77", marginBottom: 16 }}>{t.priceDisclaimer}</div>

                  <button
                    onClick={placeOrder}
                    className="flex items-center justify-center gap-2"
                    style={{ width: "100%", background: COLORS.rust, color: COLORS.white, padding: "14px 0", fontWeight: 700, fontSize: 15 }}
                  >
                    <MessageCircle size={16} /> {t.sendRequest}
                  </button>
                </div>
              ) : (
                <div style={{ padding: 28, textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.navy, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Check size={28} color={COLORS.paper} />
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 20, marginBottom: 6, textTransform: "uppercase" }}>
                    {t.orderSent}
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: COLORS.ink + "99", marginBottom: 16 }}>
                    {t.orderNumber} #{orderNum}
                  </div>
                  <Crate style={{ padding: 14, textAlign: "left", fontSize: 13 }}>
                    {cartItems.map((i) => (
                      <div key={i.id} className="flex justify-between" style={{ fontFamily: "'IBM Plex Mono', monospace", padding: "3px 0" }}>
                        <span>{i.qty}× {i.name[lang]}</span>
                        <span>{formatPrice(i.qty * i.price, currency)}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: `1px dashed ${COLORS.ink}33`, marginTop: 8, paddingTop: 8 }} className="flex justify-between">
                      <span style={{ fontWeight: 700 }}>{t.estimatedTotal}</span>
                      <span style={{ fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{formatPrice(totalGTQ, currency)}</span>
                    </div>
                  </Crate>
                  <p style={{ fontSize: 12.5, color: COLORS.ink + "88", marginTop: 12, lineHeight: 1.6 }}>{t.willContact}</p>
                  <button
                    onClick={closeCheckout}
                    style={{ width: "100%", background: COLORS.navy, color: COLORS.paper, padding: "13px 0", fontWeight: 700, fontSize: 15, marginTop: 18 }}
                  >
                    {t.keepBrowsing}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 12px",
  marginBottom: 10,
  border: `1.5px solid ${COLORS.ink}33`,
  background: COLORS.white,
  fontSize: 14,
  fontFamily: "'Inter', sans-serif",
  color: COLORS.ink,
};
