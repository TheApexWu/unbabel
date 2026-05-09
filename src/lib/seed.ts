import { createPost, createDirectoryEntry, insertEntities, db } from "./db";

/**
 * Seed the database with realistic posts carrying real neighborhood signal.
 * These aren't "hello world" -- they're the kind of informal knowledge
 * that changes someone's week.
 */
export function seedDatabase() {
  const count = db.prepare("SELECT COUNT(*) as c FROM posts").get() as {
    c: number;
  };
  if (count.c > 0) return { status: "already seeded" };

  const posts = [
    // === Jackson Heights ===
    {
      alias: "calm-sparrow",
      body: "Alguien sabe de un dentista barato? Mi hijo tiene dolor de muela y en el hospital me dijeron 3 semanas de espera.",
      lang: "es",
      hood: "jackson-heights",
      tenure: "settled",
    },
    {
      alias: "bright-river",
      body: "यो नयाँ मोमो पसल Roosevelt मा खुलेको छ, एकदम मिठो छ, जाँदै जानुहोस्",
      lang: "ne",
      hood: "jackson-heights",
      tenure: "rooted",
    },
    {
      alias: "swift-lantern",
      body: "Do NOT sign anything at the realty office on 37th Ave. They add fees after you sign and then say it was in the contract. Happened to two people in my building.",
      lang: "en",
      hood: "jackson-heights",
      tenure: "settled",
    },
    {
      alias: "keen-harbor",
      body: "74th street pe jo naya grocery store khula hai, wahan desi cheezein bahut sasti milti hain. phone plan bhi bina SSN ke milta hai.",
      lang: "hi",
      hood: "jackson-heights",
      tenure: "rooted",
    },
    {
      alias: "gentle-bridge",
      body: "La iglesia en la 82 tiene clases de ingles gratis los sabados 10am. Mi esposa fue y dice que son muy buenos. Tambien ayudan con formularios.",
      lang: "es",
      hood: "jackson-heights",
      tenure: "born",
    },

    // === Flushing ===
    {
      alias: "deep-compass",
      body: "新开的饺子馆比老四川还好吃，老板娘是福建人，会帮忙翻译文件，不收钱",
      lang: "zh",
      hood: "flushing",
      tenure: "rooted",
    },
    {
      alias: "warm-feather",
      body: "메인 스트리트 세탁소 아저씨가 이력서 영어 교정해줘요. 세탁 맡기면서 부탁하면 됩니다. 진짜 좋은 분.",
      lang: "ko",
      hood: "flushing",
      tenure: "settled",
    },
    {
      alias: "clear-tide",
      body: "图书馆周六有免费的公民考试辅导班，还有人帮忙练习面试英语。去早一点，位子不多。",
      lang: "zh",
      hood: "flushing",
      tenure: "new",
    },
    {
      alias: "sharp-anchor",
      body: "The mechanic on Bowne St is honest. Quoted me $300 for brakes, other place wanted $800. Ask for Mike, he explains what he's doing.",
      lang: "en",
      hood: "flushing",
      tenure: "settled",
    },
    {
      alias: "open-garden",
      body: "이 동네에서 아이 맡길 곳 찾고 있어요. 정식 데이케어 아니어도 괜찮아요. 신뢰할 수 있는 분이면 됩니다.",
      lang: "ko",
      hood: "flushing",
      tenure: "new",
    },

    // === Washington Heights ===
    {
      alias: "bold-flame",
      body: "El super del edificio en la 175 no arregla nada. Llevamos 2 semanas sin agua caliente. Alguien sabe como reportar esto sin que te metan en problemas?",
      lang: "es",
      hood: "washington-heights",
      tenure: "settled",
    },
    {
      alias: "free-window",
      body: "Hay alguna mama en el barrio que quiera practicar ingles juntas? Acabo de llegar de Santo Domingo y no conozco a nadie. Tengo una nina de 4.",
      lang: "es",
      hood: "washington-heights",
      tenure: "new",
    },
    {
      alias: "steady-bell",
      body: "Free immigration legal clinic every Thursday at St. Joan of Arc basement on 181st. No appointment, no ID needed. They speak Spanish, Hindi, Urdu.",
      lang: "en",
      hood: "washington-heights",
      tenure: "rooted",
    },
    {
      alias: "true-ember",
      body: "Cuidado con la lavanderia nueva en Broadway. Te cobran por peso pero la bascula esta mal. Fui dos veces y siempre pesa de mas.",
      lang: "es",
      hood: "washington-heights",
      tenure: "rooted",
    },

    // === Sunset Park ===
    {
      alias: "cool-stone",
      body: "八大道上新开了一家福建菜馆，海蛎饼跟老家一样。老板说可以帮新来的老乡找工作，厨房或装修都有。",
      lang: "zh",
      hood: "sunset-park",
      tenure: "rooted",
    },
    {
      alias: "wide-branch",
      body: "Cuidado con el cruce de la 5ta y la 45. Casi me atropellan dos veces esta semana. No hay senal de pare y los carros van rapido.",
      lang: "es",
      hood: "sunset-park",
      tenure: "settled",
    },
    {
      alias: "fair-leaf",
      body: "这附近有没有好的中医？腰疼了好几天了。最好是能说福建话的。",
      lang: "zh",
      hood: "sunset-park",
      tenure: "new",
    },
    {
      alias: "quick-cloud",
      body: "If anyone needs work boots or safety gear cheap, the surplus store on 4th Ave has good stuff. They don't ask questions and take cash.",
      lang: "en",
      hood: "sunset-park",
      tenure: "born",
    },

    // === Bushwick ===
    {
      alias: "soft-horizon",
      body: "Rent went up $400 and my landlord won't fix the heat. The tenant rights org on Myrtle helped me file a complaint for free. Ask for Maria.",
      lang: "en",
      hood: "bushwick",
      tenure: "settled",
    },
    {
      alias: "keen-fountain",
      body: "La bodega de Myrtle tiene los mejores tamales los domingos por la manana. Llega antes de las 9 porque se acaban rapido. La senora tambien vende atole.",
      lang: "es",
      hood: "bushwick",
      tenure: "born",
    },
    {
      alias: "gentle-stone",
      body: "Is the community fridge on Willoughby still getting stocked? I can bring extra produce on Saturdays if someone coordinates.",
      lang: "en",
      hood: "bushwick",
      tenure: "new",
    },
    {
      alias: "bright-bell",
      body: "Busco alguien que me ayude a practicar ingles. Yo puedo ayudar con espanol. No tengo dinero para clases pero aprendo rapido.",
      lang: "es",
      hood: "bushwick",
      tenure: "settled",
    },
  ];

  // Entity map keyed by post index (0-based), pre-computed for demo
  const SEED_ENTITIES: Record<number, { type: string; value: string }[]> = {
    0: [{ type: "issue", value: "dentist" }, { type: "issue", value: "dental pain" }],
    1: [{ type: "street", value: "roosevelt ave" }, { type: "business", value: "momo shop" }],
    2: [{ type: "street", value: "37th ave" }, { type: "issue", value: "hidden fees" }, { type: "issue", value: "rental scam" }],
    3: [{ type: "street", value: "74th street" }, { type: "issue", value: "phone plan no ssn" }],
    4: [{ type: "org", value: "church on 82nd" }, { type: "issue", value: "free esl" }],
    5: [{ type: "business", value: "dumpling restaurant" }, { type: "issue", value: "document help" }],
    6: [{ type: "business", value: "main street laundromat" }, { type: "issue", value: "resume help" }],
    7: [{ type: "org", value: "flushing library" }, { type: "issue", value: "citizenship prep" }, { type: "issue", value: "free esl" }],
    8: [{ type: "street", value: "bowne st" }, { type: "business", value: "mechanic" }],
    9: [{ type: "issue", value: "childcare" }],
    10: [{ type: "street", value: "175th street" }, { type: "issue", value: "no hot water" }, { type: "issue", value: "landlord neglect" }],
    11: [{ type: "issue", value: "new arrival" }],
    12: [{ type: "org", value: "st joan of arc" }, { type: "street", value: "181st street" }, { type: "issue", value: "free legal clinic" }],
    13: [{ type: "street", value: "broadway" }, { type: "business", value: "laundromat" }, { type: "issue", value: "overcharging" }],
    14: [{ type: "street", value: "8th avenue" }, { type: "issue", value: "job help" }],
    15: [{ type: "street", value: "5th ave and 45th" }, { type: "issue", value: "dangerous intersection" }],
    16: [{ type: "issue", value: "chinese medicine" }],
    17: [{ type: "street", value: "4th ave" }, { type: "business", value: "surplus store" }],
    18: [{ type: "issue", value: "rent increase" }, { type: "issue", value: "landlord neglect" }, { type: "org", value: "tenant rights org on myrtle" }],
    19: [{ type: "street", value: "myrtle ave" }, { type: "business", value: "bodega" }],
    20: [{ type: "street", value: "willoughby ave" }, { type: "org", value: "community fridge" }],
    21: [{ type: "issue", value: "language exchange" }, { type: "issue", value: "free esl" }],
  };

  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    const result = createPost(p.alias, p.body, p.lang, p.hood, p.tenure);
    const postId = result.lastInsertRowid as number;

    const entities = SEED_ENTITIES[i];
    if (entities && entities.length > 0) {
      insertEntities(postId, entities, p.hood, p.lang);
    }
  }

  // --- Directory entries ---
  const directory = [
    // Jackson Heights
    {
      name: "Iglesia Pentecostal de Jackson Heights",
      description_original:
        "Servicios en espanol, ingles y tagalog. Clases de ESL sabados 10am. Tablon de empleos en el sotano. Ayuda con formularios de inmigracion.",
      source_lang: "es",
      category: "community",
      hood: "jackson-heights",
      address: "Roosevelt Ave",
      source: "seed",
    },
    {
      name: "Himalayan Grocery & Spices",
      description_original:
        "नेपाली, भारतीय र तिब्बती मसला। ताजा तरकारी हरेक दिन। फोन प्लान पनि छ।",
      source_lang: "ne",
      category: "food",
      hood: "jackson-heights",
      address: "74th Street",
      source: "seed",
    },
    {
      name: "Jackson Heights Legal Aid",
      description_original:
        "Free immigration consultations. Walk-ins Wednesday 2-6pm. Hindi, Urdu, Spanish, English. No ID required.",
      source_lang: "en",
      category: "services",
      hood: "jackson-heights",
      address: "37th Avenue",
      source: "seed",
    },
    {
      name: "La Pequena Colombia Bakery",
      description_original:
        "Pan de bono, empanadas, y el mejor cafe colombiano del barrio. Abierto desde las 6am.",
      source_lang: "es",
      category: "food",
      hood: "jackson-heights",
      address: "Roosevelt Ave",
      source: "seed",
    },

    // Flushing
    {
      name: "金丰大酒楼 Golden Imperial Palace",
      description_original: "早茶每天供应。周末排队要早来。已经开了二十年了。",
      source_lang: "zh",
      category: "food",
      hood: "flushing",
      address: "Main Street",
      source: "seed",
    },
    {
      name: "한마음 교회 One Heart Church",
      description_original:
        "한국어 예배 일요일 11시. 새로 온 분들 환영합니다. 주중 한국어 수업, 이력서 도움도 있습니다.",
      source_lang: "ko",
      category: "community",
      hood: "flushing",
      address: "Northern Blvd",
      source: "seed",
    },
    {
      name: "Flushing Library - New Americans Program",
      description_original:
        "Free citizenship prep classes, ESL, computer literacy. Chinese, Korean, Spanish staff. No library card needed to attend.",
      source_lang: "en",
      category: "community",
      hood: "flushing",
      address: "Main Street",
      source: "seed",
    },
    {
      name: "王记汇款 Wang's Remittance",
      description_original:
        "汇款到中国大陆、台湾、香港。手续费最低。也帮忙翻译文件。",
      source_lang: "zh",
      category: "services",
      hood: "flushing",
      address: "41st Avenue",
      source: "seed",
    },

    // Washington Heights
    {
      name: "Iglesia Adventista del Septimo Dia",
      description_original:
        "Servicios en espanol. Despensa de alimentos cada viernes. Ayuda con formularios de inmigracion. No preguntan estatus.",
      source_lang: "es",
      category: "community",
      hood: "washington-heights",
      address: "181st Street",
      source: "seed",
    },
    {
      name: "Barberia Don Ramon",
      description_original:
        "La mejor barberia dominicana. Cortes desde $15. Pregunta por Ramon.",
      source_lang: "es",
      category: "services",
      hood: "washington-heights",
      address: "St. Nicholas Ave",
      source: "seed",
    },
    {
      name: "DYCD Youth Center Heights",
      description_original:
        "After-school tutoring, college prep, job training for 14-24. Free. English and Spanish staff.",
      source_lang: "en",
      category: "community",
      hood: "washington-heights",
      address: "175th Street",
      source: "seed",
    },

    // Sunset Park
    {
      name: "福建同乡会 Fujianese Association",
      description_original:
        "帮助新来的福建老乡。找工作、租房、翻译文件都可以来问。不收费。",
      source_lang: "zh",
      category: "community",
      hood: "sunset-park",
      address: "8th Avenue",
      source: "seed",
    },
    {
      name: "Halal Meat Market",
      description_original:
        "Fresh halal meat daily. Best prices on 5th Ave. Middle Eastern spices and bread. Cash accepted.",
      source_lang: "en",
      category: "food",
      hood: "sunset-park",
      address: "5th Avenue",
      source: "seed",
    },
    {
      name: "Centro de Trabajadores",
      description_original:
        "Ayuda con derechos laborales, salarios robados, condiciones de trabajo. Todo confidencial. No preguntan estatus.",
      source_lang: "es",
      category: "services",
      hood: "sunset-park",
      address: "4th Avenue",
      source: "seed",
    },

    // Bushwick
    {
      name: "Bushwick Community Fridge",
      description_original:
        "Take what you need, leave what you can. Restocked daily by volunteers. Corner of Willoughby.",
      source_lang: "en",
      category: "community",
      hood: "bushwick",
      address: "Willoughby Ave",
      source: "seed",
    },
    {
      name: "La Morada Restaurant & Community Space",
      description_original:
        "Comida oaxaquena. Eventos comunitarios y ayuda legal para inmigrantes. Preguntar por la familia.",
      source_lang: "es",
      category: "food",
      hood: "bushwick",
      address: "Myrtle Ave",
      source: "seed",
    },
  ];

  for (const d of directory) {
    createDirectoryEntry(d);
  }

  return { status: "seeded", posts: posts.length, directory: directory.length };
}
