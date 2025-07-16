export const products = [
  {
    name: "Basic Tee 6-Pack",
    price: "$192",
    images: [
      {
        src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-secondary-product-shot.jpg",
        alt: "Two each of gray, white, and black shirts laying flat.",
      },
      {
        src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg",
        alt: "Model wearing plain black basic tee.",
      },
      {
        src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg",
        alt: "Model wearing plain gray basic tee.",
      },
      {
        src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-featured-product-shot.jpg",
        alt: "Model wearing plain white basic tee.",
      },
    ],
    colors: [
      { name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
      { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
      { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
    ],
    sizes: [
      { name: "XXS", inStock: false },
      { name: "XS", inStock: true },
      { name: "S", inStock: true },
      { name: "M", inStock: true },
      { name: "L", inStock: true },
      { name: "XL", inStock: true },
      { name: "2XL", inStock: true },
      { name: "3XL", inStock: true },
    ],
    description: [
      {
        name: "Description",
        ln: "en",
        text: `The Basic Tee 6-Pack allows you to fully express your vibrant
              personality with three grayscale options. Feeling adventurous? Put on a
              heather gray tee. Want to be a trendsetter? Try our exclusive colorway:
              "Black". Need to add an extra pop of color to your outfit? Our white tee
              has you covered.`,
      },
      {
        name: "Описание",
        ln: "ru",
        text: `Базовая футболка из 6 штук позволяет вам в полной мере выразить свою яркую
              личность с тремя вариантами оттенков серого. Чувствуете себя авантюристом? Наденьте
              серую футболку цвета вереска. Хотите быть законодателем моды? Попробуйте нашу эксклюзивную
              цветовую гамму: "Черный". Нужно добавить дополнительный яркий акцент в ваш наряд? Наша белая
              футболка подойдет.`,
      },
    ],
    highlights: [
      {
        name: "Highlights",
        ln: "en",
        text: [
          "Hand cut and sewn locally",
          "Dyed with our proprietary colors",
          "Pre-washed & pre-shrunk",
          "Ultra-soft 100% cotton",
        ],
      },
      {
        name: "Основные моменты",
        ln: "ru",
        text: [
          "Скроено и сшито вручную на месте",
          "Окрашено в наши фирменные цвета",
          "Предварительно вымытые и предварительно усаженные",
          "Ультрамягкий 100% хлопок",
        ],
      },
    ],
    details: [
      {
        name: "Details",
        ln: "en",
        text: `The 6-Pack includes two black, two white, and two heather
            gray Basic Tees. Sign up for our subscription service and be
            the first to get new, exciting colors, like our upcoming "Charcoal Gray"
            limited release.`,
      },
      {
        name: "Детали",
        ln: "ru",
        text: `В набор из 6 футболок входят две черные, две белые и две серые футболки
              Basic Tees. Подпишитесь на нашу подписку и станьте
              первыми, кто получит новые, захватывающие цвета, например,
              наш предстоящий ограниченный релиз «Charcoal Gray»`,
      },
    ],
    reviews: {
      href: "#",
      average: 4,
      totalCount: 117,
    },
  },
  {
    name: "Basic Tee",
    price: "$35",
    images: [
      {
        src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-featured-product-shot.jpg",
        alt: "description1",
      },
      {
        src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-product-shot-01.jpg",
        alt: "description2",
      },
      {
        src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-product-shot-02.jpg",
        alt: "description3",
      },
    ],
    colors: [
      { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
      { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
    ],
    sizes: [
      { name: "XXS", inStock: false },
      { name: "XS", inStock: true },
      { name: "S", inStock: true },
      { name: "M", inStock: true },
      { name: "L", inStock: true },
      { name: "XL", inStock: true },
    ],
    description: [
      {
        name: "Description",
        ln: "en",
        text: `The Basic tee is an honest new take on a classic. The tee uses super soft,
              pre-shrunk cotton for true comfort and a dependable fit. They are hand cut and sewn locally,
              with a special dye technique that gives each tee itn's own look.`,
      },
      {
        name: "Описание",
        ln: "ru",
        text: `Футболка Basic — это честный новый взгляд на классику. Футболка изготовлена из супермягкого,
              предварительно усаженного хлопка для настоящего комфорта и надежной посадки. Они раскраиваются и шьются вручную на месте,
              с использованием специальной техники окрашивания, которая придает каждой футболке свой собственный вид.`,
      },
    ],
    highlights: [
      {
        name: "Highlights",
        ln: "en",
        text: [
          "Only the best materials",
          "Ethically and locally made",
          "Pre-washed and pre-shrunk",
          "Machine wash cold with similar colors",
        ],
      },
      {
        name: "Основные моменты",
        ln: "ru",
        text: [
          "Только лучшие материалы",
          "Этично и локально произведено",
          "Предварительно вымытые и предварительно усаженные",
          "Машинная стирка в холодной воде с вещами похожих цветов",
        ],
      },
    ],
    details: [
      {
        name: "Details",
        ln: "en",
        text: `The 6-Pack includes two black, two white, and two heather gray Basic Tees.
              Sign up for our subscription service and be the first to get new, exciting colors,
              like our upcoming "Charcoal Gray" limited release.`,
      },
      {
        name: "Детали",
        ln: "ru",
        text: `В набор из 6 футболок входят две черные, две белые и две серо-лиловые футболки Basic Tees.
              Подпишитесь на нашу подписку и станьте первым, кто получит новые, захватывающие цвета,
              например, наш предстоящий ограниченный релиз «Charcoal Gray»`,
      },
    ],
    reviews: {
      href: "#",
      average: 3.5,
      totalCount: 512,
    },
  },
];
