/* ==========================================================
   SCRIPT DU SITE MEMORA
   Ce fichier gère les INTERACTIONS (clics, filtres, formulaire).
   Chaque partie vérifie que l'élément existe avant de s'en servir,
   car toutes les pages n'ont pas les mêmes éléments.
   ========================================================== */

// ---------- Bouton du menu mobile (☰) ----------
// 1. ضع رابط مشروعك ومفتاحك هنا
const supabaseUrl = 'https://vhvuzgavnoijbtmqbxvff.supabase.co';
const supabaseKey = 'vhvuzgavnojbtmqbxvffsb_publishable_qmzCM_KAhM1lJcFdQii7Xw_kzU9R...'; // ضع مفتاحك الكامل هنا (Publishable key)

// 2. قم بإنشاء الاتصال بقاعدة البيانات
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// مثال للاختبار: هل تم الاتصال بنجاح؟
console.log("Supabase connecté avec succès :", supabase);
var boutonMenu = document.getElementById("bouton-menu");
var menu = document.getElementById("menu");

if (boutonMenu && menu) {
  boutonMenu.addEventListener("click", function () {
    // Ajoute ou retire la classe "ouvert" : le CSS affiche ou cache le menu
    menu.classList.toggle("ouvert");
  });
}

// ---------- Filtre de produits (page produits.html) ----------
var boutonsFiltre = document.querySelectorAll(".filtre");
var cartes = document.querySelectorAll(".rangee");

boutonsFiltre.forEach(function (bouton) {
  bouton.addEventListener("click", function () {
    var choix = bouton.getAttribute("data-filtre"); // ex. "coffret", "robe"

    // Met en évidence le bouton cliqué
    boutonsFiltre.forEach(function (b) { b.classList.remove("actif"); });
    bouton.classList.add("actif");

    // Montre ou cache chaque carte selon sa catégorie
    cartes.forEach(function (carte) {
      var categorie = carte.getAttribute("data-categorie");
      if (choix === "tous" || choix === categorie) {
        carte.style.display = "";   // revient à l'affichage normal du CSS
      } else {
        carte.style.display = "none";
      }
    });
  });
});

// ---------- Boutons afficher / masquer (produit-vedette.html) ----------
var boutonsInfo = document.querySelectorAll(".bouton-info");

boutonsInfo.forEach(function (bouton) {
  bouton.addEventListener("click", function () {
    var zone = document.getElementById(bouton.getAttribute("data-cible"));
    if (zone) { zone.classList.toggle("visible"); }
  });
});

// ---------- Validation du formulaire (contact.html) ----------
// Le formulaire est VISUEL : il n'envoie rien (pas de serveur).
var formulaire = document.getElementById("formulaire-contact");

if (formulaire) {
  formulaire.addEventListener("submit", function (evenement) {
    evenement.preventDefault(); // empêche l'envoi réel de la page

    var nom = document.getElementById("nom").value.trim();
    var email = document.getElementById("email").value.trim();
    var message = document.getElementById("message").value.trim();
    var ok = document.getElementById("message-ok");
    var erreur = document.getElementById("message-erreur");

    ok.style.display = "none";
    erreur.style.display = "none";

    if (nom === "" || email === "" || message === "" || email.indexOf("@") === -1) {
      erreur.style.display = "block";
    } else {
      ok.style.display = "block";
      formulaire.reset();
    }
  });
}

// ---------- Catalogue : cartes créées à partir de donnees.js ----------
// Les données (produits, catégories) viennent de donnees.js : on ne les recopie pas ici.
// Ce bloc est placé AVANT le chargement des photos pour que les photos s'appliquent aussi aux cartes créées ici.

// Carte d'un produit (image, nom, description, prix, boutons)
function creerCarteProduit(p) {
  var carte = document.createElement("div");
  carte.className = "carte carte-produit";
  var prix = (p.prix === null) ? "Prix : sur devis" : "Prix : " + formaterPrix(p.prix) + (CONFIG.prixDemonstration ? " (démonstration)" : "");
  var boutonPanier = (p.prix === null)
    ? '<a class="bouton clair" href="contact.html">Demander un devis</a>'
    : '<button type="button" class="bouton clair" data-ajouter="' + p.id + '">Ajouter au panier</button>';
  carte.innerHTML =
    '<div class="visuel" data-photos="' + p.photo + '" data-alt="' + p.nom + ' Memora">' + p.emoji + '</div>' +
    '<div class="contenu"><span class="etiquette">' + nomCategorie(p.categorie) + '</span>' +
    '<h3>' + p.nom + '</h3><p>' + p.description + '</p><p class="prix">' + prix + '</p>' +
    '<div class="boutons"><a class="bouton" href="' + p.page + '">Voir le produit</a>' + boutonPanier + '</div></div>';
  return carte;
}

// Carte d'une catégorie (image, titre, description, lien)
function creerCarteCategorie(c) {
  var carte = document.createElement("div");
  carte.className = "carte carte-produit";
  carte.innerHTML =
    '<div class="visuel" data-photos="' + c.photo + '" data-alt="' + c.nom + ' Memora">' + c.emoji + '</div>' +
    '<div class="contenu"><h3>' + c.nom + '</h3><p>' + c.description + '</p>' +
    '<div class="boutons"><a class="bouton" href="' + c.page + '">Découvrir</a></div></div>';
  return carte;
}

function nomCategorie(id) {
  for (var i = 0; i < CATEGORIES.length; i++) {
    if (CATEGORIES[i].id === id) { return CATEGORIES[i].nom; }
  }
  return "";
}

// Grille de toutes les catégories (accueil et page produits)
document.querySelectorAll('[data-rendu="categories"]').forEach(function (zone) {
  CATEGORIES.forEach(function (c) { zone.appendChild(creerCarteCategorie(c)); });
});

// Grille des produits d'une seule catégorie (pages coffrets, robes, accessoires)
document.querySelectorAll('[data-rendu="produits-categorie"]').forEach(function (zone) {
  var id = zone.getAttribute("data-categorie");
  var produits = PRODUITS.filter(function (p) { return p.categorie === id; });
  if (produits.length === 0) {
    zone.className = "";
    zone.innerHTML = '<div class="vide"><p>Aucun produit n\'est encore disponible dans cette catégorie. Les modèles arrivent bientôt !</p>' +
      '<a class="bouton" href="contact.html">Nous contacter</a></div>';
    return;
  }
  produits.forEach(function (p) { zone.appendChild(creerCarteProduit(p)); });
});

// Section « Découvrez aussi » : les autres catégories
document.querySelectorAll('[data-rendu="decouvrez-aussi"]').forEach(function (zone) {
  var actuelle = zone.getAttribute("data-actuelle");
  CATEGORIES.filter(function (c) { return c.id !== actuelle; })
    .forEach(function (c) { zone.appendChild(creerCarteCategorie(c)); });
});

// ---------- Photos réelles des produits ----------
// Pour chaque cadre qui a un attribut data-photos="nom", le site cherche
// dans images/ les fichiers nom-1, nom-2, nom-3, nom-4 (.jpg, .jpeg, .png ou .webp).
// S'il n'en trouve aucun, le symbole (emoji) reste affiché : rien ne casse.
var EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function trouverPhoto(nom, indexExt, quandFini) {
  if (indexExt >= EXTENSIONS.length) { quandFini(null); return; }
  var adresse = "images/" + nom + EXTENSIONS[indexExt];
  var test = new Image();
  test.onload = function () { quandFini(adresse); };
  test.onerror = function () { trouverPhoto(nom, indexExt + 1, quandFini); };
  test.src = adresse;
}

function chargerPhotos(racine) {
 racine.querySelectorAll("[data-photos]:not([data-charge])").forEach(function (cadre) {
  cadre.setAttribute("data-charge", "1");   // évite de charger deux fois le même cadre
  var base = cadre.getAttribute("data-photos");
  var texteAlt = cadre.getAttribute("data-alt") || "Photo Memora";
  var trouvees = [];
  var restantes = 4;

  for (var n = 1; n <= 4; n++) {
    (function (numero) {
      trouverPhoto(base + "-" + numero, 0, function (adresse) {
        if (adresse) { trouvees.push({ numero: numero, adresse: adresse }); }
        restantes--;
        if (restantes === 0) { afficherPhotos(cadre, trouvees, texteAlt); }
      });
    })(n);
  }
 });
}
chargerPhotos(document);

function afficherPhotos(cadre, photos, texteAlt) {
  if (photos.length === 0) { return; }
  photos.sort(function (a, b) { return a.numero - b.numero; });

  cadre.textContent = "";                 // enlève le symbole
  cadre.classList.add("avec-photo");

  var grande = document.createElement("img");
  grande.className = "principale";
  grande.src = photos[0].adresse;
  grande.alt = texteAlt + " – photo 1";
  cadre.appendChild(grande);

  if (photos.length > 1) {                // petites images cliquables
    var bande = document.createElement("div");
    bande.className = "miniatures";
    photos.forEach(function (photo, i) {
      var mini = document.createElement("img");
      mini.src = photo.adresse;
      mini.alt = texteAlt + " – photo " + (i + 1);
      if (i === 0) { mini.className = "choisie"; }
      mini.addEventListener("click", function () {
        grande.src = photo.adresse;
        grande.alt = mini.alt;
        bande.querySelectorAll("img").forEach(function (m) { m.classList.remove("choisie"); });
        mini.className = "choisie";
      });
      bande.appendChild(mini);
    });
    cadre.appendChild(bande);
  }
}

// ---------- Avis clients : livre d'or (page produits.html) ----------
// Les avis sont gardés dans le navigateur (localStorage), sans serveur.
var formulaireAvis = document.getElementById("formulaire-avis");

if (formulaireAvis) {
  var noteChoisie = 0;
  var boutonsCoeurs = document.querySelectorAll("#coeurs-note button");
  var listeAvis = document.getElementById("liste-avis");
  var zoneMoyenne = document.getElementById("note-moyenne");

  function lireAvis() {
    try { return JSON.parse(localStorage.getItem("memora-avis")) || []; }
    catch (e) { return []; }
  }
  function sauverAvis(liste) {
    try { localStorage.setItem("memora-avis", JSON.stringify(liste)); } catch (e) {}
  }
  function coeurs(note) {
    var texte = "";
    for (var i = 1; i <= 5; i++) { texte += i <= note ? "♥" : "♡"; }
    return texte;
  }

  // Colore les cœurs jusqu'à la note choisie
  function colorerCoeurs(note) {
    boutonsCoeurs.forEach(function (b) {
      b.textContent = Number(b.getAttribute("data-note")) <= note ? "♥" : "♡";
    });
  }
  boutonsCoeurs.forEach(function (b) {
    b.addEventListener("click", function () {
      noteChoisie = Number(b.getAttribute("data-note"));
      colorerCoeurs(noteChoisie);
    });
  });

  function afficherAvis() {
    var avis = lireAvis();
    listeAvis.textContent = "";

    if (avis.length === 0) {
      zoneMoyenne.textContent = "";
      var vide = document.createElement("div");
      vide.className = "vide";
      vide.textContent = "Aucun avis pour le moment. Sois la première personne à raconter ton histoire ♥";
      listeAvis.appendChild(vide);
      return;
    }

    var somme = 0;
    avis.forEach(function (a) { somme += a.note; });
    zoneMoyenne.textContent = "♥ " + (somme / avis.length).toFixed(1).replace(".", ",") + " / 5 – " + avis.length + " avis";

    avis.slice().reverse().forEach(function (a) {   // le plus récent en premier
      var bloc = document.createElement("div");
      bloc.className = "avis";
      var c = document.createElement("div");
      c.className = "coeurs";
      c.textContent = coeurs(a.note);
      var qui = document.createElement("p");
      qui.className = "qui";
      qui.textContent = a.nom + " – " + a.produit + " – " + a.date;
      var texte = document.createElement("p");
      texte.textContent = a.texte;                  // textContent = pas de code injecté
      bloc.appendChild(c);
      bloc.appendChild(qui);
      bloc.appendChild(texte);
      listeAvis.appendChild(bloc);
    });
  }

  formulaireAvis.addEventListener("submit", function (evenement) {
    evenement.preventDefault();
    var nom = document.getElementById("avis-nom").value.trim();
    var texte = document.getElementById("avis-texte").value.trim();
    var produit = document.getElementById("avis-categorie").value;
    var ok = document.getElementById("avis-ok");
    var erreur = document.getElementById("avis-erreur");
    ok.style.display = "none";
    erreur.style.display = "none";

    if (nom === "" || texte === "" || noteChoisie === 0) {
      erreur.style.display = "block";
      return;
    }
    var avis = lireAvis();
    avis.push({
      nom: nom, produit: produit, note: noteChoisie, texte: texte,
      date: new Date().toLocaleDateString("fr-FR")
    });
    sauverAvis(avis);
    formulaireAvis.reset();
    noteChoisie = 0;
    colorerCoeurs(0);
    ok.style.display = "block";
    afficherAvis();
  });

  afficherAvis();
}

// ---------- Chat : Mémo, l'assistant Memora ----------
// Ce n'est pas une vraie intelligence artificielle : Mémo répond avec des
// réponses écrites à l'avance, à partir des informations du projet.
// Il apparaît sur toutes les pages (créé ici, donc rien à copier dans le HTML).
(function () {
  var bouton = document.createElement("button");
  bouton.id = "chat-bouton";
  bouton.textContent = "💬 Mémo";
  bouton.setAttribute("aria-label", "Ouvrir le chat avec Mémo");

  var fenetre = document.createElement("div");
  fenetre.id = "chat-fenetre";
  fenetre.innerHTML =
    '<div class="chat-entete"><strong>Mémo 🎀</strong><span>Assistant automatique de Memora</span></div>' +
    '<div id="chat-messages"></div>' +
    '<form id="chat-form"><input type="text" id="chat-saisie" placeholder="Écris ta question..." autocomplete="off">' +
    '<button type="submit">Envoyer</button></form>';

  document.body.appendChild(bouton);
  document.body.appendChild(fenetre);

  var zone = document.getElementById("chat-messages");
  var saisie = document.getElementById("chat-saisie");
  var dejaOuvert = false;

  // Ajoute une bulle de message (html = true uniquement pour NOS textes)
  function bulle(texte, qui, html) {
    var b = document.createElement("div");
    b.className = "bulle " + qui;
    if (html) { b.innerHTML = texte; } else { b.textContent = texte; }
    zone.appendChild(b);
    zone.scrollTop = zone.scrollHeight;
  }

  // Ajoute des boutons de réponse rapide
  function choix(liste) {
    var conteneur = document.createElement("div");
    conteneur.className = "reponses-rapides";
    liste.forEach(function (element) {
      var b = document.createElement("button");
      b.textContent = element;
      b.addEventListener("click", function () {
        conteneur.remove();
        envoyer(element);
      });
      conteneur.appendChild(b);
    });
    zone.appendChild(conteneur);
    zone.scrollTop = zone.scrollHeight;
  }

  var MENU = ["🎁 Trouver mon coffret", "🎨 Personnalisation", "🚚 Livraison", "💬 Commander", "🏢 Entreprises"];
  var OCCASIONS = ["Anniversaire", "Réussite / diplôme", "Couple / mariage", "Fête", "Entreprise"];
  var BUDGETS = ["Petit budget", "Budget moyen", "Budget plus élevé"];
  var occasion = null;       // mémorise l'occasion pendant le "trouve mon coffret"

  function nettoyer(texte) {
    return texte.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function contient(texte, mots) {
    return mots.some(function (mot) { return texte.indexOf(mot) !== -1; });
  }

  function repondre(message) {
    var t = nettoyer(message);

    // --- Étape "budget" du jeu "trouver mon coffret" ---
    if (occasion && contient(t, ["budget"])) {
      var conseil = contient(t, ["petit"])
        ? "avec quelques articles bien choisis"
        : contient(t, ["moyen"]) ? "avec un bon équilibre d'articles" : "avec un contenu plus riche et un emballage soigné";
      bulle("Pour ton budget, on peut composer un coffret " + conseil + ". Les prix affichés sur le site sont des prix de démonstration : l'équipe confirmera le tarif exact. Tu peux aussi <a href='produits.html'>ajouter un coffret au panier</a> ♥", "bot", true);
      occasion = null;
      choix(MENU);
      return;
    }

    // --- Étape "occasion" ---
    if (contient(t, ["trouver", "idee", "conseil", "offrir", "choisir"])) {
      bulle("Avec plaisir ! Pour quelle occasion cherches-tu un cadeau ?", "bot");
      choix(OCCASIONS);
      return;
    }
    if (contient(t, ["anniversaire", "reussite", "diplome", "couple", "mariage", "fete", "amoureux"])) {
      var lien = "<a href='produit-vedette.html'>le coffret personnalisé</a>";
      var nom = "un coffret anniversaire";
      if (contient(t, ["reussite", "diplome"])) { nom = "un coffret réussite et diplôme"; }
      if (contient(t, ["couple", "mariage", "amoureux", "fete"])) { nom = "un coffret couples et fêtes"; }
      occasion = nom;
      bulle("Je te conseille " + nom + " ! Découvre " + lien + " ou <a href='produits.html'>nos produits</a>. Quel est ton budget ?", "bot", true);
      choix(BUDGETS);
      return;
    }

    // --- Questions fréquentes ---
    if (contient(t, ["personnalis", "nom", "photo", "message", "emballage"])) {
      bulle("Tu peux personnaliser ton coffret avec un nom, un message, une photo et l'emballage. Regarde la page <a href='produit-vedette.html'>Coffret personnalisé</a> 🎨", "bot", true);
    } else if (contient(t, ["livraison", "livrer", "recevoir", "suivi"])) {
      bulle("Memora livre à domicile ou directement chez le destinataire, avec un suivi de commande jusqu'à la livraison. Les délais et les tarifs de livraison seront confirmés par l'équipe 🚚", "bot");
    } else if (contient(t, ["prix", "tarif", "cout", "combien", "devis"])) {
      bulle("Les prix affichés sont des prix de démonstration et dépendent du coffret. Pour un devis (entreprises, demande particulière), écris-nous sur la page <a href='contact.html'>Contact</a> ♥", "bot", true);
    } else if (contient(t, ["commande", "commander", "acheter", "paiement", "payer"])) {
      bulle("Ajoute un coffret au <a href='panier.html'>panier</a> puis passe à la commande (compte de démonstration, aucun paiement réel). Tu peux aussi nous écrire via la page <a href='contact.html'>Contact</a> 💬", "bot", true);
    } else if (contient(t, ["entreprise", "employe", "partenaire", "societe"])) {
      bulle("Memora propose des cadeaux pour les employés ou les partenaires des entreprises, sur devis. Écris-nous via la page <a href='contact.html'>Contact</a> 🏢", "bot", true);
    } else if (contient(t, ["robe"])) {
      bulle("Une collection de robes est prévue pour célébrer les occasions. Les modèles arrivent bientôt : consulte <a href='produits.html'>la page produits</a> 👗", "bot", true);
    } else if (contient(t, ["accessoire"])) {
      bulle("Des accessoires sont prévus pour compléter un cadeau. Les modèles arrivent bientôt 👜", "bot");
    } else if (contient(t, ["contact", "telephone", "whatsapp", "instagram", "tiktok", "facebook", "mail", "adresse", "horaire"])) {
      bulle("Tu peux nous joindre via la page <a href='contact.html'>Contact</a> ou sur Instagram, TikTok, WhatsApp et Facebook 📞", "bot", true);
    } else if (contient(t, ["avis", "temoignage"])) {
      bulle("Les avis sont dans le livre d'or en bas de la page <a href='produits.html#avis'>Produits</a>. Tu peux y laisser le tien ♥", "bot", true);
    } else if (contient(t, ["bonjour", "salut", "coucou", "hello", "bonsoir"])) {
      bulle("Coucou ! Je suis Mémo 🎀 Comment puis-je t'aider ?", "bot");
    } else if (contient(t, ["merci"])) {
      bulle("Avec plaisir ! Chaque cadeau raconte une histoire ♥", "bot");
    } else {
      bulle("Je ne suis pas sûr de bien comprendre. Voici ce que je sais faire :", "bot");
    }
    choix(MENU);
  }

  function envoyer(texte) {
    bulle(texte, "moi");
    repondre(texte);
  }

  // Ouvrir / fermer la fenêtre
  bouton.addEventListener("click", function () {
    fenetre.classList.toggle("ouvert");
    if (fenetre.classList.contains("ouvert")) {
      if (!dejaOuvert) {
        dejaOuvert = true;
        bulle("Coucou, je suis Mémo, l'assistant de Memora 🎀 Je suis un robot : je réponds aux questions simples. Comment puis-je t'aider ?", "bot");
        choix(MENU);
      }
      saisie.focus();
    }
  });

  document.getElementById("chat-form").addEventListener("submit", function (evenement) {
    evenement.preventDefault();
    var texte = saisie.value.trim();
    if (texte === "") { return; }
    saisie.value = "";
    envoyer(texte);
  });
})();

// ============================================================
// E-COMMERCE : PROTOTYPE DE DÉMONSTRATION (TOUT EST SIMULÉ)
// - L'authentification est simulée : pas de vrai serveur.
// - La vérification e-mail est simulée : aucun e-mail n'est envoyé.
// - Les sessions locales (localStorage) ne sont PAS sécurisées.
// - Les commandes sont gardées uniquement pour la démonstration.
// - Le paiement est fictif : aucun traitement bancaire réel.
// Pour un vrai site, il faudrait : authentification sécurisée, base de
// données, backend, mots de passe hachés côté serveur, sessions protégées,
// vraie vérification e-mail, paiement certifié et contrôles côté serveur.
// ============================================================

var EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var PAGES_RETOUR = ["checkout.html", "compte.html", "panier.html"];   // pages autorisées après connexion

// ---------- Outils de base ----------
function aller(adresse) { window.location.href = adresse; }

function lireJSON(cle, defaut) {
  try {
    var valeur = JSON.parse(localStorage.getItem(cle));
    return valeur === null ? defaut : valeur;
  } catch (e) { return defaut; }
}
function ecrireJSON(cle, valeur) {
  try { localStorage.setItem(cle, JSON.stringify(valeur)); } catch (e) {}
}

function formaterPrix(montant) {
  return montant.toFixed(2).replace(".", ",") + " " + CONFIG.devise;
}
function trouverProduit(id) {
  for (var i = 0; i < PRODUITS.length; i++) {
    if (PRODUITS[i].id === id) { return PRODUITS[i]; }
  }
  return null;
}
function valeurChamp(id) {
  var champ = document.getElementById(id);
  return champ ? champ.value.trim() : "";
}
function afficherErreurs(idZone, liste) {
  var zone = document.getElementById(idZone);
  if (!zone) { return; }
  zone.textContent = "";
  if (liste.length === 0) { zone.style.display = "none"; return; }
  var ul = document.createElement("ul");
  ul.className = "liste-erreurs";
  liste.forEach(function (texte) {
    var li = document.createElement("li");
    li.textContent = texte;
    ul.appendChild(li);
  });
  zone.appendChild(ul);
  zone.style.display = "block";
}

// Petit message « Ajouté au panier »
function afficherMessage(texte) {
  var toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = texte;
  toast.style.display = "block";
  setTimeout(function () { toast.style.display = "none"; }, 1800);
}

// ---------- Panier (enregistré dans le navigateur) ----------
function getCart() { return lireJSON("memora_cart", []); }

function saveCart(panier) {
  ecrireJSON("memora_cart", panier);
  updateCartCount();
}

function addToCart(id) {
  var produit = trouverProduit(id);
  if (!produit || produit.prix === null) { return false; }   // pas de prix = pas de panier
  var panier = getCart();
  var ligne = panier.filter(function (l) { return l.id === id; })[0];
  if (ligne) { ligne.quantite += 1; }               // déjà dans le panier : on augmente la quantité
  else { panier.push({ id: id, quantite: 1 }); }
  saveCart(panier);
  return true;
}

function removeFromCart(id) {
  saveCart(getCart().filter(function (l) { return l.id !== id; }));
}

function changeQuantity(id, changement) {
  var panier = getCart();
  panier.forEach(function (l) { if (l.id === id) { l.quantite += changement; } });
  saveCart(panier.filter(function (l) { return l.quantite > 0; }));
}

function updateCartCount() {
  var total = 0;
  getCart().forEach(function (l) { total += l.quantite; });
  document.querySelectorAll("#compteur-panier").forEach(function (pastille) {
    pastille.textContent = total;
    pastille.setAttribute("aria-label", total + " article(s) dans le panier");
  });
}

// Calcul des totaux : toujours refait à partir du catalogue (donnees.js)
function calculateCartTotal() {
  var lignes = [];
  var nbArticles = 0;
  var sousTotal = 0;
  getCart().forEach(function (l) {
    var produit = trouverProduit(l.id);
    if (!produit || produit.prix === null || l.quantite < 1) { return; }
    var sousTotalLigne = produit.prix * l.quantite;
    lignes.push({ produit: produit, quantite: l.quantite, sousTotal: sousTotalLigne });
    nbArticles += l.quantite;
    sousTotal += sousTotalLigne;
  });
  var livraison = (sousTotal === 0 || sousTotal >= CONFIG.seuilLivraisonGratuite) ? 0 : CONFIG.fraisLivraison;
  return { lignes: lignes, nbArticles: nbArticles, sousTotal: sousTotal, livraison: livraison, total: sousTotal + livraison };
}

function texteLivraison() {
  return "Livraison : " + formaterPrix(CONFIG.fraisLivraison) + ", offerte à partir de " + formaterPrix(CONFIG.seuilLivraisonGratuite) + " d'achats.";
}

// ---------- Comptes simulés ----------
// ATTENTION : on ne stocke JAMAIS le mot de passe tel quel, seulement une
// empreinte de démonstration très simple (PAS sécurisée). Utilise un mot de
// passe FICTIF, par exemple demo1234.
function hashDemo(texte) {
  var h = 5381;
  var melange = "memora-demo:" + texte;
  for (var i = 0; i < melange.length; i++) { h = ((h * 33) ^ melange.charCodeAt(i)) >>> 0; }
  return "demo-" + h.toString(16);
}
function getUsers() { return lireJSON("memora_users", []); }
function saveUsers(liste) { ecrireJSON("memora_users", liste); }

function getCurrentUser() {
  var email = lireJSON("memora_current_user", null);
  if (!email) { return null; }
  var trouves = getUsers().filter(function (u) { return u.email === email; });
  return trouves.length ? trouves[0] : null;
}

function logout() {
  try { localStorage.removeItem("memora_current_user"); } catch (e) {}
  aller("index.html");
}

function getOrders() { return lireJSON("memora_orders", []); }

// Page où revenir après la connexion (ex. connexion.html?retour=checkout.html)
function pageRetour() {
  var demande = new URLSearchParams(window.location.search).get("retour");
  return PAGES_RETOUR.indexOf(demande) !== -1 ? demande : null;
}

// Protection SIMULÉE des pages (compte, commande) :
// ce n'est PAS une vraie sécurité, n'importe qui peut la contourner.
var pageProtegee = document.body.getAttribute("data-protege");
if (pageProtegee && !getCurrentUser()) {
  aller("connexion.html?retour=" + pageProtegee);
}

// ---------- Inscription ----------
var formInscription = document.getElementById("formulaire-inscription");
if (formInscription) {
  formInscription.addEventListener("submit", function (evenement) {
    evenement.preventDefault();
    var prenom = valeurChamp("ins-prenom");
    var nom = valeurChamp("ins-nom");
    var email = valeurChamp("ins-email").toLowerCase();
    var mdp = document.getElementById("ins-mdp").value;
    var mdp2 = document.getElementById("ins-mdp2").value;
    var accepte = document.getElementById("ins-cgu").checked;
    var erreurs = [];

    if (!prenom || !nom || !email || !mdp || !mdp2) { erreurs.push("Tous les champs sont obligatoires."); }
    if (email && !EMAIL_OK.test(email)) { erreurs.push("L'adresse e-mail n'est pas valide."); }
    if (mdp && mdp.length < 6) { erreurs.push("Le mot de passe fictif doit contenir au moins 6 caractères."); }
    if (mdp && mdp2 && mdp !== mdp2) { erreurs.push("Les deux mots de passe ne sont pas identiques."); }
    if (!accepte) { erreurs.push("Tu dois accepter les conditions de la démonstration."); }
    if (email && getUsers().some(function (u) { return u.email === email; })) {
      erreurs.push("Un compte existe déjà avec cette adresse e-mail.");
    }
    afficherErreurs("erreurs-inscription", erreurs);
    if (erreurs.length) { return; }

    var utilisateurs = getUsers();
    utilisateurs.push({ prenom: prenom, nom: nom, email: email, empreinte: hashDemo(mdp), verifie: false });
    saveUsers(utilisateurs);
    try { sessionStorage.setItem("memora_attente_verification", email); } catch (e) {}
    aller("verification.html");
  });
}

// ---------- Vérification e-mail SIMULÉE ----------
var formVerification = document.getElementById("formulaire-verification");
if (formVerification) {
  document.getElementById("code-demo").textContent = CONFIG.codeVerification;
  var emailAttente = null;
  try { emailAttente = sessionStorage.getItem("memora_attente_verification"); } catch (e) {}
  if (!emailAttente) {
    afficherErreurs("erreurs-verification", ["Aucun compte n'attend de vérification. Crée d'abord un compte."]);
  }
  formVerification.addEventListener("submit", function (evenement) {
    evenement.preventDefault();
    if (!emailAttente) { return; }
    if (valeurChamp("code-saisi") !== CONFIG.codeVerification) {
      afficherErreurs("erreurs-verification", ["Le code est incorrect. Utilise le code de démonstration affiché sur cette page."]);
      return;
    }
    var utilisateurs = getUsers();
    utilisateurs.forEach(function (u) { if (u.email === emailAttente) { u.verifie = true; } });
    saveUsers(utilisateurs);
    try { sessionStorage.removeItem("memora_attente_verification"); } catch (e) {}
    aller("connexion.html?verifie=1");
  });
}

// ---------- Connexion ----------
var formConnexion = document.getElementById("formulaire-connexion");
if (formConnexion) {
  if (new URLSearchParams(window.location.search).get("verifie") === "1") {
    document.getElementById("message-verifie").style.display = "block";
  }
  document.getElementById("lien-oubli").addEventListener("click", function (evenement) {
    evenement.preventDefault();
    document.getElementById("message-oubli").style.display = "block";
  });
  formConnexion.addEventListener("submit", function (evenement) {
    evenement.preventDefault();
    var email = valeurChamp("con-email").toLowerCase();
    var mdp = document.getElementById("con-mdp").value;
    var trouves = getUsers().filter(function (u) { return u.email === email; });
    var utilisateur = trouves.length ? trouves[0] : null;

    if (!utilisateur || utilisateur.empreinte !== hashDemo(mdp)) {
      afficherErreurs("erreurs-connexion", ["E-mail ou mot de passe incorrect."]);
      return;
    }
    if (!utilisateur.verifie) {
      try { sessionStorage.setItem("memora_attente_verification", email); } catch (e) {}
      afficherErreurs("erreurs-connexion", ["Ce compte n'est pas encore vérifié. Termine d'abord la vérification simulée (page « Vérification »)."]);
      document.getElementById("lien-verification").style.display = "inline";
      return;
    }
    ecrireJSON("memora_current_user", utilisateur.email);   // session simulée
    aller(pageRetour() || "compte.html");
  });
}

// ---------- Espace utilisateur ----------
var zoneCompte = document.getElementById("infos-compte");
if (zoneCompte && getCurrentUser()) {
  var moi = getCurrentUser();
  document.getElementById("bonjour").textContent = "Bonjour, " + moi.prenom;
  document.getElementById("info-prenom").textContent = moi.prenom;
  document.getElementById("info-nom").textContent = moi.nom;
  document.getElementById("info-email").textContent = moi.email;
  document.getElementById("info-verifie").textContent = moi.verifie ? "Compte vérifié (simulation)" : "Non vérifié";

  var mesCommandes = getOrders().filter(function (c) { return c.utilisateur === moi.email; });
  var corps = document.getElementById("corps-commandes");
  if (mesCommandes.length === 0) {
    document.getElementById("aucune-commande").style.display = "block";
    document.getElementById("tableau-commandes").style.display = "none";
  } else {
    mesCommandes.slice().reverse().forEach(function (c) {
      var ligne = document.createElement("tr");
      [c.reference, c.date, formaterPrix(c.total), String(c.nbArticles), c.statut].forEach(function (texte) {
        var cellule = document.createElement("td");
        cellule.textContent = texte;
        ligne.appendChild(cellule);
      });
      corps.appendChild(ligne);
    });
  }
  document.getElementById("bouton-deconnexion").addEventListener("click", logout);
}

// ---------- Page panier ----------
function afficherPanier() {
  var zone = document.getElementById("contenu-panier");
  if (!zone) { return; }
  var t = calculateCartTotal();
  zone.textContent = "";

  if (t.lignes.length === 0) {
    zone.innerHTML = '<div class="vide"><p>Votre panier est vide.</p><a class="bouton" href="produits.html">Découvrir nos produits</a></div>';
    return;
  }

  var html = '<div class="panier-grille"><div>';
  t.lignes.forEach(function (l) {
    var p = l.produit;
    html += '<div class="ligne-panier">' +
      '<div class="visuel" data-photos="' + p.photo + '" data-alt="' + p.nom + '">' + p.emoji + '</div>' +
      '<div><h3>' + p.nom + '</h3><p>' + nomCategorie(p.categorie) + ' – ' + formaterPrix(p.prix) + '</p>' +
      '<div class="quantite">' +
      '<button type="button" data-action="moins" data-id="' + p.id + '" aria-label="Diminuer la quantité de ' + p.nom + '">−</button>' +
      '<strong>' + l.quantite + '</strong>' +
      '<button type="button" data-action="plus" data-id="' + p.id + '" aria-label="Augmenter la quantité de ' + p.nom + '">+</button>' +
      '<button type="button" class="lien-supprimer" data-action="supprimer" data-id="' + p.id + '">Supprimer</button>' +
      '</div></div>' +
      '<div class="total-ligne"><strong>' + formaterPrix(l.sousTotal) + '</strong></div></div>';
  });
  html += '</div><aside class="resume"><h2 style="font-size:1.3rem;">Résumé</h2>' +
    '<div class="ligne"><span>Sous-total (' + t.nbArticles + ' article(s))</span><span>' + formaterPrix(t.sousTotal) + '</span></div>' +
    '<div class="ligne"><span>Livraison</span><span>' + (t.livraison === 0 ? "Offerte" : formaterPrix(t.livraison)) + '</span></div>' +
    '<div class="ligne total"><span>Total</span><span>' + formaterPrix(t.total) + '</span></div>' +
    '<p class="petit" style="color:var(--texte);">' + texteLivraison() + (CONFIG.prixDemonstration ? ' Prix de démonstration.' : '') + '</p>' +
    '<button type="button" class="bouton" id="bouton-commander" style="width:100%;">Passer à la commande</button></aside></div>';
  zone.innerHTML = html;
  chargerPhotos(zone);

  document.getElementById("bouton-commander").addEventListener("click", function () {
    if (calculateCartTotal().lignes.length === 0) { return; }       // pas de commande avec un panier vide
    aller(getCurrentUser() ? "checkout.html" : "connexion.html?retour=checkout.html");
  });
}

// ---------- Page de commande (checkout) ----------
function afficherResumeCommande() {
  var zone = document.getElementById("resume-commande");
  if (!zone) { return; }
  var t = calculateCartTotal();
  var html = '<h2 style="font-size:1.3rem;">Ma commande</h2>';
  t.lignes.forEach(function (l) {
    html += '<div class="ligne"><span>' + l.produit.nom + ' × ' + l.quantite + '</span><span>' + formaterPrix(l.sousTotal) + '</span></div>';
  });
  html += '<div class="ligne"><span>Sous-total</span><span>' + formaterPrix(t.sousTotal) + '</span></div>' +
    '<div class="ligne"><span>Livraison</span><span>' + (t.livraison === 0 ? "Offerte" : formaterPrix(t.livraison)) + '</span></div>' +
    '<div class="ligne total"><span>Total</span><span>' + formaterPrix(t.total) + '</span></div>';
  zone.innerHTML = html;
}

var formCommande = document.getElementById("formulaire-commande");
var commandeEnCours = false;      // empêche la double validation
if (formCommande && getCurrentUser()) {
  var client = getCurrentUser();
  if (calculateCartTotal().lignes.length === 0) { aller("panier.html"); }

  // On pré-remplit seulement ce que le compte fictif connaît déjà
  document.getElementById("co-prenom").value = client.prenom;
  document.getElementById("co-nom").value = client.nom;
  document.getElementById("co-email").value = client.email;
  document.getElementById("co-pays").value = CONFIG.paysParDefaut;
  document.getElementById("regle-livraison").textContent = texteLivraison();
  afficherResumeCommande();

  formCommande.addEventListener("submit", function (evenement) {
    evenement.preventDefault();
    if (commandeEnCours) { return; }

    var utilisateur = getCurrentUser();
    var t = calculateCartTotal();            // montants recalculés depuis le catalogue
    var erreurs = [];
    if (!utilisateur) { erreurs.push("Ta session simulée a expiré : reconnecte-toi."); }
    if (t.lignes.length === 0) { erreurs.push("Ton panier est vide."); }

    var champs = [
      ["co-prenom", "le prénom"], ["co-nom", "le nom"], ["co-email", "l'e-mail"], ["co-tel", "le téléphone"],
      ["co-adresse", "l'adresse"], ["co-ville", "la ville"], ["co-cp", "le code postal"], ["co-pays", "le pays"]
    ];
    champs.forEach(function (c) { if (!valeurChamp(c[0])) { erreurs.push("Merci de renseigner " + c[1] + "."); } });
    if (valeurChamp("co-email") && !EMAIL_OK.test(valeurChamp("co-email"))) { erreurs.push("L'adresse e-mail n'est pas valide."); }

    var choixPaiement = document.querySelector('input[name="paiement"]:checked');
    if (!choixPaiement) { erreurs.push("Choisis un moyen de paiement simulé."); }

    afficherErreurs("erreurs-commande", erreurs);
    if (erreurs.length) { return; }

    commandeEnCours = true;
    document.getElementById("bouton-payer").disabled = true;

    // Référence unique : MEM-AAAAMMJJ-xxxx
    var maintenant = new Date();
    var jour = maintenant.getFullYear() + ("0" + (maintenant.getMonth() + 1)).slice(-2) + ("0" + maintenant.getDate()).slice(-2);
    var commandes = getOrders();
    var reference;
    do {
      reference = CONFIG.prefixeCommande + "-" + jour + "-" + (1000 + Math.floor(Math.random() * 9000));
    } while (commandes.some(function (c) { return c.reference === reference; }));

    commandes.push({
      reference: reference,
      date: maintenant.toLocaleDateString("fr-FR"),
      utilisateur: utilisateur.email,
      produits: t.lignes.map(function (l) { return { id: l.produit.id, nom: l.produit.nom, prix: l.produit.prix, quantite: l.quantite }; }),
      nbArticles: t.nbArticles,
      sousTotal: t.sousTotal,
      livraison: t.livraison,
      total: t.total,
      adresse: {
        prenom: valeurChamp("co-prenom"), nom: valeurChamp("co-nom"), email: valeurChamp("co-email"),
        telephone: valeurChamp("co-tel"), adresse: valeurChamp("co-adresse"),
        ville: valeurChamp("co-ville"), codePostal: valeurChamp("co-cp"), pays: valeurChamp("co-pays")
      },
      paiement: choixPaiement.value === "carte" ? "Carte bancaire (démonstration)" : "Paiement à la livraison (démonstration)",
      statut: "Commande simulée"
    });
    ecrireJSON("memora_orders", commandes);
    saveCart([]);                                   // on vide le panier
    aller("confirmation.html?ref=" + encodeURIComponent(reference));
  });
}

// ---------- Confirmation de commande ----------
var zoneConfirmation = document.getElementById("detail-confirmation");
if (zoneConfirmation) {
  var refDemandee = new URLSearchParams(window.location.search).get("ref");
  var utilisateurConf = getCurrentUser();
  var commande = getOrders().filter(function (c) {
    return c.reference === refDemandee && utilisateurConf && c.utilisateur === utilisateurConf.email;
  })[0];

  if (!commande) {
    zoneConfirmation.style.display = "block";
    zoneConfirmation.innerHTML = '<div class="vide"><p>Commande introuvable. Connecte-toi pour consulter tes commandes.</p><a class="bouton" href="compte.html">Voir mon compte</a></div>';
  } else {
    document.getElementById("conf-ref").textContent = commande.reference;
    document.getElementById("conf-date").textContent = commande.date;
    document.getElementById("conf-montant").textContent = formaterPrix(commande.total);
    document.getElementById("conf-paiement").textContent = commande.paiement;
    var liste = document.getElementById("conf-produits");
    commande.produits.forEach(function (p) {
      var li = document.createElement("li");
      li.textContent = p.nom + " × " + p.quantite;
      liste.appendChild(li);
    });
    var a = commande.adresse;
    document.getElementById("conf-adresse").textContent =
      a.prenom + " " + a.nom + ", " + a.adresse + ", " + a.codePostal + " " + a.ville + ", " + a.pays;
    zoneConfirmation.style.display = "block";
  }
}

// ---------- Boutons « Ajouter au panier » (toutes les pages) ----------
document.addEventListener("click", function (evenement) {
  var bouton = evenement.target.closest("[data-ajouter]");
  if (bouton) {
    var id = bouton.getAttribute("data-ajouter");
    if (id === "choix-occasion") {                       // page du coffret personnalisé
      id = document.getElementById("choix-coffret").value;
    }
    if (addToCart(id)) { afficherMessage("Ajouté au panier ✓"); }
    return;
  }
  var action = evenement.target.closest("[data-action]");
  if (action) {                                          // boutons +, − et supprimer de la page panier
    var idProduit = action.getAttribute("data-id");
    var type = action.getAttribute("data-action");
    if (type === "plus") { changeQuantity(idProduit, 1); }
    if (type === "moins") { changeQuantity(idProduit, -1); }
    if (type === "supprimer") { removeFromCart(idProduit); }
    afficherPanier();
  }
});

// ---------- Mise en route de la partie boutique ----------
// Prix affichés sur la page produits (lus dans donnees.js)
document.querySelectorAll("[data-prix]").forEach(function (zone) {
  var produit = trouverProduit(zone.getAttribute("data-prix"));
  if (produit && produit.prix !== null) {
    zone.textContent = "Prix : " + formaterPrix(produit.prix) + (CONFIG.prixDemonstration ? " (prix de démonstration)" : "");
  }
});

// Lien « Compte » du menu : adapté si la personne est connectée
var lienCompte = document.getElementById("lien-compte");
if (lienCompte) {
  var utilisateurMenu = getCurrentUser();
  if (utilisateurMenu) {
    lienCompte.href = "compte.html";
    lienCompte.textContent = "👤 " + utilisateurMenu.prenom;
  } else {
    lienCompte.href = "connexion.html";
  }
}

updateCartCount();
afficherPanier();

// ---------- Bouton retour en haut ----------
var boutonHaut = document.getElementById("haut");

if (boutonHaut) {
  window.addEventListener("scroll", function () {
    // Visible seulement quand on a descendu la page de plus de 300 px
    boutonHaut.style.display = window.scrollY > 300 ? "block" : "none";
  });
  boutonHaut.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
