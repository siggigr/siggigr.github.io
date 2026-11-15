// A url that starts with "/" is a page on this site: it gets the site's
// base path and opens in the same tab. Any other url opens in a new tab.
export function linkProps(url) {
  if (url.startsWith("/")) {
    return { href: `${import.meta.env.BASE_URL}${url.slice(1)}` };
  }
  return { href: url, target: "_blank", rel: "noopener noreferrer" };
}
