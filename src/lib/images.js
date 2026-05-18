/** TMDB image sizes — smaller = less Vercel image optimizer bandwidth */
const base = "https://image.tmdb.org/t/p";

/** Cards in grids / carousels (~342px wide) */
export const posterCardUrl = (path) =>
  path ? `${base}/w342${path}` : null;

/** Detail page poster */
export const posterUrl = (path) =>
  path ? `${base}/w500${path}` : null;

/** Hero / detail backdrops — w780 instead of w1280/original */
export const backdropUrl = (path) =>
  path ? `${base}/w780${path}` : null;

export const profileUrl = (path) =>
  path ? `${base}/w185${path}` : null;
