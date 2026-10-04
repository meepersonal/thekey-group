# Feature Roadmap — AutoTrack Bénin

## Phase 1 : Backend — API & Administration (2-3 semaines)

- [x] API Véhicules — endpoints GET `/vehicles`, GET `/vehicles/{slug}`
- [x] API Marques & Catégories — endpoints GET `/brands`, GET `/categories`
- [x] API Précommande — endpoint POST `/preorders`
- [x] API Suivi — endpoint GET `/track`
- [ ] Dashboard Admin
  - [x] Authentification Sanctum (login/logout)
  - [x] Gestion des véhicules (CRUD + sync options)
  - [x] Gestion des précommandes (index, update, destroy)
  - [x] Gestion des conteneurs (CRUD)
- [ ] API GraphQL (optionnelle)

## Phase 2 : Frontend — Pages & Catalogue (2 semaines)

- [x] Page Catalogue — liste, filtres, pagination
- [ ] Page Fiche Véhicule — détail, galerie, options
- [ ] Page Précommande — formulaire avec sélection d'options
- [ ] Page Suivi de Commande — suivi en temps réel
- [x] Page Contact
- [ ] Page À Propos

## Phase 3 : Frontend — Fonctionnalités Avancées (1-2 semaines)

- [ ] Interface Admin — tableau de bord avec statistiques
- [ ] Authentification client — compte utilisateur, historique
- [ ] Comparateur de véhicules
- [ ] Recherche avancée — filtres par prix, année, énergie

## Phase 4 : Features Complémentaires (1 semaine)

- [ ] Newsletter — souscription et envois automatisés
- [ ] Témoignages clients — système d'avis
- [ ] Blog/Actualités
- [ ] Multilingue — français / anglais

## Phase 5 : Déploiement & SEO (1 semaine)

- [ ] SEO — balises meta, sitemap, données structurées
- [ ] PWA — installation sur mobile
- [ ] Tests — unitaires et E2E
- [ ] Performance — optimisation images, lazy loading
