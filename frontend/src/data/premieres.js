// Upcoming premieres as the external API would return them (same snake_case format as
// apiMovies in movies.js, plus release_date in ISO format YYYY-MM-DD).
// All titles and details are fictitious. Never render it directly: pass it through adaptMovies.
// Ids start at 101 so they never clash with the billboard ids (favorites are stored by id).
export const apiPremieres = [
  {
    id: 101,
    title: 'Marea de neón',
    poster_url: '/posters/marea-de-neon.svg',
    overview:
      'Una surfista nocturna descubre que las olas de la bahía brillan solo cuando alguien miente en la ciudad.',
    certification: '+14',
    vote_average: 0,
    show_times: ['19:00', '21:30'],
    release_date: '2026-11-27',
  },
  {
    id: 102,
    title: 'El último tren a Orión',
    poster_url: '/posters/el-ultimo-tren-a-orion.svg',
    overview:
      'Un revisor jubilado vuelve al servicio para acompañar el único tren que todavía viaja entre estrellas.',
    certification: 'APT',
    vote_average: 0,
    show_times: ['15:00', '17:30', '20:00'],
    release_date: '2026-12-04',
  },
  {
    id: 103,
    title: 'La biblioteca sumergida',
    poster_url: '/posters/la-biblioteca-sumergida.svg',
    overview:
      'Bajo un lago helado hay una biblioteca que presta libros a quien sea capaz de contener la respiración.',
    certification: 'APT',
    vote_average: 0,
    show_times: ['13:30', '16:00'],
    release_date: '2026-12-11',
  },
  {
    id: 104,
    title: 'Cometa de papel',
    poster_url: '/posters/cometa-de-papel.svg',
    overview:
      'Dos hermanos construyen una cometa con las cartas de su abuelo y el viento empieza a responderles.',
    certification: 'APT',
    vote_average: 0,
    show_times: ['12:00', '14:30', '17:00'],
    release_date: '2026-12-18',
  },
  {
    id: 105,
    title: 'Bajo la luna roja',
    poster_url: '/posters/bajo-la-luna-roja.svg',
    overview:
      'En un pueblo de montaña, cada eclipse borra un recuerdo distinto. Esta vez le toca a la alcaldesa.',
    certification: '+18',
    vote_average: 0,
    show_times: ['21:00', '23:30'],
    release_date: '2027-01-08',
  },
  {
    id: 106,
    title: 'Las dunas que hablan',
    poster_url: '/posters/las-dunas-que-hablan.svg',
    overview:
      'Una cartógrafa sigue el rumor de unas dunas que cambian de sitio para contar una historia antigua.',
    certification: '+14',
    vote_average: 0,
    show_times: ['16:30', '19:15'],
    release_date: '2027-01-15',
  },
]
