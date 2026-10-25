/* ==========================================================
   DONNÉES DU SITE MEMORA (catalogue + réglages)
   C'est LE SEUL endroit où modifier les produits, les prix
   et les règles de livraison. Toutes les pages les utilisent.
   ========================================================== */

// ---------- Réglages de la boutique ----------
// ATTENTION : les prix et les frais ci-dessous sont des valeurs de
// DÉMONSTRATION pour pouvoir tester le panier. Remplace-les par les vrais.
var CONFIG = {
  devise: "DT",
  fraisLivraison: 7,             // frais de livraison (démonstration)
  seuilLivraisonGratuite: 150,   // livraison offerte à partir de ce montant (démonstration)
  prefixeCommande: "MEM",        // les références ressemblent à MEM-20261025-4821
  codeVerification: "123456",    // code de vérification e-mail SIMULÉE
  paysParDefaut: "Tunisie",
  prixDemonstration: true        // true = on affiche « prix de démonstration » sur le site
};

// ---------- Catégories ----------
// photo = début du nom de la photo dans le dossier images/ (voir images/NOMS-DES-PHOTOS.txt)
var CATEGORIES = [
  {
    id: "coffrets",
    nom: "Coffrets cadeaux",
    page: "coffrets.html",
    emoji: "🎁",
    photo: "categorie-coffrets",
    description: "Des coffrets personnalisables pour chaque occasion : nom, message, photo et emballage au choix."
  },
  {
    id: "robes",
    nom: "Robes",
    page: "robes.html",
    emoji: "👗",
    photo: "robes",
    description: "Des robes pour célébrer chaque occasion en beauté. Les modèles arrivent bientôt."
  },
  {
    id: "accessoires",
    nom: "Accessoires",
    page: "accessoires.html",
    emoji: "👜",
    photo: "accessoires",
    description: "Des accessoires pour compléter un cadeau ou se faire plaisir. Les modèles arrivent bientôt."
  }
];

// ---------- Produits ----------
// prix: null = « sur devis » (ne peut pas être ajouté au panier)
var PRODUITS = [
  {
    id: "coffret-anniversaire",
    categorie: "coffrets",
    nom: "Coffret anniversaire",
    description: "Un coffret personnalisable (nom, message, photo, emballage) pour fêter un anniversaire.",
    prix: 45,
    emoji: "🎂",
    photo: "coffret-anniversaire",
    page: "produit-vedette.html"
  },
  {
    id: "coffret-reussite",
    categorie: "coffrets",
    nom: "Coffret réussite et diplôme",
    description: "Pour célébrer une réussite, un diplôme ou une belle étape de vie.",
    prix: 55,
    emoji: "🎓",
    photo: "coffret-reussite",
    page: "produit-vedette.html"
  },
  {
    id: "coffret-couples",
    categorie: "coffrets",
    nom: "Coffret couples et fêtes",
    description: "Pour les amoureux, les fêtes et les événements spéciaux comme les mariages.",
    prix: 65,
    emoji: "💍",
    photo: "coffret-couples",
    page: "produit-vedette.html"
  },
  {
    id: "coffret-entreprises",
    categorie: "coffrets",
    nom: "Coffret entreprises",
    description: "Des cadeaux pour remercier vos employés ou vos partenaires. Sur devis.",
    prix: null,
    emoji: "🏢",
    photo: "coffret-entreprises",
    page: "contact.html"
  }
  // Les robes et les accessoires seront ajoutés ici quand les modèles existeront :
  // { id: "robe-1", categorie: "robes", nom: "...", description: "...", prix: 0, emoji: "👗", photo: "robes", page: "contact.html" }
];
