/**
 * Sérialise un graphe JSON-LD dans le HTML rendu par le serveur.
 *
 * Le rendu serveur est délibéré : un JSON-LD injecté côté client subit un traitement
 * retardé par les moteurs et peut n'être jamais lu.
 *
 * `<` est échappé pour qu'une valeur contenant `</script>` ne puisse pas fermer la balise
 * prématurément.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c')
      }}
    />
  );
}
