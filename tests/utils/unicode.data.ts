interface Pangram {
  readonly text: string
  readonly size: number
}

export const pangrams: Record<string, Pangram | Array<Pangram>> = {
  // Danish
  da: {
    text: `Quizdeltagerne spiste jordbær med fløde, mens cirkusklovnen Wolther spillede på xylofon`,
    size: 90
  },

  // English
  en: {
    text: `The quick brown fox jumps over the lazy dog`,
    size: 43
  },

  // French
  fr: [
    {
      text: `Portez ce vieux whisky au juge blond qui fume sur son île intérieure, à côté de l'alcôve ovoïde, où les bûches se consument dans l'âtre, ce qui lui permet de penser à la cænogenèse de l'être dont il est question dans la cause ambiguë entendue à Moÿ, dans un capharnaüm qui, pense-t-il, diminue çà et là la qualité de son œuvre`,
      size: 349
    },
    {
      text: `l'île exiguë Où l'obèse jury mûr Fête l'haï volapük, Âne ex aéquo au whist, Ôtez ce vœu déçu`,
      size: 106
    },
    {
      text: `Le cœur déçu mais l'âme plutôt naïve, Louÿs rêva de crapaüter en canoë au delà des îles, près du mälström où brûlent les novæ`,
      size: 143
    }
  ],

  // German
  de: [
    {
      text: `Falsches Üben von Xylophonmusik quält jeden größeren Zwerg`,
      size: 62
    },
    {
      text: `Zwölf Boxkämpfer jagten Eva quer über den Sylter Deich`,
      size: 57
    },
    {
      text: `Heizölrückstoßabdämpfung`,
      size: 28
    }
  ],

  // Hebrew
  iw: {
    text: `דג סקרן שט בים מאוכזב ולפתע מצא לו חברה איך הקליטה`,
    size: 90
  },

  // Hungarian
  hu: {
    text: `Árvíztűrő tükörfúrógép`,
    size: 31
  },

  // Icelandic
  is: [
    {
      text: `Kæmi ný öxi hér ykist þjófum nú bæði víl og ádrepa`,
      size: 61
    },
    {
      text: `Sævör grét áðan því úlpan var ónýt`,
      size: 44
    }
  ],

  // Irish Gaelic
  ga: {
    text: `D'fhuascail Íosa, Úrmhac na hÓighe Beannaithe, pór Éava agus Ádhaimh`,
    size: 74
  },

  // Japanese
  ja: [
    {
      text: `いろはにほへとちりぬるを
わかよたれそつねならむ
うゐのおくやまけふこえて
あさきゆめみしゑひもせす`,
      size: 144
    },
    {
      text: `イロハニホヘト チリヌルヲ ワカヨタレソ ツネナラム
ウヰノオクヤマ ケフコエテ アサキユメミシ ヱヒモセスン`,
      size: 151
    }
  ],

  // Polish
  pl: {
    text: `Pchnąć w tę łódź jeża lub ośm skrzyń fig`,
    size: 49
  },

  // Russian
  ru: {
    text: `В чащах юга жил бы цитрус? Да, но фальшивый экземпляр!`,
    size: 96
  },

  // Spanish
  es: {
    text: `El pingüino Wenceslao hizo kilómetros bajo exhaustiva lluvia y frío, añoraba a su querido cachorro`,
    size: 102
  }
}
