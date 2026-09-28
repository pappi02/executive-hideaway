// The menu is now a route (src/app/menu) inside the main site, not a
// separately-hosted app under a basePath, so /public assets are already
// served from the domain root — no prefix needed.
export function assetPath(path: string) {
  return path;
}
