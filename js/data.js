// ─── Configuração da marca ─────────────────────────────────────────────────
const CONFIG = {
  whatsapp: '554792780784',
  brandName: 'Indaiá',
  brandSub: 'Doces Finos',
  tagline: 'Confeitaria artesanal premium para eventos e celebrações especiais'
};

// ─── Categorias ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',              label: 'Todos'           },
  { id: 'bombons',          label: 'Bombons'          },
  { id: 'brigadeiros',      label: 'Brigadeiros'      },
  { id: 'classicos',        label: 'Clássicos'        },
  { id: 'copinhos',         label: 'Copinhos'         },
  { id: 'mini-sobremesas',  label: 'Mini Sobremesas'  },
  { id: 'palhas-italianas', label: 'Palhas Italianas' },
  { id: 'tartelettes',      label: 'Tartelettes'      }
];

// ─── Perfis de filtro rápido ───────────────────────────────────────────────
const PROFILES = [
  { id: 'chocolate',   label: 'Chocolate'   },
  { id: 'frutas',      label: 'Frutas'      },
  { id: 'pistache',    label: 'Pistache'    },
  { id: 'classicos',   label: 'Clássicos'   },
  { id: 'premium',     label: 'Premium'     },
  { id: 'refrescante', label: 'Refrescantes'}
];

// ─── Produtos ──────────────────────────────────────────────────────────────
const PRODUCTS = [
  // ── BOMBONS ─────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Bombom de Coulis de Morango & Framboesa Liofilizada',
    category: 'bombons',
    categoryLabel: 'Bombons',
    tag: 'Premium',
    tagType: 'premium',
    shortDesc: 'Casca de chocolate nobre com coulis de morango fresco e toque crocante de framboesa liofilizada.',
    fullDesc: 'Uma casca de chocolate nobre envolve um coração de coulis de morango fresco, finalizado com framboesa liofilizada que traz crocância e acidez delicada. O equilíbrio entre o doce do chocolate e o frutado intenso das framboesas resulta em uma experiência sofisticada e memorável.',
    highlights: [
      'Framboesa liofilizada crocante e aromática',
      'Recheio de coulis de morango fresco',
      'Contraste sofisticado entre doce e ácido',
      'Visual elegante e apetitoso'
    ],
    usage: 'Ideal para mesas de doces em casamentos, festas sofisticadas e como presente gourmet especial.',
    profiles: ['frutas', 'premium'],
    gradient: 'linear-gradient(145deg, #F9EBEA 0%, #E8B4B8 60%, #C17B85 100%)',
    icon: '🍓',
    searchTerms: 'morango framboesa coulis chocolate'
  },
  {
    id: 2,
    name: 'Bombom de Frutas Vermelhas & Baunilha',
    category: 'bombons',
    categoryLabel: 'Bombons',
    tag: 'Sofisticado',
    tagType: 'elegant',
    shortDesc: 'Recheio aveludado de creme de baunilha e coulis de frutas vermelhas em casca de chocolate.',
    fullDesc: 'Um bombom de chocolate ao leite com recheio aveludado de creme de baunilha e coulis de frutas vermelhas selecionadas. A combinação clássica e irresistível une aroma inconfundível da baunilha ao sabor frutado e ligeiramente ácido das frutas vermelhas.',
    highlights: [
      'Creme de baunilha genuíno e aveludado',
      'Coulis de frutas vermelhas selecionadas',
      'Casca de chocolate ao leite',
      'Harmoniza elegância e frescor'
    ],
    usage: 'Perfeito para mesas gourmet em eventos, festas temáticas e presentes especiais.',
    profiles: ['frutas', 'premium'],
    gradient: 'linear-gradient(145deg, #F5E6F0 0%, #D4A0C4 60%, #9E6090 100%)',
    icon: '🍇',
    searchTerms: 'frutas vermelhas baunilha chocolate cremoso'
  },
  {
    id: 3,
    name: 'Bombom de Pistache',
    category: 'bombons',
    categoryLabel: 'Bombons',
    tag: 'Tendência',
    tagType: 'trend',
    shortDesc: 'Creme de pistache artesanal em casca de chocolate. O sabor do momento na confeitaria premium.',
    fullDesc: 'Casca de chocolate ao leite com recheio de creme de pistache artesanal, preparado com pistache de qualidade superior. O pistache é o ingrediente mais requisitado da confeitaria premium atual, trazendo sabor único, cor vibrante e um sofisticado perfil aromático.',
    highlights: [
      'Pistache de qualidade superior selecionado',
      'Creme artesanal de textura sedosa',
      'Cor e aroma únicos e marcantes',
      'Grande sucesso em eventos e mesas gourmet'
    ],
    usage: 'Destaque absoluto em mesas de doces para casamentos, festas premium e presenteamento especial.',
    profiles: ['pistache', 'premium'],
    gradient: 'linear-gradient(145deg, #EBF0E0 0%, #B8C89A 60%, #7A9060 100%)',
    icon: '🌿',
    searchTerms: 'pistache chocolate artesanal tendencia premium'
  },
  {
    id: 4,
    name: 'Bombom Ninho com Nutella',
    category: 'bombons',
    categoryLabel: 'Bombons',
    tag: 'Favorito',
    tagType: 'favorite',
    shortDesc: 'Creme de Leite Ninho com recheio generoso de Nutella. Irresistível em qualquer evento.',
    fullDesc: 'Casca de chocolate com creme de Leite Ninho e um coração de Nutella original que surpreende a cada mordida. A combinação une o sabor lácteo e reconfortante do leite em pó ao irresistível creme de avelã, conquistando todos os paladares.',
    highlights: [
      'Recheio de Nutella original',
      'Creme aveludado de Leite Ninho',
      'Alta aceitação em todos os públicos',
      'Sabor nostálgico elevado ao gourmet'
    ],
    usage: 'Queridinho em festas infantis sofisticadas, casamentos e eventos para todos os públicos.',
    profiles: ['chocolate', 'premium'],
    gradient: 'linear-gradient(145deg, #FBF0E0 0%, #DFC498 60%, #B08040 100%)',
    icon: '✨',
    searchTerms: 'ninho nutella leite chocolate hazelnut'
  },

  // ── BRIGADEIROS ──────────────────────────────────────────────────────────
  {
    id: 5,
    name: 'Brigadeiro de Chocolate Belga',
    category: 'brigadeiros',
    categoryLabel: 'Brigadeiros',
    tag: 'Premium',
    tagType: 'premium',
    shortDesc: 'O clássico brigadeiro em sua versão mais refinada, preparado com chocolate belga de alta qualidade.',
    fullDesc: 'O clássico brasileiro em sua forma mais sofisticada: brigadeiro preparado com chocolate belga selecionado de alta qualidade. A textura sedosa e o sabor intenso e equilibrado do chocolate belga elevam o doce mais amado do Brasil a uma experiência verdadeiramente gourmet.',
    highlights: [
      'Chocolate belga selecionado de alta qualidade',
      'Textura sedosa e cremosa irresistível',
      'Sabor intenso e perfeitamente equilibrado',
      'O clássico elevado ao universo gourmet'
    ],
    usage: 'Essencial em qualquer mesa de doces. Combina com todos os tipos de eventos e celebrações.',
    profiles: ['chocolate', 'classicos', 'premium'],
    gradient: 'linear-gradient(145deg, #F0E0D0 0%, #C4906A 60%, #7A4020 100%)',
    icon: '◈',
    searchTerms: 'brigadeiro chocolate belga classico premium tradicional'
  },
  {
    id: 6,
    name: 'Brigadeiro de Coco Queimado & Doce de Leite',
    category: 'brigadeiros',
    categoryLabel: 'Brigadeiros',
    tag: 'Artesanal',
    tagType: 'artisan',
    shortDesc: 'Brigadeiro com coco tostado artesanalmente e doce de leite tradicional. Sabor caramelizado envolvente.',
    fullDesc: 'Brigadeiro artesanal com coco cuidadosamente tostado e envolvido em doce de leite tradicional. O sabor caramelizado do coco queimado cria uma combinação reconfortante e sofisticada que remete ao melhor da confeitaria brasileira, com toque contemporâneo.',
    highlights: [
      'Coco tostado artesanalmente com precisão',
      'Doce de leite tradicional selecionado',
      'Sabor caramelizado profundo e envolvente',
      'Identidade brasileira com alma gourmet'
    ],
    usage: 'Muito apreciado em eventos que celebram a identidade cultural brasileira com sofisticação.',
    profiles: ['classicos'],
    gradient: 'linear-gradient(145deg, #F8F0E0 0%, #D4B870 60%, #907030 100%)',
    icon: '◎',
    searchTerms: 'coco queimado doce de leite caramelo brigadeiro tostado'
  },
  {
    id: 7,
    name: 'Brigadeiro de Oreo',
    category: 'brigadeiros',
    categoryLabel: 'Brigadeiros',
    tag: 'Favorito',
    tagType: 'favorite',
    shortDesc: 'Brigadeiro de chocolate branco com pedaços de biscoito Oreo. Textura crocante e sabor marcante.',
    fullDesc: 'Brigadeiro de chocolate branco artesanal com pedaços generosos de biscoito Oreo misturados à massa cremosa. A textura crocante do biscoito contrasta com o brigadeiro aveludado, criando uma experiência sensorial encantadora e muito apreciada.',
    highlights: [
      'Biscoito Oreo original incorporado',
      'Textura crocante contrastando com o cremoso',
      'Visual charmoso de preto e branco',
      'Alta aceitação em todas as idades'
    ],
    usage: 'Sucesso garantido em festas infantis sofisticadas, eventos jovens e mesas diversificadas.',
    profiles: ['chocolate'],
    gradient: 'linear-gradient(145deg, #F0EEF0 0%, #C0B0C0 60%, #706080 100%)',
    icon: '◉',
    searchTerms: 'oreo biscoito chocolate branco crocante'
  },
  {
    id: 8,
    name: 'Brigadeiro de Pistache',
    category: 'brigadeiros',
    categoryLabel: 'Brigadeiros',
    tag: 'Tendência',
    tagType: 'trend',
    shortDesc: 'Creme de pistache artesanal com granulado de pistache na cobertura. O sabor mais procurado do momento.',
    fullDesc: 'Brigadeiro artesanal com creme de pistache de qualidade superior e granulado de pistache na cobertura, trazendo textura e cor vibrante. Um dos sabores mais requisitados na confeitaria premium atual, que encanta pela originalidade e pelo perfil aromático único.',
    highlights: [
      'Creme de pistache artesanal genuíno',
      'Granulado de pistache na cobertura',
      'Cor vibrante e visual apetitoso',
      'Tendência premium da confeitaria brasileira'
    ],
    usage: 'Destaque em mesas gourmet de casamentos, festas de aniversário sofisticadas e eventos corporativos.',
    profiles: ['pistache', 'premium'],
    gradient: 'linear-gradient(145deg, #E8F0DC 0%, #A8C088 60%, #688040 100%)',
    icon: '◆',
    searchTerms: 'pistache brigadeiro tendencia premium gourmet'
  },
  {
    id: 9,
    name: 'Brigadeiro de Uva Verde',
    category: 'brigadeiros',
    categoryLabel: 'Brigadeiros',
    tag: 'Refrescante',
    tagType: 'refresh',
    shortDesc: 'Brigadeiro artesanal com sabor de uva verde, delicado e levemente ácido. Frescor e leveza únicos.',
    fullDesc: 'Brigadeiro artesanal com sabor delicado de uva verde, equilibrando o doce característico do brigadeiro com um toque levemente ácido e refrescante. Uma opção diferenciada e marcante que surpreende pelo sabor inusitado e pela cor elegante.',
    highlights: [
      'Sabor de uva verde fresca e refrescante',
      'Equilíbrio sofisticado entre doce e ácido',
      'Cor delicada e visual diferenciado',
      'Opção única que gera curiosidade e encanta'
    ],
    usage: 'Excelente para variar a mesa de doces com sabores inusitados em eventos especiais.',
    profiles: ['frutas', 'refrescante'],
    gradient: 'linear-gradient(145deg, #EEE4F5 0%, #B898CC 60%, #806099 100%)',
    icon: '◇',
    searchTerms: 'uva verde brigadeiro refrescante diferente'
  },

  // ── CLÁSSICOS ────────────────────────────────────────────────────────────
  {
    id: 10,
    name: 'Cajuzinho',
    category: 'classicos',
    categoryLabel: 'Clássicos',
    tag: 'Tradicional',
    tagType: 'classic',
    shortDesc: 'O clássico cajuzinho artesanal modelado na forma do caju. Sabor de amendoim que atravessa gerações.',
    fullDesc: 'O tradicional cajuzinho brasileiro preparado artesanalmente com amendoim selecionado e modelado com esmero na característica forma do caju. Textura levemente granulada e sabor intenso que remete às melhores festas de gerações passadas, agora com apresentação sofisticada.',
    highlights: [
      'Amendoim selecionado de qualidade',
      'Modelagem artesanal delicada em forma de caju',
      'Textura granulada característica e autêntica',
      'Sabor tradicional que atravessa gerações'
    ],
    usage: 'Clássico indispensável em mesas de festa. Traz afeto e memória afetiva a qualquer celebração.',
    profiles: ['classicos'],
    gradient: 'linear-gradient(145deg, #FBF0D8 0%, #DCAA60 60%, #A07020 100%)',
    icon: '○',
    searchTerms: 'cajuzinho amendoim tradicional classico festa'
  },
  {
    id: 11,
    name: 'Camafeu de Nozes',
    category: 'classicos',
    categoryLabel: 'Clássicos',
    tag: 'Sofisticado',
    tagType: 'elegant',
    shortDesc: 'Doce clássico de nozes com cobertura branca fondante. Visual refinado e textura marcante.',
    fullDesc: 'O elegante camafeu de nozes, com recheio generoso de nozes selecionadas e cobertura de fondant branco que contrasta belissimamente com o interior. Textura firme por fora e macia por dentro, com sabor intenso e sofisticado que faz deste doce um clássico irresistível.',
    highlights: [
      'Nozes selecionadas de alta qualidade',
      'Cobertura fondante branca impecável',
      'Visual refinado: branco por fora, rico por dentro',
      'Textura contrastante e deliciosa'
    ],
    usage: 'Escolha elegante para casamentos, bodas e eventos que celebram a sofisticação clássica.',
    profiles: ['classicos', 'premium'],
    gradient: 'linear-gradient(145deg, #F5F0E0 0%, #D0C090 60%, #907830 100%)',
    icon: '✦',
    searchTerms: 'nozes fondant camafeu classico sofisticado'
  },
  {
    id: 12,
    name: 'Casadinho de Chocolate com Leite Ninho',
    category: 'classicos',
    categoryLabel: 'Clássicos',
    tag: 'Clássico',
    tagType: 'classic',
    shortDesc: 'Dois brigadeiros em um: chocolate belga e Leite Ninho, unidos em harmonia perfeita.',
    fullDesc: 'O tradicional casadinho em versão gourmet: uma metade de brigadeiro de chocolate belga e outra de brigadeiro de Leite Ninho, unidos em um só doce bicolor. A combinação clássica e irresistível que une dois sabores amados em uma apresentação visualmente charmosa.',
    highlights: [
      'Dois sabores icônicos em uma só peça',
      'Chocolate belga e Leite Ninho premium',
      'Visual bicolor elegante e charmoso',
      'Combinação clássica que nunca decepciona'
    ],
    usage: 'Perfeito para qualquer estilo de evento. Agrada a públicos de todas as idades.',
    profiles: ['chocolate', 'classicos'],
    gradient: 'linear-gradient(145deg, #F4E8E0 0%, #C09878 60%, #E8D8C0 100%)',
    icon: '◫',
    searchTerms: 'casadinho ninho chocolate brigadeiro classico dois sabores'
  },
  {
    id: 13,
    name: 'Conchinha',
    category: 'classicos',
    categoryLabel: 'Clássicos',
    tag: 'Tradicional',
    tagType: 'classic',
    shortDesc: 'O clássico doce conchinha artesanal, modelado com esmero. Sabor suave e reconfortante.',
    fullDesc: 'A delicada conchinha artesanal, modelada com cuidado na característica forma de concha. Sabor suave, equilibrado e reconfortante que remete à confeitaria tradicional brasileira. Cada peça é preparada com atenção especial à apresentação e à textura.',
    highlights: [
      'Modelagem artesanal delicada e cuidadosa',
      'Sabor suave, equilibrado e reconfortante',
      'Receita tradicional da confeitaria brasileira',
      'Apresentação elegante e delicada'
    ],
    usage: 'Doce clássico que não pode faltar nas mesas de festa tradicionais e sofisticadas.',
    profiles: ['classicos'],
    gradient: 'linear-gradient(145deg, #FCF5EC 0%, #DDC8A0 60%, #AE9060 100%)',
    icon: '◌',
    searchTerms: 'conchinha classico tradicional artesanal'
  },
  {
    id: 18,
    name: 'Damasco com Brigadeiro Branco Belga',
    category: 'classicos',
    categoryLabel: 'Clássicos',
    tag: 'Premium',
    tagType: 'premium',
    shortDesc: 'Damasco seco recheado com brigadeiro branco belga aveludado. Frutado, cremoso e sofisticado.',
    fullDesc: 'Damasco seco cuidadosamente selecionado, recheado com brigadeiro branco de chocolate belga aveludado. A combinação do frutado levemente ácido e aromático do damasco com a cremosidade e delicadeza do chocolate branco resulta em uma experiência sofisticada e absolutamente marcante.',
    highlights: [
      'Damasco seco selecionado e de qualidade',
      'Brigadeiro de chocolate branco belga',
      'Combinação frutada e cremosa surpreendente',
      'Sabor sofisticado e visualmente elegante'
    ],
    usage: 'Requintado para mesas de casamento, confraternizações e eventos corporativos sofisticados.',
    profiles: ['frutas', 'premium'],
    gradient: 'linear-gradient(145deg, #F8E4D0 0%, #D08840 60%, #9E5818 100%)',
    icon: '◑',
    searchTerms: 'damasco brigadeiro branco belga frutado classico'
  },

  // ── COPINHOS ─────────────────────────────────────────────────────────────
  {
    id: 14,
    name: 'Copinho de Caramelo Salgado & Mousse de Chocolate',
    category: 'copinhos',
    categoryLabel: 'Copinhos',
    tag: 'Mais sofisticado',
    tagType: 'premium',
    shortDesc: 'Caramelo salgado artesanal com mousse de chocolate belga. Contraste agridoce inesquecível.',
    fullDesc: 'Camadas harmoniosas de caramelo salgado artesanal e mousse de chocolate belga, servidas em um copinho elegante. O contraste entre o sal e o chocolate cria uma experiência gustativa complexa e absolutamente inesquecível, típica da confeitaria de alto nível.',
    highlights: [
      'Caramelo salgado artesanal irresistível',
      'Mousse de chocolate belga de textura leve',
      'Contraste agridoce de alto nível',
      'Apresentação impecável em copinho individual'
    ],
    usage: 'Estrela das mesas de eventos. Perfeito para casamentos, festas de gala e eventos corporativos.',
    profiles: ['chocolate', 'premium'],
    gradient: 'linear-gradient(145deg, #F8EDDC 0%, #C08030 60%, #784010 100%)',
    icon: '◎',
    searchTerms: 'caramelo salgado mousse chocolate copinho sofisticado'
  },
  {
    id: 15,
    name: 'Copinho de Chocolate Branco, Geleia de Maracujá, Creme Belga e Physalis',
    category: 'copinhos',
    categoryLabel: 'Copinhos',
    tag: 'Premium',
    tagType: 'premium',
    shortDesc: 'Sobremesa completa em miniatura: creme belga, maracujá e physalis em visual deslumbrante.',
    fullDesc: 'Uma sobremesa completa em formato individual: camadas de creme belga aveludado, geleia de maracujá artesanal levemente ácida e chocolate branco, coroadas com physalis fresco. Visual deslumbrante e sabor tropical com sofisticação europeia — uma combinação absolutamente única.',
    highlights: [
      'Physalis fresco como coroa decorativa',
      'Geleia de maracujá artesanal aromática',
      'Creme belga de textura sedosa',
      'Combinação tropical-europeia sofisticada'
    ],
    usage: 'Para eventos que exigem o mais alto nível de sofisticação e impacto visual na mesa.',
    profiles: ['frutas', 'premium'],
    gradient: 'linear-gradient(145deg, #F5F8D8 0%, #C8B840 60%, #F89040 100%)',
    icon: '◉',
    searchTerms: 'maracuja physalis chocolate branco belga creme copinho tropical'
  },
  {
    id: 16,
    name: 'Copinho de Morango',
    category: 'copinhos',
    categoryLabel: 'Copinhos',
    tag: 'Refrescante',
    tagType: 'refresh',
    shortDesc: 'Creme delicado de morango com morango fresco. Leveza e frescor em apresentação rosada e encantadora.',
    fullDesc: 'Copinho refrescante com mousse ou creme artesanal de morango natural, decorado com morango fresco selecionado. Cor rosada delicada e sabor frutado autêntico em uma apresentação visualmente encantadora. Leveza e frescor ideais para mesas de doces em épocas quentes.',
    highlights: [
      'Morango fresco e selecionado na decoração',
      'Creme artesanal de morango natural',
      'Visual rosado delicado e apetitoso',
      'Opção leve e refrescante para eventos'
    ],
    usage: 'Perfeito para casamentos, festas de primavera-verão e eventos ao ar livre.',
    profiles: ['frutas', 'refrescante'],
    gradient: 'linear-gradient(145deg, #FAE6E8 0%, #E09898 60%, #B85868 100%)',
    icon: '◈',
    searchTerms: 'morango copinho fresco refrescante rosa'
  },
  {
    id: 17,
    name: 'Copinho de Uva',
    category: 'copinhos',
    categoryLabel: 'Copinhos',
    tag: 'Refrescante',
    tagType: 'refresh',
    shortDesc: 'Creme delicado com uva fresca. Frescor, leveza e visual diferenciado para mesas especiais.',
    fullDesc: 'Copinho elegante com creme delicado artesanal e uva fresca selecionada, trazendo frescor e leveza à mesa de doces. Uma opção diferenciada e visualmente atraente que surpreende pelo sabor e pelo cuidado na apresentação individual.',
    highlights: [
      'Uva fresca e selecionada',
      'Creme delicado artesanal',
      'Frescor e leveza ideais para eventos',
      'Visual diferenciado e atraente'
    ],
    usage: 'Opção refrescante e diferenciada para qualquer tipo de evento e celebração.',
    profiles: ['frutas', 'refrescante'],
    gradient: 'linear-gradient(145deg, #EEE0F6 0%, #A870CC 60%, #6840A0 100%)',
    icon: '◐',
    searchTerms: 'uva copinho fresco refrescante diferente'
  },

  // ── MINI SOBREMESAS ──────────────────────────────────────────────────────
  {
    id: 19,
    name: 'Mini Brownie com Ganache de Chocolate',
    category: 'mini-sobremesas',
    categoryLabel: 'Mini Sobremesas',
    tag: 'Premium',
    tagType: 'premium',
    shortDesc: 'Brownie artesanal úmido e fudgy coberto com ganache de chocolate belga. Indulgência sofisticada.',
    fullDesc: 'Brownie artesanal de textura úmida e densa, com sabor intenso de chocolate, coberto com ganache de chocolate belga brilhante. Em tamanho individual, cada peça é uma indulgência completa que une a rusticidade do brownie à sofisticação do acabamento gourmet.',
    highlights: [
      'Brownie artesanal de textura úmida e fudgy',
      'Ganache de chocolate belga de acabamento',
      'Porção individual com apresentação sofisticada',
      'Intensidade de chocolate em cada mordida'
    ],
    usage: 'Muito pedido em eventos corporativos, festas adultas e mesas gourmet de alto padrão.',
    profiles: ['chocolate', 'premium'],
    gradient: 'linear-gradient(145deg, #4A2C18 0%, #7A4830 60%, #A06040 100%)',
    icon: '■',
    searchTerms: 'brownie ganache chocolate belga mini sobremesa individual'
  },
  {
    id: 20,
    name: 'Mini Cake Red Velvet',
    category: 'mini-sobremesas',
    categoryLabel: 'Mini Sobremesas',
    tag: 'Tendência',
    tagType: 'trend',
    shortDesc: 'Mini bolo red velvet com cream cheese aveludado. Visual marcante e sabor delicado que encanta.',
    fullDesc: 'Mini bolo red velvet com a icônica massa vermelha aveludada e cobertura de cream cheese artesanal de sabor delicado e suave. Visual marcante e sofisticado em tamanho individual que transforma qualquer mesa de doces em uma vitrine de confeitaria de alto nível.',
    highlights: [
      'Massa red velvet na cor icônica',
      'Cream cheese artesanal aveludado',
      'Visual marcante e absolutamente sofisticado',
      'Grande sucesso em eventos de alto padrão'
    ],
    usage: 'Peça de destaque em casamentos, festas de debutante e eventos sofisticados.',
    profiles: ['premium'],
    gradient: 'linear-gradient(145deg, #F0D4D8 0%, #C04860 60%, #802040 100%)',
    icon: '▲',
    searchTerms: 'red velvet mini cake bolo cream cheese tendencia'
  },

  // ── PALHAS ITALIANAS ─────────────────────────────────────────────────────
  {
    id: 21,
    name: 'Palha Italiana de Avelã',
    category: 'palhas-italianas',
    categoryLabel: 'Palhas Italianas',
    tag: 'Artesanal',
    tagType: 'artisan',
    shortDesc: 'Palha italiana clássica em versão premium com creme de avelã. Crocante por fora, cremosa por dentro.',
    fullDesc: 'Palha italiana artesanal em versão premium com recheio de creme de avelã de qualidade superior. A textura crocante característica da palha contrasta com o interior cremoso e aromático, criando uma experiência sensorial muito agradável e sofisticada.',
    highlights: [
      'Creme de avelã premium de qualidade superior',
      'Textura crocante por fora, cremosa por dentro',
      'Receita artesanal com atenção ao detalhe',
      'Sabor sofisticado e envolvente de avelã'
    ],
    usage: 'Muito apreciada em mesas de festas. Fácil de servir e de alta aceitação.',
    profiles: ['chocolate', 'classicos'],
    gradient: 'linear-gradient(145deg, #F4ECDC 0%, #C09848 60%, #887020 100%)',
    icon: '▪',
    searchTerms: 'palha italiana avela crocante artesanal'
  },
  {
    id: 22,
    name: 'Palha Italiana de Limão Siciliano',
    category: 'palhas-italianas',
    categoryLabel: 'Palhas Italianas',
    tag: 'Refrescante',
    tagType: 'refresh',
    shortDesc: 'Versão cítrica da palha italiana com creme de limão siciliano aromático. Doce com frescor.',
    fullDesc: 'Versão refrescante e cítrica da palha italiana, com creme de limão siciliano de aroma intenso e sabor equilibrado entre o doce e o ácido. Uma opção diferenciada que traz leveza e frescor à mesa, surpreendendo quem prova pela originalidade do sabor.',
    highlights: [
      'Limão siciliano de aroma intenso e fresco',
      'Contraste sofisticado entre doce e ácido',
      'Sabor refrescante e marcante',
      'Opção diferenciada de alta aceitação'
    ],
    usage: 'Ótima para variar a mesa de doces com um toque cítrico refrescante.',
    profiles: ['frutas', 'refrescante'],
    gradient: 'linear-gradient(145deg, #FAFAD8 0%, #D8CC40 60%, #A09010 100%)',
    icon: '▸',
    searchTerms: 'limao siciliano palha italiana cítrico refrescante'
  },
  {
    id: 23,
    name: 'Palha Italiana de Pistache',
    category: 'palhas-italianas',
    categoryLabel: 'Palhas Italianas',
    tag: 'Tendência',
    tagType: 'trend',
    shortDesc: 'Palha italiana com creme de pistache artesanal e cobertura de chocolate. Visual e sabor únicos.',
    fullDesc: 'Palha italiana com creme de pistache artesanal e cobertura de chocolate nobre, combinando a textura característica da palha com o sabor único do pistache. A cor vibrante e o aroma inconfundível fazem desta palha uma das mais elogiadas da seleção premium.',
    highlights: [
      'Creme de pistache artesanal genuíno',
      'Cobertura de chocolate nobre',
      'Visual verde vibrante e apetitoso',
      'Tendência premium da confeitaria atual'
    ],
    usage: 'Peça de destaque em mesas gourmet de eventos sofisticados e casamentos.',
    profiles: ['pistache', 'premium'],
    gradient: 'linear-gradient(145deg, #E4EED8 0%, #88B060 60%, #506830 100%)',
    icon: '▹',
    searchTerms: 'pistache palha italiana tendencia premium verde'
  },

  // ── TARTELETTES ──────────────────────────────────────────────────────────
  {
    id: 24,
    name: 'Tartelette de Frutas do Bosque',
    category: 'tartelettes',
    categoryLabel: 'Tartelettes',
    tag: 'Sofisticado',
    tagType: 'elegant',
    shortDesc: 'Massa amanteigada artesanal com creme pâtissier e frutas do bosque. Confeitaria fina em miniatura.',
    fullDesc: 'Mini tartelette com massa amanteigada crocante artesanal, creme pâtissier clássico aveludado e frutas do bosque frescas ou em geleia artesanal. Cada detalhe é cuidadosamente executado para oferecer a experiência de uma confeitaria francesa fina em tamanho individual.',
    highlights: [
      'Massa amanteigada artesanal crocante',
      'Creme pâtissier clássico aveludado',
      'Frutas do bosque frescas e selecionadas',
      'Visual de confeitaria fina francesa'
    ],
    usage: 'A escolha mais sofisticada para casamentos, bodas de ouro e eventos de alto padrão.',
    profiles: ['frutas', 'premium'],
    gradient: 'linear-gradient(145deg, #EED8F0 0%, #A060B8 60%, #703090 100%)',
    icon: '▣',
    searchTerms: 'tartelette frutas bosque patissier massa amanteigada sofisticado'
  },
  {
    id: 25,
    name: 'Tartelette de Limão',
    category: 'tartelettes',
    categoryLabel: 'Tartelettes',
    tag: 'Clássico',
    tagType: 'classic',
    shortDesc: 'Massa crocante, curd de limão fresco e merengue toastado. Equilíbrio perfeito de sabores.',
    fullDesc: 'Tartelette clássica com massa amanteigada crocante, curd de limão fresco artesanal e merengue toastado na superfície. O equilíbrio perfeito entre a acidez cítrica, a doçura do merengue e a crocância da massa resulta em uma sobremesa memorável e visualmente impecável.',
    highlights: [
      'Curd de limão fresco artesanal',
      'Merengue toastado com acabamento perfeito',
      'Massa amanteigada crocante',
      'Equilíbrio perfeito de sabores e texturas'
    ],
    usage: 'Clássico que nunca sai de moda. Elegante em qualquer tipo de evento e mesa de doces.',
    profiles: ['frutas', 'refrescante', 'classicos'],
    gradient: 'linear-gradient(145deg, #F8F8D8 0%, #D0C840 60%, #988010 100%)',
    icon: '▢',
    searchTerms: 'tartelette limao meringue curd classico crocante'
  }
];
