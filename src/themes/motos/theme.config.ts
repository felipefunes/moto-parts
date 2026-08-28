import { Wrench, ShieldCheck, Truck, Users, Search, ShoppingCart, CreditCard } from 'lucide-react';
import type { ThemeConfig } from '@/theme/types';
import { MOTORCYCLE_BRANDS } from './data/motorcycleModels';
import { IMAGES } from './data/images';
import { Logo } from './Logo';
import { ProductExtraSection } from './ProductExtraSection';

export const themeConfig: ThemeConfig = {
  id: 'motos',
  siteName: 'RPM Parts',
  tagline: 'Repuestos de moto para todo Chile',
  searchPlaceholder: 'Busca pastillas de freno, cadenas, bujías...',
  primaryCategoryHref: '/categoria/motor',

  hero: {
    badge: '+8.000 repuestos en catálogo',
    titleTop: 'Repuestos de moto,',
    titleAccent: 'directo al taller.',
    subtitle:
      'Motor, frenos, suspensión, transmisión y más — piezas originales y aftermarket compatibles con tu modelo, con despacho a todo Chile.',
    ctaPrimaryLabel: 'Explorar catálogo',
    imageId: IMAGES.hero.sunsetRider,
  },

  strip: {
    title: 'Compatible con',
    items: MOTORCYCLE_BRANDS,
  },

  about: {
    intro:
      'Nacimos para resolver un problema simple: encontrar el repuesto correcto para tu moto, en Chile, sin recorrer cinco tiendas físicas ni adivinar si calza con tu modelo. Este es un prototipo de producto — la primera versión de un catálogo que buscamos escalar a nivel nacional.',
    pillars: [
      {
        icon: Wrench,
        title: 'Catálogo curado',
        text: 'Trabajamos directo con distribuidores e importadores para ofrecer repuestos originales y aftermarket de marcas reconocidas.',
      },
      {
        icon: ShieldCheck,
        title: 'Garantía real',
        text: 'Todos los repuestos incluyen garantía de fábrica o de nuestra tienda, con soporte post-venta por WhatsApp y correo.',
      },
      {
        icon: Truck,
        title: 'Logística nacional',
        text: 'Despachamos a todo Chile con tiempos de entrega claros y seguimiento del pedido en cada etapa.',
      },
      {
        icon: Users,
        title: 'Para talleres y moteros',
        text: 'Precios competitivos tanto para el motociclista particular como para talleres mecánicos que compran en volumen.',
      },
    ],
  },

  howToBuy: {
    steps: [
      {
        icon: Search,
        title: '1. Encuentra tu repuesto',
        text: 'Busca por nombre, marca o navega por categoría. Filtra por marca y modelo de moto para asegurar compatibilidad.',
      },
      {
        icon: ShoppingCart,
        title: '2. Agrégalo al carrito',
        text: 'Revisa specs y compatibilidad en la ficha de producto, elige la cantidad y agrégalo al carrito.',
      },
      {
        icon: CreditCard,
        title: '3. Paga de forma segura',
        text: 'Completa tu dirección de despacho y paga con Webpay Plus, Mercado Pago o transferencia bancaria.',
      },
      {
        icon: Truck,
        title: '4. Recibe en tu domicilio',
        text: 'Despachamos a todo Chile en 24 a 72 horas hábiles. Te avisamos por correo en cada etapa.',
      },
    ],
  },

  footerDescription: 'Catálogo online de repuestos de motocicletas, originales y aftermarket, para todo Chile.',

  hasCompatibilityFilter: true,
  compatibilityFilterLabel: 'Moto compatible',

  Logo,
  ProductExtraSection,
};
