# uzapomenutehosadu.cz : « U zapomenutého sadu »

Site de commercialisation de 7 terrains + maisons d'architecte (~150 m²) à Dřetovice (okres Kladno, Středočeský kraj).
Cliente : Katerina, société « La Maison du Bonheur ».

## Hébergement
- Production : VPS Hetzner, cPanel. Username cPanel : `CPANEL_USERNAME_A_CONFIRMER`.
- Deploy path : `/home/CPANEL_USERNAME_A_CONFIRMER/public_html/` (via `.cpanel.yml`, cPanel > Git Version Control).
- Dev : repo GitHub + GitHub Pages pour la prévisualisation. GitHub Pages n'exécute pas PHP : `contact.php` n'est testable qu'en local (`php -S`) ou sur cPanel.
- Tout nouveau fichier ou dossier racine (`contact.php`, pages annexes) doit être ajouté à `.cpanel.yml`.

## Stack
- HTML5 sémantique, CSS vanilla, JS vanilla. Zéro npm, zéro build.
- Formulaire : PHP (`contact.php`), leads copiés dans un CSV protégé.
- Max 2 fichiers woff2 auto-hébergés.

## Conventions
- Mobile-first. Objectif Lighthouse 95+ sur les 4 scores.
- Images : WebP + fallback JPEG, plusieurs tailles (srcset), lazy loading, noms descriptifs, alt factuel. SVG inline pour les pictos.
- Jamais de hotlink d'image.
- Chemins relatifs uniquement (`css/style.css`, jamais `/css/style.css`).
- `prefers-reduced-motion` respecté pour toute animation.

## Langues
- Dev en français à la racine. Final : tchèque à `/`, anglais à `/en/`, français éventuellement à `/fr/`.
- Tout le texte est centralisé dans `content/copy-fr.md` (source de traduction).
- hreflang cs / en / x-default à poser lors de la traduction.
- `noindex` sur la version française de dev, à retirer à la mise en ligne tchèque.

## Contraintes de contenu (non négociables)
- Aucune mention de bois / ossature bois / dřevostavba.
- Aucun prix : « sur demande » + formulaire.
- Statuts exacts : viabilisation en cours, permis en cours d'instruction, ouverture des ventes « prochainement ». Aucune date affichée (ni ventes, ni permis).
- Aucun rendu de maison simulé : placeholders SVG uniquement.
- District = Kladno, jamais Praha-západ.
- Infos manquantes : `[À CONFIRMER]`, listées dans `content/a-confirmer.md`.

## SEO
- Un seul H1. Title 55-60 car., meta description 150-155 car., OG complet, canonical.
- Schema.org JSON-LD : Organization, Place, RealEstateListing/Product sans prix, FAQPage, BreadcrumbList, VideoObject.
- sitemap.xml et robots.txt à jour à chaque nouvelle page.
- Si une optimisation dégrade la lisibilité, on la retire.

## Cache-busting
À chaque modification de `css/style.css` ou `js/main.js`, bumper le query string `?v=AAAAMMJJx` dans `index.html` et toutes les pages qui les référencent. Sinon les visiteurs récurrents gardent l'ancienne version pendant un mois (cache `.htaccess`).

## Git
- `main` = prod. Travailler sur des branches feature, jamais de push direct sur `main` une fois en production.
