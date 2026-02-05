# SEO Optimization Guide - Landing Page "Noleggio Ledwall"

Questa guida spiega come è stata implementata la nuova landing page ottimizzata per la SEO e quali azioni manuali sono necessarie per massimizzare la visibilità sui motori di ricerca.

## 📄 File Creati e Modificati

1.  **`src/pages/LedwallLanding.tsx`**: La nuova landing page dedicata. Contiene circa 1000 parole di contenuto ottimizzato in italiano, dati strutturati (Schema.org) e sezioni FAQ.
2.  **`src/App.tsx`**: Aggiornato per registrare la nuova rotta `/noleggio-ledwall-venezia-eventi`.
3.  **`src/components/Services.tsx`**: Aggiunto link interno dalla sezione servizi per migliorare l'autorità della pagina.
4.  **`src/components/Footer.tsx`**: Aggiunto link nel footer per garantire il crawling costante.

## 🎯 Configurazione SEO Implementata

### Elementi On-Page
-   **SEO Title**: "Noleggio Ledwall Venezia – Eventi, Fiere e Aziende | Quatrosound"
-   **Meta Description**: "Cerchi un noleggio Ledwall a Venezia, Pordenone o Oderzo? Quatrosound offre schermi 4K per fiere ed eventi aziendali con assistenza tecnica inclusa. Scopri di più!"
-   **H1**: "Noleggio Ledwall Professionale per Eventi, Fiere e Aziende"
-   **Keywords target**: Noleggio Ledwall Venezia, Pordenone, Oderzo, Fiere, Eventi Aziendali, Service Audio Oderzo, Matrimonio, etc.

### Dati Strutturati (Schema.org)
È stato incluso un blocco `LocalBusiness` in formato JSON-LD all'interno di `LedwallLanding.tsx` che definisce:
- Nome dell'azienda (Quattrosound)
- Indirizzo locale (Oderzo)
- Coordinate geografiche
- Orari di apertura
- Link ai social

## 🔗 Suggerimenti per Internal Linking

Per massimizzare il ranking delle keyword secondarie, assicurarsi che nei futuri post del blog o sezioni del sito:
-   Il testo "Service Audio Oderzo" linki alla sezione contatti o alla home.
-   Il testo "Noleggio Audio" linki alla sezione servizi specifica.
-   Il testo "Noleggio Luci" linki alla sezione servizi specifica.
-   Il testo "Eventi aziendali" linki alla nuova landing page del Ledwall.

## 📍 Ottimizzazione Google Business Profile (GBP)

**Descrizione suggerita per il profilo Google Business:**
> "QuattroSound è il tuo partner di fiducia per il Service Audio a Oderzo e in tutto il Triveneto. Specializzati nel Noleggio Ledwall a Venezia e Pordenone, offriamo soluzioni video 4K per fiere ed eventi aziendali. Esperti in Service Audio per Matrimonio, garantiamo installazioni professionali e supporto tecnico on-site. Contattaci per trasformare il tuo evento con la migliore tecnologia audio e video del Veneto e Friuli."

## 🛠 Azioni Manuali Richieste

1.  **Google Search Console**:
    - Accedi a Google Search Console.
    - Utilizza lo strumento "Controllo URL" per inserire l'indirizzo `https://quattrosound.it/noleggio-ledwall-venezia-eventi`.
    - Clicca su "Richiedi indicizzazione" per accelerare il posizionamento.
2.  **Sitemap**:
    - Assicurati che la sitemap XML del sito (solitamente `sitemap.xml`) sia aggiornata includendo il nuovo URL.
3.  **Google Business Profile**:
    - Aggiorna la descrizione del profilo utilizzando il testo suggerito sopra.
    - Pubblica un "Post" su Google Business annunciando il nuovo servizio di noleggio Ledwall linkando alla landing page.
4.  **Backlink**:
    - Se possibile, ottieni link da partner locali o siti del settore eventi nel Veneto/Friuli puntando alla nuova pagina.

## 🚀 Miglioramenti Futuri
-   Aggiungere testimonianze video specifiche di clienti che hanno noleggiato Ledwall.
-   Creare una galleria fotografica dedicata esclusivamente ai Ledwall installati a Venezia per dimostrare la competenza logistica in laguna.
