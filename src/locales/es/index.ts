import type { Translations } from '@locales/pt-BR';

export const es: Translations = {
  common: {
    appName: 'Converter',
    comingSoon: 'Próximamente',
  },
  errors: {
    network: 'Sin conexión con el servidor. Revisa tu internet e inténtalo de nuevo.',
    timeout: 'El servidor tardó en responder. Inténtalo de nuevo.',
    invalidResponse: 'Recibimos una respuesta inesperada del servidor.',
    unexpected: 'Algo salió mal. Inténtalo de nuevo.',
  },
  welcome: {
    description:
      'Convierte entre 10 monedas con cotizaciones de bancos centrales, actualizadas todos los días y con historial desde 2000.',
    start: 'Empezar',
    convertNow: 'Convertir ahora',
    disclaimer: 'Tasas de referencia. No incluyen spread ni comisiones.',
  },
};
