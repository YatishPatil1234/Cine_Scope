/** TMDB image sizes — smaller = less Vercel image optimizer bandwidth */
const base = "https://image.tmdb.org/t/p";

/** Cards in grids / carousels (~342px wide) */
export const posterCardUrl = (path) =>
  path ? `${base}/w342${path}` : null;

/** Detail page poster */
export const posterUrl = (path) =>
  path ? `${base}/w500${path}` : null;

/** Hero / detail backdrops — w1280 for hero, w780 for detail */
export const backdropUrl = (path, size = "w780") =>
  path ? `${base}/${size}${path}` : null;

export const profileUrl = (path) =>
  path ? `${base}/w185${path}` : null;
