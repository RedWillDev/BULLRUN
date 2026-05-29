// src/pages/api/marches.csv.ts
//
// Sert le fichier CSV depuis /data/MARCHES_PUBLICS_FINAL.csv (hors dist)
// → Le fichier peut être mis à jour sans rebuilder Astro
//
import type { APIRoute } from 'astro'
import { readFileSync } from 'fs'
import { resolve } from 'path'

export const GET: APIRoute = () => {
  // Chemin absolu depuis la racine du projet (pas du dist)
  // Sur le VPS : /opt/bullrun/data/MARCHES_PUBLICS_FINAL.csv
  const csvPath = resolve(process.cwd(), 'data', 'MARCHES_PUBLICS_FINAL.csv')

  try {
    const csv = readFileSync(csvPath, 'utf-8')

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    })
  } catch (err) {
    return new Response('CSV introuvable', { status: 404 })
  }
}