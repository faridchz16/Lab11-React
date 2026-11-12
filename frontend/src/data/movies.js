// Static data for the movie billboard. All titles and details are fictitious.

// Billboard as an external API would return it: snake_case names that differ from the app
// model. Never render it directly; pass it through adaptMovies (src/utils/adaptMovie.js).
// vote_average uses a 0-10 scale with one decimal.
export const apiMovies = [
  {
    id: 1,
    title: 'El último faro',
    poster_url: '/posters/el-ultimo-faro.svg',
    overview:
      'Un farero solitario descubre que su luz guía a algo más que barcos. Una noche de tormenta, alguien responde a sus señales.',
    certification: 'APT',
    vote_average: 7.8,
    show_times: ['14:30', '17:00', '19:45'],
  },
  {
    id: 2,
    title: 'Ecos de Marte',
    poster_url: '/posters/ecos-de-marte.svg',
    overview:
      'La primera colonia en Marte recibe un mensaje grabado con sus propias voces. Nadie recuerda haberlo enviado.',
    certification: '+14',
    vote_average: 8.4,
    show_times: ['15:15', '18:30', '21:45'],
  },
  {
    id: 3,
    title: 'La ciudad sin sombras',
    poster_url: '/posters/la-ciudad-sin-sombras.svg',
    overview:
      'En una metrópoli donde el sol nunca se pone, una detective investiga la desaparición de la última sombra.',
    certification: '+14',
    vote_average: 7.2,
    show_times: ['16:00', '20:15'],
  },
  {
    id: 4,
    title: 'Noche de cristal',
    poster_url: '/posters/noche-de-cristal.svg',
    overview:
      'Un robo perfecto en un museo de joyas se complica cuando los ladrones descubren que no están solos.',
    certification: '+18',
    vote_average: 6.9,
    show_times: ['20:00', '22:30'],
  },
  {
    id: 5,
    title: 'El jardín de relojes',
    poster_url: '/posters/el-jardin-de-relojes.svg',
    overview:
      'Una niña hereda un jardín donde cada flor marca una hora distinta. Al arrancar una, el tiempo empieza a fallar.',
    certification: 'APT',
    vote_average: 8.1,
    show_times: ['13:00', '15:30', '18:00'],
  },
  {
    id: 6,
    title: 'Frontera helada',
    poster_url: '/posters/frontera-helada.svg',
    overview:
      'Dos guardias rivales quedan atrapados en un paso de montaña y deben cooperar para sobrevivir al invierno.',
    certification: '+14',
    vote_average: 7.5,
    show_times: ['17:45', '20:30'],
  },
  {
    id: 7,
    title: 'Susurros en el sótano',
    poster_url: '/posters/susurros-en-el-sotano.svg',
    overview:
      'Una familia se muda a una casa antigua cuyo sótano parece cambiar de tamaño cada noche.',
    certification: '+18',
    vote_average: 6.4,
    show_times: ['21:00', '23:15'],
  },
  {
    id: 8,
    title: 'Pequeños gigantes',
    poster_url: '/posters/pequenos-gigantes.svg',
    overview:
      'Un equipo de fútbol infantil sin cancha propia se enfrenta al torneo más importante del barrio.',
    certification: 'APT',
    vote_average: 7.9,
    show_times: ['12:30', '14:45', '17:15'],
  },
]

export const cinema = {
  name: 'Cine Aurora',
  navLinks: [
    { id: 'cartelera', label: 'Cartelera', href: '#cartelera' },
    { id: 'horarios', label: 'Horarios', href: '#horarios' },
    { id: 'contacto', label: 'Contacto', href: '#contacto' },
  ],
  contact: {
    address: 'Av. de las Estrellas 123, Ciudad Ficticia',
    phone: '+00 000 000 000',
    email: 'contacto@example.com',
    schedule: 'Lunes a domingo, de 12:00 a 00:00',
  },
}
