export interface CompleteMenu {
  id: string;
  title: string;
  subtitle: string;
  servings: string;
  courses: {
    antipasto: { name: string; detail: string };
    primo: { name: string; detail: string };
    secondo: { name: string; detail: string };
    contorno: { name: string; detail: string };
    dolce: { name: string; detail: string };
  };
  zeroWasteTip: string;
}

export interface RecipeItem {
  id: number;
  title: string;
  prepTime: string;
  difficulty: 'Facile' | 'Media';
  category?: 'uova' | 'legumi' | 'verdure';
  categoryLabel?: string;
  ingredients: string[];
  steps: string[];
  zeroWasteNote: string;
}

export interface KidsRecipe {
  id: number;
  title: string;
  ageNote: string;
  duration: string;
  ingredients: string[];
  steps: string[];
  funFact: string;
}

export const COMPLETE_MENUS: CompleteMenu[] = [
  {
    id: 'menu-1',
    title: 'Menù 1 — Il Classico della Domenica',
    subtitle: 'Caldo, avvolgente e profumato al rosmarino e alloro',
    servings: '2 persone · Zero sprechi',
    courses: {
      antipasto: {
        name: 'Pinzimonio croccante di sedano',
        detail: 'Cuori e coste tenere di sedano con olio extravergine, sale fino, pepe nero e una spolverata di foglie di sedano tritate.',
      },
      primo: {
        name: 'Risotto cremoso zucca e rosmarino',
        detail: 'Riso Carnaroli tostato con cipolla dorata, zucca a cubetti e brodo ricavato da bucce e gambi, profumato al rosmarino fresco.',
      },
      secondo: {
        name: 'Frittata alta patate e cipolle',
        detail: 'Uova fresche contadine sbattute con patate tagliate sottili e cipolle stufate lentamente in padella con un filo d’olio.',
      },
      contorno: {
        name: 'Erbette spontanee ripassate',
        detail: 'Erbette dell’orto scottate e ripassate in padella con olio e aglio (o cipollotto), sfruttando anche i gambi più teneri.',
      },
      dolce: {
        name: 'Mele al forno con alloro',
        detail: 'Mele scavate al centro, cotte al forno o in pentola coperta con due foglie di alloro fresco e gherigli di noci/frutta secca.',
      },
    },
    zeroWasteTip:
      'Le bucce della zucca, delle patate e i gambi esterni del sedano diventano subito 1,5 litri di brodo dorato per il risotto.',
  },
  {
    id: 'menu-2',
    title: 'Menù 2 — Rustico e Veloce',
    subtitle: 'Ideale per la settimana, pronto in 35 minuti dalla cassetta',
    servings: '2 persone · Zero sprechi',
    courses: {
      antipasto: {
        name: 'Frittelline croccanti di erbette',
        detail: 'Pastella semplice di acqua, poca farina (o patata schiacciata) ed erbette tritate fini, dorate in padella antiaderente.',
      },
      primo: {
        name: 'Risotto verde alle erbette e aglio',
        detail: 'Crema verde ottenuta frullando le foglie delle erbette con un mestolo di brodo zero-sprechi, mantecata nel Vialone Nano.',
      },
      secondo: {
        name: 'Tortino al forno di broccoli e patate',
        detail: 'Cime e gambi pelati di broccolo cotti con patate a fette sottili, legati con uovo sbattuto e salvia fino a doratura.',
      },
      contorno: {
        name: 'Insalata croccante sedano e mele',
        detail: 'Fettine sottili di mela fresca e sedano a rondelle conditi con olio, sale e pepe per pulire il palato.',
      },
      dolce: {
        name: 'Coppa calda di mele caramellate',
        detail: 'Spicchi di mela saltati in padella con un cucchiaio d’acqua e rosmarino o frutta secca tostata, senza zuccheri aggiunti.',
      },
    },
    zeroWasteTip:
      'Il gambo centrale del broccolo non si butta mai: pelato leggermente e tagliato a dadini diventa dolce e cremoso nel tortino.',
  },
  {
    id: 'menu-3',
    title: 'Menù 3 — Comfort Food Contadino',
    subtitle: 'Sapori sinceri di casa, perfetto per le sere fresche',
    servings: '2 persone · Zero sprechi',
    courses: {
      antipasto: {
        name: 'Cipolle caramellate in padella',
        detail: 'Cipolle affettate finemente e stufate a fuoco dolce con acqua, olio, sale e una foglia di alloro fino a diventare vellutate.',
      },
      primo: {
        name: 'Minestra contadina di riso e verdure',
        detail: 'Zuppa densa con patate, zucca, sedano, broccoli e riso cotto direttamente nel brodo ricco di bucce e gambi aromatici.',
      },
      secondo: {
        name: 'Uova al tegamino su letto di erbette',
        detail: 'Erbette stufate in padella su cui si adagiano le uova fresche cotte dolcemente col coperchio, servite con pepe nero.',
      },
      contorno: {
        name: 'Patate e zucca arrosto alle erbe',
        detail: 'Cubetti di patata con la buccia ben lavata e zucca arrostiti in padella o al forno con rosmarino e salvia.',
      },
      dolce: {
        name: 'Dolce espresso di mele e frutta secca',
        detail: 'Mele grattugiate o a fettine sottili passate al forno con fichi o frutta secca tritata e profumo di salvia o alloro.',
      },
    },
    zeroWasteTip:
      'Se avanza un mestolo di risotto o minestra di riso, conservatelo in frigo: il giorno dopo diventa la base degli Arancini al forno!',
  },
];

export const RICE_RECIPES: RecipeItem[] = [
  {
    id: 1,
    title: 'Risotto zucca e rosmarino',
    prepTime: '25 min',
    difficulty: 'Facile',
    ingredients: [
      '180 g di riso Carnaroli o Vialone Nano',
      '250 g di zucca a cubetti (con buccia per il brodo)',
      '1/2 cipolla dorata tritata',
      '1 rametto di rosmarino fresco',
      '1 litro di brodo zero-sprechi bollente',
      'Olio extravergine d’oliva, sale e pepe q.b.',
    ],
    steps: [
      'Prepara il brodo zero-sprechi facendo bollire 20 minuti le bucce della zucca lavate, i gambi di sedano e una foglia di alloro.',
      'Fai appassire la cipolla tritata con 2 cucchiai d’olio e metà rosmarino in casseruola.',
      'Aggiungi la zucca a cubetti piccoli, sala leggermente e fai insaporire per 4 minuti.',
      'Unisci il riso, tostalo 2 minuti finché diventa lucido e aggiungi il brodo bollente un mestolo alla volta.',
      'A cottura ultimata (circa 16 minuti), spegni il fuoco, manteca energicamente con un filo d’olio a crudo e rosmarino fresco tritato.',
    ],
    zeroWasteNote: 'I semi della zucca lavati e tostati 10 minuti in padella con sale diventano una guarnizione croccante.',
  },
  {
    id: 2,
    title: 'Risotto verde alle erbette',
    prepTime: '25 min',
    difficulty: 'Facile',
    ingredients: [
      '180 g di riso italiano superfino',
      '200 g di erbette spontanee o bietole da taglio',
      '1/2 cipolla o scalogno',
      '1 litro di brodo vegetale zero-sprechi',
      'Olio extravergine, sale e pepe nero',
    ],
    steps: [
      'Lava bene le erbette, separa i gambi dalle foglie e trita finemente i gambi.',
      'Sbollenta le foglie per 2 minuti nel brodo caldo, scolale e frullale con mezzo mestolo di brodo fino a ottenere una crema verde brillante.',
      'Soffriggi la cipolla e i gambi tritati con olio per 4 minuti, poi tosta il riso.',
      'Cuoci aggiungendo il brodo caldo poco alla volta; a 3 minuti dalla fine incorpora la crema verde.',
      'Manteca lontano dal fuoco con olio a crudo e pepe macinato fresco.',
    ],
    zeroWasteNote: 'L’acqua di sbollentatura delle erbette arricchisce direttamente il brodo di cottura del riso.',
  },
  {
    id: 3,
    title: 'Risotto broccoli e cipolla',
    prepTime: '28 min',
    difficulty: 'Facile',
    ingredients: [
      '180 g di riso Carnaroli',
      '1/2 broccolo (cimette + gambo tenero pelato)',
      '1 cipolla media affettata sottile',
      '1 foglia di alloro',
      '1 litro di brodo caldo zero-sprechi',
      'Olio extravergine, sale e pepe',
    ],
    steps: [
      'Taglia il gambo del broccolo a dadini piccolissimi e dividi le cime in piccoli fiorellini.',
      'Fai stufare dolcemente la cipolla con olio, alloro e un goccio d’acqua per 6 minuti finché diventa dolce.',
      'Aggiungi i dadini di gambo e metà cimette di broccolo; lascia ammorbidire con un mestolo di brodo.',
      'Tosta il riso insieme alle verdure, poi porta a cottura aggiungendo brodo caldo e le restanti cimette negli ultimi 6 minuti.',
      'Manteca con olio extravergine e pepe nero per ottenere una crema naturale senza burro.',
    ],
    zeroWasteNote: 'Le foglie esterne del broccolo vanno direttamente nella pentola del brodo zero-sprechi.',
  },
  {
    id: 4,
    title: 'Riso e fagioli all’alloro',
    prepTime: '30 min',
    difficulty: 'Facile',
    ingredients: [
      '160 g di riso Vialone Nano',
      '200 g di fagioli borlotti o cannellini cotti (con la loro acqua)',
      '1 gambo di sedano + 1/2 cipolla',
      '2 foglie di alloro fresco + 1 rametto di rosmarino',
      '800 ml di brodo vegetale zero-sprechi',
      'Olio extravergine, sale e pepe',
    ],
    steps: [
      'Prepara un soffritto profumato con sedano e cipolla tritati finemente, olio, alloro e rosmarino.',
      'Aggiungi metà dei fagioli e schiacciali leggermente con la forchetta per creare cremosità.',
      'Versa il riso, mescola 2 minuti e inizia ad aggiungere il brodo caldo.',
      'A metà cottura unisci i fagioli interi rimasti e porta a cottura morbida tipo “all’onda”.',
      'Servi con un giro generoso di olio extravergine a crudo e pepe macinato.',
    ],
    zeroWasteNote: 'L’acqua di cottura dei fagioli sostituisce parte del brodo e rende il piatto naturalmente vellutato.',
  },
  {
    id: 5,
    title: 'Risotto patate e salvia',
    prepTime: '28 min',
    difficulty: 'Facile',
    ingredients: [
      '180 g di riso Carnaroli',
      '2 patate medie tagliate a cubetti piccoli',
      '1/2 cipolla tritata',
      '6 foglie di salvia fresca',
      '1 litro di brodo caldo di bucce',
      'Olio extravergine, sale e pepe',
    ],
    steps: [
      'Pela le patate (conservando le bucce ben lavate per il brodo!) e tagliale a dadini di 1 cm.',
      'Fai rosolare la cipolla con olio e 3 foglie di salvia intere; unisci le patate e falle insaporire 4 minuti.',
      'Aggiungi il riso, tostalo 1 minuto e cuoci versando il brodo caldo di bucce poco alla volta.',
      'A fine cottura l’amido delle patate e del riso creerà una mantecatura ricca e setosa.',
      'Profuma con la salvia rimasta tritata fine e un filo d’olio a crudo.',
    ],
    zeroWasteNote: 'Le bucce delle patate rilasciano sali minerali preziosi nel brodo e non finiscono nell’umido.',
  },
  {
    id: 6,
    title: 'Risotto finto pesto aromatico',
    prepTime: '22 min',
    difficulty: 'Facile',
    ingredients: [
      '180 g di riso Carnaroli',
      'Foglie tenere di sedano + erbette di campo',
      'Rosmarino e salvia in piccola quantità',
      '15 g di frutta secca (noci o mandorle della cassetta)',
      '1 litro di brodo zero-sprechi',
      'Olio extravergine, sale e pepe',
    ],
    steps: [
      'Frulla a crudo le foglie di sedano (spesso scartate!) con erbette, poche foglie di salvia, frutta secca, 2 cucchiai d’olio e un filo d’acqua fredda fino a ottenere un “finto pesto” verde.',
      'Prepara un risotto in bianco tostato con sola cipolla tritata e brodo vegetale zero-sprechi.',
      'A fuoco spento, aggiungi il pesto aromatico a crudo e manteca velocemente perché resti verde vivo e profumato.',
      'Completa con pepe nero e qualche gheriglio spezzettato.',
    ],
    zeroWasteNote: 'Le foglie verdi del sedano, di solito buttate, diventano protagoniste di un condimento fresco e ricco.',
  },
  {
    id: 7,
    title: 'Riso al salto con erbette',
    prepTime: '20 min',
    difficulty: 'Facile',
    ingredients: [
      '250 g di riso già cotto o avanzato del giorno prima',
      '150 g di erbette ripassate o sbollentate e tritate',
      '1/2 cipolla tritata fine',
      '1 rametto di rosmarino',
      '2 cucchiai di olio extravergine, sale e pepe',
    ],
    steps: [
      'Fai appassire la cipolla in una padella larga con 1 cucchiaio d’olio e aggiungi le erbette tritate.',
      'Unisci il riso cotto mescolando bene per distribuire il condimento verde.',
      'Premi bene il riso con il dorso di un cucchiaio formando un disco compatto sul fondo della padella.',
      'Lascia cuocere a fuoco medio-alto senza toccare per 5–6 minuti finché si forma una crosticina dorata e croccante.',
      'Gira la tortina di riso aiutandoti con un coperchio o un piatto, dora l’altro lato per 4 minuti e servi a spicchi.',
    ],
    zeroWasteNote: 'La ricetta regina per trasformare qualsiasi risotto avanzato in un piatto nuovo e croccante.',
  },
  {
    id: 8,
    title: 'Minestra densa riso e verdure',
    prepTime: '30 min',
    difficulty: 'Facile',
    ingredients: [
      '150 g di riso Vialone Nano',
      '1 patata, 150 g di zucca, 1 costa di sedano, 100 g di broccoli',
      '1/2 cipolla + 1 foglia di alloro',
      '1,2 litri di brodo zero-sprechi',
      'Olio extravergine, sale e pepe',
    ],
    steps: [
      'Taglia tutte le verdure a cubetti piccoli e regolari.',
      'Soffriggi cipolla e sedano con olio e alloro per 3 minuti, poi aggiungi patate, zucca e broccoli.',
      'Copri con il brodo caldo zero-sprechi e fai sobbollire per 12 minuti.',
      'Versa il riso direttamente nella pentola e cuoci per altri 14 minuti mescolando ogni tanto.',
      'Schiaccia qualche cubetto di patata e zucca sul bordo della pentola per addensare, poi servi con olio a crudo.',
    ],
    zeroWasteNote: 'Ogni piccolo ritaglio di ortaggio della settimana trova posto in questa minestra calda.',
  },
  {
    id: 9,
    title: 'Arancini al forno anti-spreco',
    prepTime: '35 min',
    difficulty: 'Media',
    ingredients: [
      '300 g di risotto avanzato (alla zucca o alle erbette)',
      '1 uovo fresco contadino',
      '1 patata piccola lessa schiacciata (o 2 cucchiai di pangrattato)',
      'Cubetti di zucca o broccolo stufati per il ripieno',
      'Salvia tritata, olio extravergine, sale e pepe',
    ],
    steps: [
      'Mescola il risotto freddo con l’uovo sbattuto e la patata schiacciata per dare tenuta all’impasto.',
      'Preleva una manciata di composto, schiacciala sul palmo, inserisci al centro un cucchiaino di verdure stufate e richiudi formando una pallina.',
      'Disponi gli arancini su una teglia con carta forno, spennellali leggermente con olio aromatizzato alla salvia.',
      'Cuoci in forno caldo a 200 °C per 20–25 minuti fino a ottenere una crosta dorata e asciutta, senza friggere.',
    ],
    zeroWasteNote: 'Trasforma gli avanzi della sera precedente in uno street food sano apprezzatissimo anche dai bambini.',
  },
  {
    id: 10,
    title: 'Insalata di riso campagnola',
    prepTime: '25 min',
    difficulty: 'Facile',
    ingredients: [
      '180 g di riso Carnaroli (tiene bene la cottura al dente)',
      '100 g di broccoli al vapore a cimette piccole',
      '1 costa di sedano a rondelle sottili + 1/2 mela a dadini',
      '1 uovo sodo contadino',
      'Rosmarino tritato finissimo, olio extravergine, sale e pepe',
    ],
    steps: [
      'Lessa il riso al dente, scolalo e stendilo su un vassoio con un filo d’olio per raffreddarlo senza sciacquarlo sotto l’acqua.',
      'Cuoci a vapore o sbollenta per 4 minuti le cimette di broccolo e lasciale intiepidire.',
      'Unisci in una ciotola il riso, i broccoli, il sedano croccante, i dadini di mela e l’uovo sodo a spicchi.',
      'Condisci con un’emulsione di olio, sale, pepe e rosmarino tritato finemente.',
    ],
    zeroWasteNote: 'L’acqua di cottura del riso, ancora calda, può sbollentare i broccoli e poi (raffreddata e non salata) innaffiare i vasi sul balcone.',
  },
];

export const SECOND_RECIPES: RecipeItem[] = [
  {
    id: 1,
    title: 'Frittata patate e cipolle',
    prepTime: '25 min',
    difficulty: 'Facile',
    category: 'uova',
    categoryLabel: 'Uova',
    ingredients: [
      '4 uova fresche contadine',
      '2 patate medie affettate sottili',
      '1 cipolla dorata a rondelle',
      '1 rametto di rosmarino, olio, sale e pepe',
    ],
    steps: [
      'Fai rosolare lentamente patate e cipolle in padella con olio, sale e rosmarino per 12–15 minuti coprendo con un coperchio finché diventano tenere.',
      'Sbatti le uova in una ciotola con sale e pepe, poi unisci le patate e cipolle intiepidite.',
      'Versa tutto nella padella calda unta, cuoci 5 minuti a fuoco dolce, gira con il coperchio e dora altri 3 minuti.',
    ],
    zeroWasteNote: 'Le bucce delle patate ben lavate vanno nel barattolo o nella pentola del brodo.',
  },
  {
    id: 2,
    title: 'Frittata verde alle erbette',
    prepTime: '18 min',
    difficulty: 'Facile',
    category: 'uova',
    categoryLabel: 'Uova',
    ingredients: [
      '4 uova fresche contadine',
      '150 g di erbette spontanee dell’orto',
      '1/2 cipolla piccola tritata',
      'Olio extravergine, sale e pepe',
    ],
    steps: [
      'Appassisci in padella le erbette ben lavate con la cipolla e un filo d’olio per 5 minuti.',
      'Trita grossolanamente le erbette intiepidite e mescolale alle uova sbattute con sale e pepe.',
      'Cuoci la frittata a fiamma dolce 5 minuti per lato fino a doratura uniforme.',
    ],
    zeroWasteNote: 'I gambi teneri delle erbette danno croccantezza se tritati fini insieme alle foglie.',
  },
  {
    id: 3,
    title: 'Frittata ai broccoli',
    prepTime: '22 min',
    difficulty: 'Facile',
    category: 'uova',
    categoryLabel: 'Uova',
    ingredients: [
      '4 uova fresche contadine',
      '200 g di broccoli (cime e gambo a fettine sottili)',
      '2 foglie di salvia tritata',
      'Olio extravergine, sale e pepe',
    ],
    steps: [
      'Sbollenta o cuoci in padella con poca acqua coperta le cimette e il gambo del broccolo per 6 minuti.',
      'Ripassa velocemente i broccoli con olio e salvia per asciugare l’umidità.',
      'Versa sopra le uova sbattute, copri e cuoci a fuoco basso finché è ben rappresa.',
    ],
    zeroWasteNote: 'Usa sia le cimette che i dischetti sottili di gambo pelato.',
  },
  {
    id: 4,
    title: 'Uova in purgatorio su erbette',
    prepTime: '15 min',
    difficulty: 'Facile',
    category: 'uova',
    categoryLabel: 'Uova',
    ingredients: [
      '4 uova fresche contadine',
      '200 g di erbette miste',
      '1/2 cipolla o scalogno',
      '1 foglia di alloro, olio, sale e pepe',
    ],
    steps: [
      'Stufa le erbette in padella larga con cipolla, alloro, olio e due cucchiai d’acqua finché formano un letto morbido.',
      'Crea quattro piccoli incavi tra le erbette e rompi al loro interno le uova facendo attenzione a non rompere i tuorli.',
      'Copri con coperchio e cuoci 4 minuti a fuoco dolce finché l’albume è sodo e il tuorlo resta cremoso.',
    ],
    zeroWasteNote: 'Ottimo piatto unico veloce se accompagnato con due cucchiai di riso bianco.',
  },
  {
    id: 5,
    title: 'Uova su crema di zucca',
    prepTime: '25 min',
    difficulty: 'Facile',
    category: 'uova',
    categoryLabel: 'Uova',
    ingredients: [
      '4 uova fresche contadine',
      '300 g di zucca a cubetti',
      'Rosmarino e salvia',
      'Olio extravergine, sale e pepe',
    ],
    steps: [
      'Cuoci la zucca in padella con un bicchiere di brodo zero-sprechi, olio e rosmarino per 15 minuti finché si spappola.',
      'Schiacciala con una forchetta ottenendo una crema rustica e calda sul fondo della padella.',
      'Adagia le uova sopra la crema, sala i tuorli, copri 4 minuti e servi con pepe nero e salvia.',
    ],
    zeroWasteNote: 'La dolcezza della zucca elimina il bisogno di salse elaborate.',
  },
  {
    id: 6,
    title: 'Tortino broccoli e patate',
    prepTime: '35 min',
    difficulty: 'Facile',
    category: 'verdure',
    categoryLabel: 'Verdure',
    ingredients: [
      '2 patate medie',
      '250 g di broccoli',
      '1 uovo fresco (opzionale per legare) o 2 cucchiai d’olio',
      'Salvia, sale e pepe',
    ],
    steps: [
      'Taglia le patate a fette sottili e sbollentale 5 minuti insieme ai broccoli.',
      'In una teglia unta alterna strati di patate e broccoli schiacciati grossolanamente, condendo ogni strato con olio, sale, pepe e salvia.',
      'Cuoci in forno a 190 °C per 20 minuti finché la superficie fa una crosticina croccante.',
    ],
    zeroWasteNote: 'Senza sprechi: il brodo di sbollentatura resta la base per la minestra serale.',
  },
  {
    id: 7,
    title: 'Sformato zucca e cipolle',
    prepTime: '35 min',
    difficulty: 'Media',
    category: 'verdure',
    categoryLabel: 'Verdure',
    ingredients: [
      '350 g di zucca',
      '2 cipolle grandi affettate',
      '2 uova fresche (o 1 patata lessa schiacciata)',
      'Rosmarino, olio, sale e pepe',
    ],
    steps: [
      'Stufa in padella le cipolle e la zucca a cubetti con olio e rosmarino per 15 minuti finché sono asciutte e tenere.',
      'Schiaccia grossolanamente e mescola con le uova sbattute (oppure con la patata lessa schiacciata per una versione 100% vegetale).',
      'Trasferisci in una piccola pirofila unta e cuoci in forno 20 minuti a 185 °C.',
    ],
    zeroWasteNote: 'Le tuniche esterne delle cipolle dorate danno un bel colore ambrato al brodo vegetale.',
  },
  {
    id: 8,
    title: 'Strapazzata rustica dell’orto',
    prepTime: '12 min',
    difficulty: 'Facile',
    category: 'uova',
    categoryLabel: 'Uova',
    ingredients: [
      '4 uova fresche contadine',
      '1 costa di sedano a dadini piccoli',
      '1/2 cipolla + 1 manciata di erbette tritate',
      'Olio extravergine, sale e pepe',
    ],
    steps: [
      'Salta in padella a fuoco vivace sedano e cipolla con un filo d’olio per 4 minuti.',
      'Aggiungi le erbette tritate e fai asciugare un minuto.',
      'Versa le uova leggermente sbattute e mescola con cucchiaio di legno a fuoco dolce finché restano morbide e cremose.',
    ],
    zeroWasteNote: 'Perfetta per recuperare anche piccole porzioni di ortaggi misti rimasti in frigo.',
  },
  {
    id: 9,
    title: 'Rotolo di frittata ripieno',
    prepTime: '25 min',
    difficulty: 'Media',
    category: 'uova',
    categoryLabel: 'Uova',
    ingredients: [
      '4 uova fresche contadine',
      '150 g di patate lesse schiacciate con olio e salvia',
      '100 g di erbette stufate',
      'Olio extravergine, sale e pepe',
    ],
    steps: [
      'Prepara una frittata sottile e ampia cuocendola in forno su carta forno (180 °C per 10 minuti) o in padella larga.',
      'Spalma sulla superficie tiepida una crema di patate schiacciate, erbette stufate e salvia.',
      'Arrotola stretto aiutandoti con la carta, lascia riposare 5 minuti e taglia a girelle spesse.',
    ],
    zeroWasteNote: 'Si gusta sia caldo che freddo il giorno dopo per il pranzo fuori casa.',
  },
  {
    id: 10,
    title: 'Burger di ceci e rosmarino',
    prepTime: '25 min',
    difficulty: 'Facile',
    category: 'legumi',
    categoryLabel: 'Legumi',
    ingredients: [
      '240 g di ceci cotti scolati',
      '1 patata media lessa',
      '1/2 cipolla tritata fine + rosmarino',
      'Olio extravergine, sale e pepe',
    ],
    steps: [
      'Schiaccia bene i ceci insieme alla patata lessa con una forchetta fino a ottenere un composto lavorabile.',
      'Aggiungi cipolla tritata, rosmarino, sale, pepe e un cucchiaio d’olio.',
      'Forma 4 burger compatti con le mani e cuocili in padella antiaderente leggermente unta per 4 minuti per lato.',
    ],
    zeroWasteNote: 'L’aquafaba (acqua dei ceci) si conserva in frigo e si può montare o usare nelle zuppe.',
  },
  {
    id: 11,
    title: 'Polpette fagioli e patate',
    prepTime: '30 min',
    difficulty: 'Facile',
    category: 'legumi',
    categoryLabel: 'Legumi',
    ingredients: [
      '200 g di fagioli cotti',
      '2 patate lesse',
      'Foglie di sedano e salvia tritate',
      'Olio extravergine, sale e pepe',
    ],
    steps: [
      'Riduci in purea grossolana fagioli e patate tiepide.',
      'Insaporisci con foglie di sedano tritate, salvia, sale e pepe.',
      'Forma delle polpettine tonde e passale in padella o in forno a 195 °C per 18 minuti fino a doratura.',
    ],
    zeroWasteNote: 'Zero pan grattato necessario: l’amido naturale delle patate e dei fagioli lega perfettamente.',
  },
  {
    id: 12,
    title: 'Fagioli all’uccelletto contadini',
    prepTime: '20 min',
    difficulty: 'Facile',
    category: 'legumi',
    categoryLabel: 'Legumi',
    ingredients: [
      '250 g di fagioli cannellini o borlotti cotti',
      '4 foglie di salvia fresca + 1 foglia di alloro',
      '1/2 cipolla affettata fine',
      'Olio extravergine, sale e pepe nero abbondante',
    ],
    steps: [
      'Fai appassire la cipolla con olio, salvia e alloro in padella per 5 minuti.',
      'Aggiungi i fagioli con mezzo mestolo della loro acqua o del brodo zero-sprechi.',
      'Lascia sobbollire 10 minuti mescolando piano per formare un sughetto cremoso alle erbe.',
    ],
    zeroWasteNote: 'Senza concentrati industriali: il brodo di bucce e la salvia regalano un aroma intenso.',
  },
  {
    id: 13,
    title: 'Ceci stufati e broccoli',
    prepTime: '22 min',
    difficulty: 'Facile',
    category: 'legumi',
    categoryLabel: 'Legumi',
    ingredients: [
      '220 g di ceci cotti',
      '200 g di broccoli a cimette e gambo a dadini',
      '1 rametto di rosmarino + 1/2 cipolla',
      'Olio extravergine, sale e pepe',
    ],
    steps: [
      'Soffriggi cipolla e rosmarino con olio, poi aggiungi i dadini di gambo di broccolo e cuoci 4 minuti.',
      'Unisci le cimette di broccolo, i ceci e mezzo bicchiere di brodo zero-sprechi.',
      'Copri e lascia stufare 10 minuti, poi scopri per asciugare leggermente e servi caldo.',
    ],
    zeroWasteNote: 'Abbinamento completo di fibre, proteine vegetali e zero scarti del broccolo.',
  },
  {
    id: 14,
    title: 'Purè di fave e cicoria (o erbette)',
    prepTime: '35 min',
    difficulty: 'Media',
    category: 'legumi',
    categoryLabel: 'Legumi',
    ingredients: [
      '200 g di fave secche decorticate (o ceci/fagioli bianchi)',
      '1 patata piccola',
      '200 g di cicoria o erbette di campo',
      '1 foglia di alloro, olio extravergine, sale e pepe',
    ],
    steps: [
      'Cuoci le fave decorticate con la patata a tocchetti, alloro e acqua per circa 25–30 minuti finché si disfano.',
      'Frulla o sbatti energicamente con olio extravergine a filo e sale fino a creare un purè liscio.',
      'Servi caldo accompagnato dalle erbette di campo sbollentate e ripassate con olio a crudo.',
    ],
    zeroWasteNote: 'Un grande classico contadino del Sud Italia economico, nutriente e naturalmente privo di sprechi.',
  },
  {
    id: 15,
    title: 'Padellata lenticchie e zucca',
    prepTime: '25 min',
    difficulty: 'Facile',
    category: 'legumi',
    categoryLabel: 'Legumi',
    ingredients: [
      '180 g di lenticchie già cotte (o 100 g secche)',
      '250 g di zucca a cubetti',
      'Rosmarino, alloro, 1/2 cipolla',
      'Olio extravergine, sale e pepe',
    ],
    steps: [
      'Fai appassire la cipolla con rosmarino, alloro e olio; aggiungi la zucca a cubetti e fai rosolare 5 minuti.',
      'Unisci le lenticchie e un mestolo di brodo vegetale zero-sprechi.',
      'Cuoci a fuoco dolce 10–12 minuti finché la zucca è tenera e avvolge le lenticchie.',
    ],
    zeroWasteNote: 'Le lenticchie non richiedono ammollo se partite da secche (bastano 25 minuti in brodo di bucce).',
  },
  {
    id: 16,
    title: 'Frittata di fagioli e cipolla',
    prepTime: '20 min',
    difficulty: 'Facile',
    category: 'legumi',
    categoryLabel: 'Legumi',
    ingredients: [
      '3 uova fresche contadine',
      '150 g di fagioli cotti ben scolati',
      '1 cipolla piccola affettata',
      'Salvia fresca, olio, sale e pepe',
    ],
    steps: [
      'Rosola la cipolla con olio e salvia in padella finché diventa trasparente e dolce.',
      'Unisci i fagioli scolati e falli insaporire 2 minuti.',
      'Versa sopra le uova sbattute con sale e pepe e cuoci dolcemente da entrambi i lati.',
    ],
    zeroWasteNote: 'Ideale per valorizzare anche piccole rimanenze di legumi cotti.',
  },
  {
    id: 17,
    title: 'Medaglioni lenticchie ed erbette',
    prepTime: '28 min',
    difficulty: 'Media',
    category: 'legumi',
    categoryLabel: 'Legumi',
    ingredients: [
      '200 g di lenticchie cotte ben asciutte',
      '100 g di erbette sbollentate, strizzate e tritate',
      '1 patata lessa media',
      'Rosmarino, olio, sale e pepe',
    ],
    steps: [
      'Schiaccia metà delle lenticchie con la patata lessa e aggiungi le altre lenticchie intere e le erbette tritate.',
      'Condisci con rosmarino tritato, sale e pepe; forma 6 medaglioni spessi circa 1,5 cm.',
      'Cuoci in padella calda leggermente unta 4 minuti per lato finché sono croccanti fuori.',
    ],
    zeroWasteNote: 'L’acqua strizzata dalle erbette non si butta: finisce subito nella caraffa per bagnare i vasi.',
  },
  {
    id: 18,
    title: 'Broccoli e patate affogati in padella',
    prepTime: '25 min',
    difficulty: 'Facile',
    category: 'verdure',
    categoryLabel: 'Verdure',
    ingredients: [
      '250 g di broccoli (cime e gambo a fettine)',
      '2 patate medie a tocchetti',
      '1/2 cipolla + 1 foglia di alloro',
      'Olio extravergine, sale e pepe',
    ],
    steps: [
      'Metti a freddo in una padella ampia cipolla, patate, broccoli, alloro, 3 cucchiai d’olio, sale, pepe e mezzo bicchiere d’acqua.',
      'Chiudi con coperchio ermetico e cuoci a fiamma dolce per 18–20 minuti scuotendo la padella ogni tanto.',
      'Quando le verdure sono tenere e il fondo è cremoso, servi caldo con olio a crudo.',
    ],
    zeroWasteNote: 'Cottura dolce a coperchio chiuso: trattiene tutti gli aromi e consuma pochissimo gas.',
  },
  {
    id: 19,
    title: 'Zucca al forno alle erbe aromatiche',
    prepTime: '30 min',
    difficulty: 'Facile',
    category: 'verdure',
    categoryLabel: 'Verdure',
    ingredients: [
      '450 g di zucca a fette sottili (con buccia lavata)',
      'Rosmarino, salvia e alloro tritati',
      '2 cucchiai di olio extravergine',
      'Sale e pepe nero',
    ],
    steps: [
      'Lava benissimo la buccia della zucca (se tenera come Delica o Hokkaido si mangia intera!).',
      'Tagliala a spicchi sottili di circa 1 cm e disponili su teglia senza sovrapporli.',
      'Condisci con olio, sale, pepe ed erbe aromatiche tritate e inforna a 200 °C per 22–25 minuti.',
    ],
    zeroWasteNote: 'Cuocendo la zucca con la sua buccia risparmi tempo di taglio e raddoppi le fibre.',
  },
  {
    id: 20,
    title: 'Cipolle ripiene al forno contadine',
    prepTime: '40 min',
    difficulty: 'Media',
    category: 'verdure',
    categoryLabel: 'Verdure',
    ingredients: [
      '2 cipolle grandi e sode',
      '1 patata piccola lessa + 50 g di erbette tritate',
      '1 uovo (o 2 cucchiai di lenticchie schiacciate)',
      'Salvia, olio extravergine, sale e pepe',
    ],
    steps: [
      'Sbollenta le cipolle intere sbucciate per 8 minuti, lasciale intiepidire, taglia la calotta e svuotale delicatamente lasciando 2–3 strati esterni.',
      'Trita il cuore estratto delle cipolle e fallo appassire in padella con olio e erbette.',
      'Mescola con la patata schiacciata, l’uovo (o legumi), salvia, sale e pepe; riempi le cipolle e cuoci in forno 20 minuti a 190 °C.',
    ],
    zeroWasteNote: 'Il cuore della cipolla estratto non si scarta: diventa l’ingrediente principale del ripieno.',
  },
];

export const KIDS_SHOW_COOKING: KidsRecipe[] = [
  {
    id: 1,
    title: 'Polpette Magiche “Verde Hulk”',
    ageNote: 'Da 4 anni in su · Mani in pasta',
    duration: '20 min',
    ingredients: [
      '2 patate lesse schiacciate con la forchetta',
      '100 g di erbette di campo sbollentate e tritate',
      '1 uovo fresco contadino + sale leggero',
    ],
    steps: [
      'Schiaccia le patate tiepide insieme alle erbette verdi finché l’impasto diventa tutto verde brillante.',
      'Aggiungi l’uovo e fai lavorare ai bambini formando tante palline con le mani.',
      'Cuoci in forno a 190 °C per 18 minuti su carta forno con un filo d’olio.',
    ],
    funFact: 'I bambini scoprono che le erbette spontanee colorano davvero il cibo in modo naturale!',
  },
  {
    id: 2,
    title: 'Arancini d’Oro Anti-Spreco',
    ageNote: 'Da 5 anni in su · Recupero creativo',
    duration: '25 min',
    ingredients: [
      '250 g di risotto giallo alla zucca avanzato',
      '1 uovo + 1 cucchiaio di patata lessa',
      'Un piccolo cubetto di patata o zucca cotta per il cuore morbido',
    ],
    steps: [
      'Impasta il risotto freddo alla zucca con l’uovo per renderlo modellabile.',
      'Ogni bambino prende una pallina, nasconde dentro il “tesoro” morbido e richiude con cura.',
      'Spennella con olio e inforna a 200 °C per 20 minuti fino a doratura croccante.',
    ],
    funFact: 'Insegna che il risotto avanzato della sera prima è un ingrediente prezioso, mai uno scarto.',
  },
  {
    id: 3,
    title: 'Barchette Croccanti di Sedano',
    ageNote: 'Da 3 anni in su · Senza fornelli',
    duration: '10 min',
    ingredients: [
      '4 coste di sedano croccanti tagliate a tronchetti',
      '150 g di ceci o fagioli schiacciati con olio e salvia',
      'Qualche fogliolina di sedano per fare la “vela”',
    ],
    steps: [
      'Prepara una crema morbida schiacciando i legumi con una forchetta e un goccio d’olio.',
      'Riempi l’incavo delle coste di sedano con la crema usando un cucchiaino.',
      'Infila una foglia di sedano in verticale per creare la vela della barchetta!',
    ],
    funFact: 'Merenda salata sana e divertente pronta in dieci minuti senza accendere i fuochi.',
  },
  {
    id: 4,
    title: 'Mele Stregate al Forno',
    ageNote: 'Da 4 anni in su · Dolce naturale',
    duration: '25 min',
    ingredients: [
      '2 mele non trattate intere',
      'Fichi secchi o noci tritate grossolanamente',
      '2 foglie di alloro fresco dell’orto',
    ],
    steps: [
      'Togli il torsolo alle mele (con l’aiuto di un adulto) lasciando chiuso il fondo.',
      'I bambini riempiono il cuore della mela con pezzetti di fichi, frutta secca e mezza foglia d’alloro.',
      'Cuoci in forno o pentolino coperto per 20 minuti finché la casa profuma di dolce naturale.',
    ],
    funFact: 'Dolce genuino senza zuccheri raffinati né confetture industriali.',
  },
];
