# Questions à poser à la cliente

Liste tenue à jour pendant le développement. Chaque point correspond à un `[À CONFIRMER AVEC LA CLIENTE]` ou `[CONTACT À CONFIRMER]` dans le site.

## Contact et juridique
- [ ] E-mail qui reçoit les demandes du formulaire (`contact.php`, constante `LEAD_TO`)
- [ ] Adresse d'expédition à créer sur le serveur (`LEAD_FROM`, proposé : formulaire@uzapomenutehosadu.cz)
- [ ] Téléphone à afficher, et personne à nommer comme contact
- [ ] Entité juridique : forme exacte de « La Maison du Bonheur », IČO, DIČ, siège, registre (mentions légales, confidentialité, footer)
- [ ] Responsable de la publication
- [ ] Les leads sont-ils transmis au constructeur ? (politique de confidentialité, section « Destinataires »)
- [ ] Durée de conservation des leads : proposition « fin de commercialisation, au plus 3 ans après le dernier contact »

## Constructeur
- [ ] Nom du constructeur allemand : peut-on le citer ?
- [ ] Que recouvre « technologies au choix » ? (pour l'instant le site dit seulement « préfabriquées en atelier »)

## Parcelles
- [ ] Numéro et position de la parcelle de 1 200 m² (le plan la place provisoirement en n° 7, à l'est)
- [ ] Surface exacte de chaque lot
- [ ] Plan cadastral ou plan de division, pour dessiner un plan de situation exact
- [ ] Afficher les numéros de parcelle cadastrale ?
- [ ] Achat du terrain seul possible ? (FAQ)
- [ ] Achat de deux parcelles adjacentes possible ? (FAQ)

## Commercial et fiscal
- [ ] La cliente est-elle assujettie à la DPH (TVA) pour la vente des terrains ? Taux sur la maison ? (FAQ)
- [ ] Frais à prévoir : montants indicatifs (avocat ou notaire, cadastre) (FAQ, page « Comment acheter »)
- [ ] Montant de l'acompte à la promesse de vente / rezervační poplatek (page « Comment acheter »)

## Contenu et visuels
- [ ] Le dessin des 7 maisons le long de la rue devant le verger (`assets/images/raw/4be679e6-….jpeg`) : est-ce une esquisse de l'architecte ? Peut-on la publier ? En attendant, le site ne l'affiche pas (règle : aucun visuel de maison non validé).
- [ ] Les photos drone montrent une dalle de fondation et une pelleteuse sur le terrain : de quoi s'agit-il ? (le site dit « permis en cours d'instruction »)
- [ ] Photo avec les numéros 1 à 7 dessinés à la main : annoncée dans le brief mais absente des fichiers reçus.
- [ ] Lignes de bus exactes (numéros) vers Kladno, l'aéroport et Prague
- [ ] « Hors des couloirs aériens » : source ou carte à l'appui ?
- [ ] Temps de trajet : 15 min jusqu'à la limite de Prague et 13 min jusqu'à l'aéroport (chiffres de la cliente, conservés)

## Technique
- [ ] Username cPanel (`.cpanel.yml`)
- [ ] Le dossier `~/leads/` (hors public_html) sera créé automatiquement par `contact.php` si les droits le permettent : à vérifier après le premier envoi

## Distances calculées (pour information)
Distances par la route depuis le terrain (OpenStreetMap / OSRM, octobre 2026), arrondies : Stehelčeves 2 km, Buštěhrad 5 km, Brandýsek 5 km, Zoopark Zájezd 6 km, Středokluky 9 km, Kladno centre 11 km, Kralupy nad Vltavou 14 km, Prague Dejvice 22 km.
