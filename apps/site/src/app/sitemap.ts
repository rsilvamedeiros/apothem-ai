import type { MetadataRoute } from "next";

const BASE_URL = "https://apothemai.com.br";

const ROUTES = [
  "",
  "/produto",
  "/integracoes",
  "/casos-de-uso",
  "/solucoes",
  "/seguranca",
  "/precos",
  "/sobre",
  "/roadmap",
  "/desenvolvedores",
  "/qualidade",
  "/contato",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
