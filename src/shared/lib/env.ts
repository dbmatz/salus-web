import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.url({
    protocol: /^https?$/,
    error:
      "VITE_API_URL precisa ser uma URL com protocolo, como http://localhost:3000 (veja o .env.example)",
  }),
});

export function getApiUrl(): string {
  const { VITE_API_URL } = envSchema.parse(import.meta.env);
  return VITE_API_URL.replace(/\/+$/, "");
}
