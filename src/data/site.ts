// Datos de contacto y redes. Los que dicen PENDIENTE los pasa Mate más adelante.
export const site = {
  name: 'Juanse Durando',
  role: 'DJ',
  city: 'Santa Fe',
  region: 'Santa Fe',
  country: 'Argentina',
  description:
    'Juanse Durando, DJ en Santa Fe capital. Cachengue, reggaetón y pop. Boliches, fiestas masivas, XV y eventos sociales. Contrataciones por WhatsApp.',
  // Formato internacional sin + ni espacios, ej: 5493425000000
  whatsapp: '5493425174121',
  email: 'juansegundodurando@gmail.com',
  // Press kit para organizadores (rider técnico incluido)
  presskit: 'https://noisy-dew-26ee.juanse-durando-presskitpagesdev.workers.dev/',
  // Redes: para sumar una, pegar el link en lugar de PENDIENTE.
  // Aparecen solas en la web (arriba, en la portada y en Contacto) y en Google.
  socials: {
    instagram: 'https://www.instagram.com/juansedurando',
    tiktok: 'PENDIENTE',
    soundcloud: 'PENDIENTE',
    spotify: 'PENDIENTE',
    youtube: 'PENDIENTE',
  },
};

export const isSet = (v: string) => Boolean(v) && v !== 'PENDIENTE';

const socialNames = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  spotify: 'Spotify',
  youtube: 'YouTube',
  soundcloud: 'SoundCloud',
} as const;

export type SocialKey = keyof typeof socialNames;

// Redes cargadas, en el orden de arriba
export const socialLinks = (Object.keys(socialNames) as SocialKey[])
  .filter((key) => isSet(site.socials[key]))
  .map((key) => ({ key, name: socialNames[key], href: site.socials[key] }));

export const whatsappLink = (text = 'Hola Juanse! Quiero consultar por una fecha') =>
  isSet(site.whatsapp) ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}` : '#contacto';

// Del press kit 2027: lugares donde tocó y estilo
export const trayectoria = [
  'Quba',
  'Samsara · Mar del Plata',
  'Boutique · Pinamar',
  'Roll and Rock · Punta del Este',
  'Fiesta U',
  'Puerto',
  'Rosario',
  'Reconquista',
  'San Justo',
];

export const estilo = ['Cachengue', 'Reggaetón', 'Pop', 'Remixes', 'Mashups', 'Edits'];

export const eventos = ['Boliches', 'Fiestas', 'XV', 'Eventos sociales'];
