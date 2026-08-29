import { Scissors, ShieldCheck, Truck, Heart, Search, ShoppingCart, CreditCard, Sparkles } from 'lucide-react';
import type { ThemeConfig } from '@/theme/types';
import { IMAGES } from './data/images';
import { Logo } from './Logo';

export const themeConfig: ThemeConfig = {
  id: 'carteras',
  siteName: 'RW',
  tagline: 'Carteras artesanales hechas a mano en Chile',
  searchPlaceholder: 'Busca bandoleras, totes, clutches...',
  primaryCategoryHref: '/categoria/bandoleras',

  hero: {
    badgeIcon: Sparkles,
    badge: '+300 piezas hechas a mano',
    titleTop: 'Carteras artesanales,',
    titleAccent: 'hechas a mano en Chile.',
    subtitle:
      'Cuero genuino, costuras a mano y diseños atemporales — cada cartera es una pieza única, con despacho a todo Chile.',
    ctaPrimaryLabel: 'Ver colección',
    imageId: IMAGES.hero.main,
  },

  strip: {
    title: 'Hecho con',
    items: ['Cuero genuino', 'Hilo encerado', 'Costura a mano', 'Hebillas metálicas', 'Gamuza natural'],
  },

  about: {
    intro:
      'RW nace del oficio de talabarteros y curtidores chilenos: cada cartera se corta, cose y termina a mano, con cuero de curtiembres locales. Este es un prototipo de producto — la primera versión de un catálogo que buscamos escalar a nivel nacional.',
    pillars: [
      {
        icon: Scissors,
        title: 'Hecho a mano',
        text: 'Cada pieza se corta y cose a mano, una por una, en nuestro taller.',
      },
      {
        icon: ShieldCheck,
        title: 'Cuero genuino',
        text: 'Trabajamos con curtiembres locales que certifican el origen del cuero.',
      },
      {
        icon: Truck,
        title: 'Envíos a todo Chile',
        text: 'Despachamos a todo el país con seguimiento en cada etapa.',
      },
      {
        icon: Heart,
        title: 'Piezas únicas',
        text: 'Al ser artesanales, cada cartera puede tener variaciones que la hacen irrepetible.',
      },
    ],
  },

  howToBuy: {
    steps: [
      {
        icon: Search,
        title: '1. Encuentra tu cartera',
        text: 'Busca por nombre o navega por categoría: bandoleras, totes o clutches.',
      },
      {
        icon: ShoppingCart,
        title: '2. Agrégala al carrito',
        text: 'Revisa materiales y dimensiones en la ficha de producto, y agrégala al carrito.',
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

  footerDescription:
    'Carteras de cuero hechas a mano en Chile, piezas únicas para el uso diario y ocasiones especiales.',

  hasCompatibilityFilter: false,

  Logo,
};
