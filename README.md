# AutoFlow Logistics

Build a modern, high-converting, mobile-first Web Application for an Automotive & Maritime Tracking Logistics platform specializing in imported vehicles from China.

### 🎨 1. DESIGN SYSTEM & VISUAL IDENTITY
- **Theme**: Premium automotive & logistics. Clean, professional, high contrast, dark mode option or sleek modern light mode with dark accents.
- **Color Palette**: 
  - Primary: Deep Navy / Slate Blue (Trust & Logistics)
  - Secondary/Accent: Vibrant Electric Orange or Crimson Red (Action & Premium Automotive)
  - Background: Clean Warm White / Off-White (#F8FAFC) or Ultra-Dark Slate (#0F172A)
  - Cards & Containers: White with subtle border-shadows / Glassmorphism.
- **Typography**: Sans-serif, modern, geometric (e.g., Inter, Plus Jakarta Sans). Bold high-impact headings, legible technical specs typography.
- **Responsiveness**: Fully responsive layout optimized for Mobile, Tablet, and Desktop screens.

---

### 🚀 2. NAVIGATION & HEADER
- **Navbar**: Sticky top navigation bar.
  - Brand Logo (Placeholder: "AutoTrack Benin / Chinese Auto Imports").
  - Navigation Links: "Accueil", "Catalogue", "Tracking Conteneur", "À Propos", "Contact".
  - Quick CTA Button: "Rechercher un conteneur" or "Précommander" (Highlight button).
  - Mobile Menu: Smooth slide-over/hamburger menu.

---

### 🏠 3. PAGE STRUCTURE & COMPONENTS

#### A. PAGE D'ACCUEIL (HOMEPAGE)
1. **Hero Section**:
   - Compelling Headline: "Importez votre véhicule de Chine en toute sérénité."
   - Subtitle: "Catalogue complet, personnalisation sur-mesure et suivi maritime en temps réel."
   - Dual Call-To-Action: 
     - Primary Button: "Explorer le catalogue" (scrolls to catalog or links to catalog page).
     - Secondary Component: Integrated Quick Container Tracking Search Bar ("Entrez votre N° de conteneur...").
2. **Featured Vehicles Carousel/Grid (Véhicules en Vedette)**:
   - Highlight key Chinese models (SUV, Berlines, Électriques, Pick-up, Utilitaires).
3. **Tracking Quick Access Banner**:
   - Visually distinct section explaining how tracking works (Form -> Status -> Maritime Vessel -> Delivery).
4. **Why Choose Us Section**:
   - Feature badges: Inspection avant départ, Suivi maritime en direct, Personnalisation complète, Dédouanement assisté.

---

#### B. CATALOGUE DE VÉHICULES & FILTRES
1. **Multi-Criteria Filter Bar (Real-time filtering logic)**:
   - Search bar (by brand/model).
   - Category Dropdown: SUV, Berline, Utilitaire, Électrique, Hybride, Pick-up.
   - Price Range Slider / Budget selector.
   - Condition: Neuf / Occasion certifiée.
2. **Vehicle Grid / Card Item**:
   - High-definition image preview with badge (e.g., "Électrique", "Disponible sur commande").
   - Vehicle title (e.g., "BYD Song Plus", "Changan UNI-K", "Jetour Dashing").
   - Specs badges grid: Motorization/Energy, Transmission, Year, Mileage.
   - Price tag in FCFA / USD.
   - Action Button: "Voir la fiche & Réserver".

---

#### C. FICHE DÉTAILLÉE DU VÉHICULE & MODULE DE PERSONNALISATION
1. **Product Media**: HD Image Gallery / Carousel with thumbnail selection.
2. **Technical Specifications Accordion / Grid**:
   - Engine type, Battery capacity (if EV), Fuel consumption, Transmission, Seating, Options included.
3. **Customization / Options Module (Interactive Checklist / Toggle Buttons)**:
   - Allow user to check/uncheck optional add-ons (e.g., "Teinte de vitre", "Caméra 360°", "Barres de toit", "Chargeur rapide 7kW", "Kit de protection sol").
   - Dynamic price update based on selected options.
4. **Pre-order Trigger Button**: Prominent "Précommander ce véhicule" button that opens the Pre-order Modal or scrolls to the booking form.

---

#### D. FORMULAIRE DE PRÉCOMMANDE (BOOKING SYSTEM)
1. **Order Summary Card**:
   - Thumbnail + Selected Vehicle Model + Chosen Options + Estimated Total Price.
2. **Client Information Inputs**:
   - Nom complet (Full Name)
   - Téléphone / WhatsApp (with country code selector, default Benin +229)
   - Adresse e-mail
   - Ville / Localisation (ex: Cotonou, Calavi, Parakou...)
   - Message / Notes spécifiques.
3. **Form Actions & Flow**:
   - On submit, trigger a clean confirmation step/modal showing:
     - Notification that the request was logged.
     - **Direct Action Button 1**: "Finaliser sur WhatsApp" (Generates a pre-filled WhatsApp message URL containing order details, name, vehicle model, selected options, and contact number).
     - **Direct Action Button 2**: "Télécharger le Récapitulatif PDF / Fiche".

---

#### E. MODULE DE TRACKING DE CONTENEUR MARITIME (CONTAINER TRACKING)
1. **Search Input Bar**: Large input field asking for "Numéro de conteneur ou Code de suivi" (e.g., `CONT-2026-X99`).
2. **Tracking Status Dashboard View (Results View)**:
   - Interactive Progress Timeline / Stepper:
     1. Commande confirmée / En attente d'embarquement
     2. Chargé dans le conteneur & Chargement au port (Chine)
     3. En transit maritime
     4. Arrivé au Port de Cotonou / Dédouanement
     5. Prêt pour livraison / Réceptionné
   - Ship & Container Details Card:
     - Numéro de Conteneur
     - Nom du Navire / Compagnie Maritime
     - Port de Départ (Chine) & Port d'Arrivée (Cotonou)
     - Date estimée d'arrivée (ETA).
   - Empty State: Friendly error message if container code is not found, with a button to contact support via WhatsApp.

---

### ⚙️ 4. UX, INTERACTION & MOCK DATA
- Include dummy JSON mock data for Chinese vehicle brands (BYD, CHANGAN, GAC, Jetour, Chery) and mock tracking codes (e.g. test with code `TRACK123`) so all interfaces can be tested immediately.
- Clean animations using Framer Motion / Lucide icons (Logistics icons, Car icons, Checkmarks, WhatsApp icon).
- Toast notifications on form submission.
- Footer with contact details (`mindsanni@gmail.com`, Calavi / Abomey-Calavi, Bénin), quick links, and legal mentions.

je veux des donnees fictives.
Et inspire toi aussi du site https://easycar.africa/

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://thekey-group.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/97d002be-c4eb-4866-9ff8-ebefd61fd66b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
