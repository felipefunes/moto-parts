import type { Product, ProductCondition } from '@/types';
import { slugify } from '@/lib/slugify';
import { unsplashImage } from '@/lib/unsplash';
import { IMAGES, CATEGORY_FALLBACK_IMAGES } from './images';
import { MOTORCYCLE_MODELS } from './motorcycleModels';

interface ProductSeed {
  name: string;
  brand: string;
  categorySlug: string;
  subcategorySlug: string;
  priceClp: number;
  compareAtPriceClp?: number;
  condition?: ProductCondition;
  stock: number;
  shortDescription: string;
  specs: [string, string][];
  compatIdx: number[];
  rating: number;
  reviewsCount: number;
  warrantyMonths: number;
  isFeatured?: boolean;
}

const M = MOTORCYCLE_MODELS;

const SEEDS: ProductSeed[] = [
  // Motor
  { name: 'Pistón forjado 63.5mm', brand: 'Mahle', categorySlug: 'motor', subcategorySlug: 'pistones-anillos', priceClp: 45990, compareAtPriceClp: 52990, stock: 18, shortDescription: 'Pistón forjado de alta resistencia con set de anillos incluido.', specs: [['Diámetro', '63.5 mm'], ['Material', 'Aluminio forjado'], ['Incluye anillos', 'Sí']], compatIdx: [0, 9], rating: 4.7, reviewsCount: 34, warrantyMonths: 6 },
  { name: 'Kit de juntas de culata completo', brand: 'Mahle', categorySlug: 'motor', subcategorySlug: 'juntas-empaquetaduras', priceClp: 18990, stock: 40, shortDescription: 'Set completo de juntas para reparación integral del motor.', specs: [['Piezas incluidas', '12'], ['Material', 'Grafito reforzado']], compatIdx: [4, 7], rating: 4.5, reviewsCount: 51, warrantyMonths: 3 },
  { name: 'Bomba de aceite', brand: 'Bosch', categorySlug: 'motor', subcategorySlug: 'bombas-aceite-agua', priceClp: 34990, compareAtPriceClp: 39990, stock: 22, shortDescription: 'Bomba de aceite de reemplazo directo para motor monocilíndrico.', specs: [['Presión', '4.5 bar'], ['Compatibilidad', 'Motor monocilíndrico']], compatIdx: [1, 12], rating: 4.6, reviewsCount: 28, warrantyMonths: 6 },
  { name: 'Tapa de cárter de embrague', brand: 'RPM Parts Pro', categorySlug: 'motor', subcategorySlug: 'carter-tapas', priceClp: 22990, stock: 15, shortDescription: 'Tapa de cárter en aluminio anodizado, resistente a golpes.', specs: [['Material', 'Aluminio fundido'], ['Acabado', 'Anodizado negro']], compatIdx: [2], rating: 4.3, reviewsCount: 12, warrantyMonths: 3 },

  // Frenos
  { name: 'Pastillas de freno delanteras sinterizadas', brand: 'EBC Brakes', categorySlug: 'frenos', subcategorySlug: 'pastillas-freno', priceClp: 15990, stock: 60, shortDescription: 'Pastillas sinterizadas de alto rendimiento para frenado consistente.', specs: [['Material', 'Sinterizado'], ['Posición', 'Delantera']], compatIdx: [0, 9], rating: 4.8, reviewsCount: 89, warrantyMonths: 6, isFeatured: true },
  { name: 'Disco de freno flotante 296mm', brand: 'Brembo', categorySlug: 'frenos', subcategorySlug: 'discos-freno', priceClp: 68990, compareAtPriceClp: 79990, stock: 14, shortDescription: 'Disco flotante de acero inoxidable con perforaciones para disipar calor.', specs: [['Diámetro', '296 mm'], ['Material', 'Acero inoxidable']], compatIdx: [5, 11], rating: 4.9, reviewsCount: 47, warrantyMonths: 12 },
  { name: 'Bomba de freno trasera', brand: 'Brembo', categorySlug: 'frenos', subcategorySlug: 'bombas-freno', priceClp: 42990, stock: 10, shortDescription: 'Bomba maestra trasera con pistón de 12.7mm, reemplazo OEM.', specs: [['Pistón', '12.7 mm'], ['Material', 'Aluminio']], compatIdx: [8], rating: 4.6, reviewsCount: 19, warrantyMonths: 6 },
  { name: 'Latiguillo de freno acero trenzado', brand: 'Brembo', categorySlug: 'frenos', subcategorySlug: 'latiguillos-mangueras', priceClp: 24990, stock: 25, shortDescription: 'Latiguillo trenzado para un tacto de freno más firme y directo.', specs: [['Material', 'Acero trenzado'], ['Largo', '60 cm']], compatIdx: [9, 5], rating: 4.7, reviewsCount: 22, warrantyMonths: 12 },

  // Suspensión
  { name: 'Par de horquillas delanteras completas', brand: 'RPM Parts Pro', categorySlug: 'suspension', subcategorySlug: 'horquillas', priceClp: 189990, compareAtPriceClp: 219990, stock: 6, shortDescription: 'Juego completo de horquillas delanteras, listas para instalar.', specs: [['Recorrido', '120 mm'], ['Diámetro de barra', '33 mm']], compatIdx: [0], rating: 4.4, reviewsCount: 9, warrantyMonths: 6, isFeatured: true },
  { name: 'Amortiguador trasero ajustable', brand: 'RPM Racing', categorySlug: 'suspension', subcategorySlug: 'amortiguadores', priceClp: 89990, stock: 11, shortDescription: 'Amortiguador de gas con precarga y rebote ajustable.', specs: [['Precarga', 'Ajustable'], ['Rebote', '12 posiciones']], compatIdx: [5, 11], rating: 4.7, reviewsCount: 31, warrantyMonths: 12 },
  { name: 'Kit de resortes de horquilla progresivos', brand: 'RPM Parts Pro', categorySlug: 'suspension', subcategorySlug: 'resortes', priceClp: 45990, stock: 17, shortDescription: 'Resortes progresivos que mejoran el comportamiento en curvas y frenadas.', specs: [['Tipo', 'Progresivo'], ['Material', 'Acero SAE']], compatIdx: [10], rating: 4.5, reviewsCount: 14, warrantyMonths: 6 },
  { name: 'Kit de retenes de horquilla', brand: 'RPM Parts Pro', categorySlug: 'suspension', subcategorySlug: 'retenes-sellos', priceClp: 12990, stock: 33, shortDescription: 'Set de retenes y guardapolvos para evitar fugas de aceite.', specs: [['Diámetro', '33 mm'], ['Piezas', '2 retenes + 2 guardapolvos']], compatIdx: [8, 10], rating: 4.6, reviewsCount: 26, warrantyMonths: 3 },

  // Transmisión
  { name: 'Cadena 428H 130 eslabones', brand: 'DID', categorySlug: 'transmision', subcategorySlug: 'cadenas', priceClp: 32990, stock: 45, shortDescription: 'Cadena reforzada de alta durabilidad para uso urbano y todo terreno.', specs: [['Paso', '428'], ['Eslabones', '130']], compatIdx: [1, 12], rating: 4.8, reviewsCount: 67, warrantyMonths: 6 },
  { name: 'Kit de arrastre completo (cadena + piñón + corona)', brand: 'DID', categorySlug: 'transmision', subcategorySlug: 'kits-arrastre', priceClp: 78990, compareAtPriceClp: 89990, stock: 20, shortDescription: 'Kit completo para renovar toda la transmisión secundaria de una vez.', specs: [['Piñón', '15T'], ['Corona', '43T']], compatIdx: [4, 7], rating: 4.9, reviewsCount: 58, warrantyMonths: 6, isFeatured: true },
  { name: 'Kit de discos de embrague', brand: 'RPM Parts Pro', categorySlug: 'transmision', subcategorySlug: 'embrague', priceClp: 39990, stock: 19, shortDescription: 'Discos de fibra orgánica para una transmisión de potencia suave.', specs: [['Piezas', '6 discos'], ['Material', 'Fibra orgánica']], compatIdx: [2, 11], rating: 4.5, reviewsCount: 21, warrantyMonths: 6 },
  { name: 'Correa de transmisión CVT', brand: 'RPM Parts Pro', categorySlug: 'transmision', subcategorySlug: 'correas-cvt', priceClp: 27990, stock: 28, shortDescription: 'Correa CVT de alta resistencia para scooters automáticos.', specs: [['Ancho', '18 mm'], ['Largo', '743 mm']], compatIdx: [13], rating: 4.3, reviewsCount: 15, warrantyMonths: 3 },

  // Sistema eléctrico
  { name: 'Batería de gel libre de mantenimiento', brand: 'Bosch', categorySlug: 'electrico', subcategorySlug: 'baterias', priceClp: 48990, compareAtPriceClp: 54990, stock: 24, shortDescription: 'Batería sellada de gel, sin mantenimiento, lista para instalar.', specs: [['Voltaje', '12V'], ['Capacidad', '9 Ah']], compatIdx: [2, 5], rating: 4.7, reviewsCount: 73, warrantyMonths: 12, isFeatured: true },
  { name: 'Bujía de iridio', brand: 'NGK', categorySlug: 'electrico', subcategorySlug: 'bujias', priceClp: 8990, stock: 120, shortDescription: 'Bujía de iridio para mejor encendido y menor consumo.', specs: [['Tipo', 'Iridio'], ['Rosca', '12 mm']], compatIdx: [9, 0], rating: 4.9, reviewsCount: 210, warrantyMonths: 6 },
  { name: 'Regulador rectificador', brand: 'Bosch', categorySlug: 'electrico', subcategorySlug: 'reguladores-rectificadores', priceClp: 29990, stock: 31, shortDescription: 'Regulador rectificador que protege el sistema eléctrico de sobrecargas.', specs: [['Salida', '12V / 25A'], ['Fases', 'Trifásico']], compatIdx: [8, 12], rating: 4.4, reviewsCount: 18, warrantyMonths: 6 },
  { name: 'Módulo CDI digital', brand: 'RPM Parts Pro', categorySlug: 'electrico', subcategorySlug: 'cdi-ecu', priceClp: 36990, stock: 16, shortDescription: 'CDI digital programable con curva de encendido optimizada.', specs: [['Tipo', 'Digital programable'], ['Curva de encendido', 'Ajustable']], compatIdx: [14], rating: 4.2, reviewsCount: 11, warrantyMonths: 3 },

  // Filtros
  { name: 'Filtro de aceite premium', brand: 'Hiflofiltro', categorySlug: 'filtros', subcategorySlug: 'filtros-aceite', priceClp: 6990, stock: 90, shortDescription: 'Filtro de aceite con válvula anti-retorno para mayor protección del motor.', specs: [['Rosca', 'M20x1.5'], ['Válvula anti-retorno', 'Sí']], compatIdx: [1, 4], rating: 4.6, reviewsCount: 55, warrantyMonths: 0 },
  { name: 'Filtro de aire de alto flujo', brand: 'K&N', categorySlug: 'filtros', subcategorySlug: 'filtros-aire', priceClp: 32990, stock: 20, shortDescription: 'Filtro lavable y reutilizable que mejora el flujo de aire al motor.', specs: [['Tipo', 'Lavable / reutilizable'], ['Incremento de flujo', '+8%']], compatIdx: [9, 5], rating: 4.8, reviewsCount: 64, warrantyMonths: 0, isFeatured: true },
  { name: 'Filtro de combustible en línea', brand: 'Hiflofiltro', categorySlug: 'filtros', subcategorySlug: 'filtros-combustible', priceClp: 5990, stock: 70, shortDescription: 'Filtro en línea que evita impurezas en el sistema de combustible.', specs: [['Diámetro manguera', '6 mm'], ['Material', 'Nylon reforzado']], compatIdx: [7, 12], rating: 4.3, reviewsCount: 29, warrantyMonths: 0 },
  { name: 'Filtro de aire de papel OEM', brand: 'RPM Parts Pro', categorySlug: 'filtros', subcategorySlug: 'filtros-aire', priceClp: 8990, stock: 55, shortDescription: 'Reemplazo directo de fábrica, filtrado de papel plisado.', specs: [['Tipo', 'Papel plisado'], ['Reemplazo directo', 'Sí']], compatIdx: [2], rating: 4.4, reviewsCount: 17, warrantyMonths: 0 },

  // Neumáticos y ruedas
  { name: 'Neumático delantero 90/90-18', brand: 'Pirelli', categorySlug: 'neumaticos', subcategorySlug: 'neumaticos-delanteros', priceClp: 68990, stock: 25, shortDescription: 'Neumático de calle con excelente agarre en seco y mojado.', specs: [['Medida', '90/90-18'], ['Índice de carga', '51P']], compatIdx: [1, 8], rating: 4.7, reviewsCount: 42, warrantyMonths: 0, isFeatured: true },
  { name: 'Neumático trasero 120/80-18', brand: 'Michelin', categorySlug: 'neumaticos', subcategorySlug: 'neumaticos-traseros', priceClp: 89990, compareAtPriceClp: 99990, stock: 18, shortDescription: 'Compuesto dual para durabilidad y tracción en todo tipo de terreno.', specs: [['Medida', '120/80-18'], ['Compuesto', 'Dual']], compatIdx: [10, 8], rating: 4.8, reviewsCount: 37, warrantyMonths: 0 },
  { name: 'Cámara de aire reforzada', brand: 'RPM Parts Pro', categorySlug: 'neumaticos', subcategorySlug: 'camaras-aire', priceClp: 8990, stock: 80, shortDescription: 'Cámara de goma reforzada, resistente a pinchazos menores.', specs: [['Medida', '100/90-18'], ['Válvula', 'TR4']], compatIdx: [6], rating: 4.2, reviewsCount: 24, warrantyMonths: 0 },
  { name: 'Kit de rodamientos de rueda', brand: 'RPM Parts Pro', categorySlug: 'neumaticos', subcategorySlug: 'rodamientos-rueda', priceClp: 14990, stock: 48, shortDescription: 'Rodamientos sellados para un giro de rueda suave y silencioso.', specs: [['Piezas', '2 rodamientos + retén'], ['Medida', '6204 2RS']], compatIdx: [0, 5], rating: 4.5, reviewsCount: 20, warrantyMonths: 6 },

  // Escapes
  { name: 'Silenciador slip-on deportivo', brand: 'RPM Racing', categorySlug: 'escapes', subcategorySlug: 'silenciadores', priceClp: 149990, compareAtPriceClp: 169990, stock: 8, shortDescription: 'Silenciador en acero inoxidable con sonido deportivo grave.', specs: [['Material', 'Acero inoxidable'], ['Sonido', 'Deportivo grave']], compatIdx: [5, 11], rating: 4.6, reviewsCount: 33, warrantyMonths: 12, isFeatured: true },
  { name: 'Colector 4 en 1', brand: 'RPM Racing', categorySlug: 'escapes', subcategorySlug: 'colectores', priceClp: 189990, stock: 5, shortDescription: 'Colector de acero pulido con diseño 4 en 1 para mejor respuesta.', specs: [['Material', 'Acero pulido'], ['Diseño', '4 en 1']], compatIdx: [9], rating: 4.4, reviewsCount: 9, warrantyMonths: 12 },
  { name: 'Sistema de escape completo racing', brand: 'RPM Racing', categorySlug: 'escapes', subcategorySlug: 'sistemas-completos', priceClp: 289990, stock: 4, shortDescription: 'Sistema completo que reduce peso y mejora el sonido de escape.', specs: [['Peso', '-1.8 kg vs. OEM'], ['Incluye', 'Colector + silenciador']], compatIdx: [0], rating: 4.7, reviewsCount: 14, warrantyMonths: 12 },
  { name: 'Empaque de escape universal', brand: 'RPM Parts Pro', categorySlug: 'escapes', subcategorySlug: 'empaques-escape', priceClp: 3990, stock: 100, shortDescription: 'Empaque de fibra grafitada para sellar uniones de escape.', specs: [['Material', 'Fibra grafitada'], ['Diámetro', '38-42 mm']], compatIdx: [], rating: 4.3, reviewsCount: 31, warrantyMonths: 0 },

  // Carrocería y plásticos
  { name: 'Kit de carenado lateral', brand: 'RPM Parts Pro', categorySlug: 'carroceria', subcategorySlug: 'carenados', priceClp: 129990, stock: 9, shortDescription: 'Carenado en ABS inyectado, listo para pintar y adaptar.', specs: [['Material', 'ABS inyectado'], ['Pintura', 'Lista para pintar']], compatIdx: [0], rating: 4.3, reviewsCount: 16, warrantyMonths: 3 },
  { name: 'Guardabarro delantero', brand: 'RPM Parts Pro', categorySlug: 'carroceria', subcategorySlug: 'guardabarros', priceClp: 24990, stock: 22, shortDescription: 'Guardabarro robusto en plástico ABS de reemplazo directo.', specs: [['Material', 'Plástico ABS'], ['Color', 'Negro mate']], compatIdx: [6], rating: 4.4, reviewsCount: 19, warrantyMonths: 3 },
  { name: 'Asiento doble tapizado', brand: 'RPM Parts Pro', categorySlug: 'carroceria', subcategorySlug: 'asientos', priceClp: 59990, stock: 12, shortDescription: 'Asiento con tapiz antideslizante y espuma de alta densidad.', specs: [['Tapiz', 'Antideslizante'], ['Espuma', 'Alta densidad']], compatIdx: [7], rating: 4.6, reviewsCount: 27, warrantyMonths: 6 },
  { name: 'Par de espejos retrovisores deportivos', brand: 'RPM Parts Pro', categorySlug: 'carroceria', subcategorySlug: 'manillas-espejos', priceClp: 17990, stock: 38, shortDescription: 'Espejos de diseño deportivo, ajuste universal izquierdo y derecho.', specs: [['Rosca', '10 mm'], ['Ajuste', 'Universal izq/der']], compatIdx: [], rating: 4.2, reviewsCount: 44, warrantyMonths: 3 },

  // Luces y señalización
  { name: 'Foco delantero LED H4', brand: 'Denso', categorySlug: 'luces', subcategorySlug: 'focos-delanteros', priceClp: 27990, stock: 29, shortDescription: 'Foco LED de alta luminosidad, instalación plug and play.', specs: [['Lumens', '4200 lm'], ['Temperatura de color', '6000K']], compatIdx: [2, 5], rating: 4.7, reviewsCount: 58, warrantyMonths: 12, isFeatured: true },
  { name: 'Stop trasero LED', brand: 'Denso', categorySlug: 'luces', subcategorySlug: 'focos-traseros', priceClp: 15990, stock: 34, shortDescription: 'Stop LED secuencial de alta visibilidad para mayor seguridad.', specs: [['Tipo', 'LED secuencial'], ['Voltaje', '12V']], compatIdx: [], rating: 4.5, reviewsCount: 36, warrantyMonths: 12 },
  { name: 'Par de direccionales LED', brand: 'RPM Parts Pro', categorySlug: 'luces', subcategorySlug: 'direccionales', priceClp: 12990, stock: 50, shortDescription: 'Direccionales LED ámbar homologadas, bajo consumo.', specs: [['Tipo', 'LED ámbar'], ['Homologación', 'E-mark']], compatIdx: [], rating: 4.4, reviewsCount: 40, warrantyMonths: 6 },
  { name: 'Relay electrónico de 3 pines', brand: 'RPM Parts Pro', categorySlug: 'luces', subcategorySlug: 'relays-intermitentes', priceClp: 4990, stock: 65, shortDescription: 'Relay electrónico compatible con luces LED y halógenas.', specs: [['Compatibilidad', 'LED y halógeno'], ['Pines', '3']], compatIdx: [], rating: 4.1, reviewsCount: 13, warrantyMonths: 3 },

  // Arranque y encendido
  { name: 'Motor de arranque', brand: 'Bosch', categorySlug: 'arranque', subcategorySlug: 'motores-arranque', priceClp: 54990, compareAtPriceClp: 62990, stock: 13, shortDescription: 'Motor de arranque de reemplazo directo, torque de fábrica.', specs: [['Voltaje', '12V'], ['Potencia', '0.4 kW']], compatIdx: [1, 12], rating: 4.6, reviewsCount: 25, warrantyMonths: 12, isFeatured: true },
  { name: 'Solenoide de arranque', brand: 'Bosch', categorySlug: 'arranque', subcategorySlug: 'solenoides', priceClp: 14990, stock: 27, shortDescription: 'Solenoide que activa el motor de arranque con alta fiabilidad.', specs: [['Voltaje', '12V'], ['Corriente máx.', '180A']], compatIdx: [7], rating: 4.3, reviewsCount: 18, warrantyMonths: 6 },
  { name: 'Kit de encendido bujía + cable', brand: 'NGK', categorySlug: 'arranque', subcategorySlug: 'kits-encendido', priceClp: 13990, stock: 42, shortDescription: 'Kit con bujía y cable resistivo para un encendido óptimo.', specs: [['Piezas', 'Bujía + cable resistivo'], ['Resistencia', '5 kΩ']], compatIdx: [10], rating: 4.5, reviewsCount: 22, warrantyMonths: 6 },
  { name: 'Bendix de arranque', brand: 'RPM Parts Pro', categorySlug: 'arranque', subcategorySlug: 'motores-arranque', priceClp: 19990, stock: 20, shortDescription: 'Bendix de acero templado para un enganche firme del arranque.', specs: [['Dientes', '9'], ['Material', 'Acero templado']], compatIdx: [4], rating: 4.2, reviewsCount: 10, warrantyMonths: 6 },

  // Refrigeración
  { name: 'Radiador de aluminio', brand: 'RPM Parts Pro', categorySlug: 'refrigeracion', subcategorySlug: 'radiadores', priceClp: 79990, stock: 10, shortDescription: 'Radiador de doble hilera para mejor disipación de calor.', specs: [['Material', 'Aluminio brazing'], ['Núcleo', 'Doble hilera']], compatIdx: [9, 0], rating: 4.5, reviewsCount: 17, warrantyMonths: 6, isFeatured: true },
  { name: 'Kit de mangueras de silicona', brand: 'RPM Parts Pro', categorySlug: 'refrigeracion', subcategorySlug: 'mangueras-refrigerante', priceClp: 22990, stock: 24, shortDescription: 'Mangueras de silicona reforzada resistentes a altas temperaturas.', specs: [['Material', 'Silicona reforzada'], ['Resistencia', 'Hasta 180°C']], compatIdx: [5], rating: 4.4, reviewsCount: 12, warrantyMonths: 3 },
  { name: 'Ventilador de radiador eléctrico', brand: 'Bosch', categorySlug: 'refrigeracion', subcategorySlug: 'ventiladores', priceClp: 38990, stock: 15, shortDescription: 'Ventilador eléctrico de alto flujo para evitar sobrecalentamiento.', specs: [['Voltaje', '12V'], ['Flujo de aire', 'Alto']], compatIdx: [11], rating: 4.6, reviewsCount: 14, warrantyMonths: 6 },
  { name: 'Termostato', brand: 'Mahle', categorySlug: 'refrigeracion', subcategorySlug: 'termostatos', priceClp: 11990, stock: 31, shortDescription: 'Termostato de apertura precisa que regula la temperatura del motor.', specs: [['Apertura', '71°C'], ['Material', 'Latón']], compatIdx: [2], rating: 4.5, reviewsCount: 9, warrantyMonths: 6 },

  // Combustible y admisión
  { name: 'Carburador completo', brand: 'RPM Parts Pro', categorySlug: 'combustible', subcategorySlug: 'carburadores', priceClp: 74990, stock: 11, shortDescription: 'Carburador completo listo para instalar, ya calibrado de fábrica.', specs: [['Diámetro venturi', '26 mm'], ['Tipo', 'Mariposa']], compatIdx: [7, 12], rating: 4.3, reviewsCount: 20, warrantyMonths: 6 },
  { name: 'Cuerpo de aceleración', brand: 'RPM Parts Pro', categorySlug: 'combustible', subcategorySlug: 'cuerpos-aceleracion', priceClp: 68990, stock: 8, shortDescription: 'Cuerpo de aceleración con sensor TPS incluido para inyección electrónica.', specs: [['Diámetro', '32 mm'], ['Sensor TPS', 'Incluido']], compatIdx: [6], rating: 4.4, reviewsCount: 11, warrantyMonths: 6 },
  { name: 'Bomba de combustible eléctrica', brand: 'Bosch', categorySlug: 'combustible', subcategorySlug: 'bombas-combustible', priceClp: 45990, stock: 16, shortDescription: 'Bomba eléctrica de combustible con caudal constante y silencioso.', specs: [['Presión', '3 bar'], ['Caudal', '60 L/h']], compatIdx: [2, 9], rating: 4.6, reviewsCount: 23, warrantyMonths: 12 },
  { name: 'Inyector de combustible', brand: 'Denso', categorySlug: 'combustible', subcategorySlug: 'inyectores', priceClp: 39990, stock: 14, shortDescription: 'Inyector de precisión para una atomización uniforme del combustible.', specs: [['Resistencia', '12 Ω'], ['Caudal', '190 cc/min']], compatIdx: [11], rating: 4.5, reviewsCount: 15, warrantyMonths: 6 },

  // Instrumentos y tablero
  { name: 'Tablero digital velocímetro', brand: 'RPM Parts Pro', categorySlug: 'instrumentos', subcategorySlug: 'velocimetros-tacometros', priceClp: 54990, compareAtPriceClp: 64990, stock: 9, shortDescription: 'Tablero digital retroiluminado con velocidad, RPM y nivel de combustible.', specs: [['Pantalla', 'LCD retroiluminada'], ['Funciones', 'Velocidad / RPM / combustible']], compatIdx: [5], rating: 4.5, reviewsCount: 19, warrantyMonths: 6, isFeatured: true },
  { name: 'Cable de velocímetro', brand: 'RPM Parts Pro', categorySlug: 'instrumentos', subcategorySlug: 'cables-velocimetro', priceClp: 6990, stock: 48, shortDescription: 'Cable flexible de repuesto para velocímetro mecánico.', specs: [['Largo', '90 cm'], ['Rosca', 'M10']], compatIdx: [7], rating: 4.2, reviewsCount: 14, warrantyMonths: 3 },
  { name: 'Sensor de temperatura del motor', brand: 'Bosch', categorySlug: 'instrumentos', subcategorySlug: 'sensores', priceClp: 12990, stock: 33, shortDescription: 'Sensor de temperatura de alta precisión para el tablero digital.', specs: [['Rosca', 'M12x1.5'], ['Rango', '-40°C a 150°C']], compatIdx: [0], rating: 4.4, reviewsCount: 17, warrantyMonths: 6 },
  { name: 'Sensor de nivel de combustible', brand: 'RPM Parts Pro', categorySlug: 'instrumentos', subcategorySlug: 'sensores', priceClp: 17990, stock: 21, shortDescription: 'Sensor tipo flotador para lectura precisa del nivel de estanque.', specs: [['Tipo', 'Flotador resistivo'], ['Resistencia', '10-100 Ω']], compatIdx: [10], rating: 4.1, reviewsCount: 8, warrantyMonths: 6 },

  // Herramientas y mantención
  { name: 'Aceite de motor sintético 20W-50 (4L)', brand: 'Motul', categorySlug: 'herramientas', subcategorySlug: 'aceites-lubricantes', priceClp: 32990, stock: 60, shortDescription: 'Aceite 100% sintético para máxima protección del motor.', specs: [['Viscosidad', '20W-50'], ['Tipo', 'Sintético']], compatIdx: [], rating: 4.8, reviewsCount: 120, warrantyMonths: 0, isFeatured: true },
  { name: 'Kit de herramientas 46 piezas', brand: 'RPM Parts Pro', categorySlug: 'herramientas', subcategorySlug: 'kits-herramientas', priceClp: 44990, stock: 18, shortDescription: 'Set completo de herramientas con estuche rígido para el taller.', specs: [['Piezas', '46'], ['Estuche', 'Incluido']], compatIdx: [], rating: 4.6, reviewsCount: 33, warrantyMonths: 12 },
  { name: 'Limpiador de cadena en spray', brand: 'Motul', categorySlug: 'herramientas', subcategorySlug: 'limpieza-detailing', priceClp: 8990, stock: 55, shortDescription: 'Desengrasante en spray para mantener la cadena en óptimas condiciones.', specs: [['Volumen', '400 ml'], ['Tipo', 'Desengrasante']], compatIdx: [], rating: 4.7, reviewsCount: 48, warrantyMonths: 0 },
  { name: 'Kit de detailing para moto', brand: 'Motul', categorySlug: 'herramientas', subcategorySlug: 'limpieza-detailing', priceClp: 24990, stock: 25, shortDescription: 'Shampoo, cera y microfibra para dejar la moto como nueva.', specs: [['Piezas', 'Shampoo + cera + microfibra'], ['Volumen', '3 x 250 ml']], compatIdx: [], rating: 4.5, reviewsCount: 26, warrantyMonths: 0 },
];

const IMAGE_POOL: Record<string, readonly string[]> = {
  motor: IMAGES.motor,
  frenos: IMAGES.frenos,
  suspension: IMAGES.suspension,
  transmision: IMAGES.transmision,
  electrico: IMAGES.electrico,
  neumaticos: IMAGES.neumaticos,
  escapes: IMAGES.escapes,
};

function imagesFor(categorySlug: string, index: number): string[] {
  const pool = IMAGE_POOL[categorySlug] ?? [CATEGORY_FALLBACK_IMAGES[categorySlug]];
  const first = pool[index % pool.length];
  const second = pool[(index + 1) % pool.length];
  return [first, second];
}

function buildProducts(): Product[] {
  return SEEDS.map((seed, index) => {
    const [imgA, imgB] = imagesFor(seed.categorySlug, index);
    const tags: string[] = [];
    if (seed.compareAtPriceClp) tags.push('oferta');
    if (seed.isFeatured) tags.push('destacado');

    return {
      id: `p-${String(index + 1).padStart(3, '0')}`,
      slug: `${slugify(seed.name)}-${slugify(seed.brand)}`,
      sku: `RPM-${seed.categorySlug.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(4, '0')}`,
      name: seed.name,
      brand: seed.brand,
      categoryId: seed.categorySlug,
      subcategoryId: `${seed.categorySlug}-${seed.subcategorySlug}`,
      description: `${seed.name} de ${seed.brand}. ${seed.shortDescription} Producto ${seed.condition === 'refurbished' ? 'reacondicionado y certificado' : 'nuevo, sellado de fábrica'}, compatible con los modelos de motocicleta indicados a continuación. Incluye ${seed.warrantyMonths > 0 ? `garantía de ${seed.warrantyMonths} meses` : 'garantía de satisfacción de 30 días'} y despacho a todo Chile.`,
      shortDescription: seed.shortDescription,
      priceClp: seed.priceClp,
      compareAtPriceClp: seed.compareAtPriceClp,
      currency: 'CLP',
      stock: seed.stock,
      condition: seed.condition ?? 'new',
      images: [
        { url: unsplashImage(imgA, 1200), alt: seed.name, isPrimary: true },
        { url: unsplashImage(imgB, 1200), alt: `${seed.name} — vista de detalle` },
      ],
      specs: seed.specs.map(([label, value]) => ({ label, value })),
      compatibility: seed.compatIdx.map((i) => M[i]),
      rating: seed.rating,
      reviewsCount: seed.reviewsCount,
      warrantyMonths: seed.warrantyMonths,
      tags,
      isFeatured: seed.isFeatured,
      createdAt: new Date(2026, 0, 1 + index).toISOString(),
    };
  });
}

export const PRODUCTS: Product[] = buildProducts();

export const PRODUCT_BRANDS = Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort();
