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

    // === Astoria ===
    {
      alias: "quick-reef",
      body: "To souvlaki sto Ditmars einai to kalytero. O kyrios pou to kanei einai apo Thessaloniki. Pame olo to Savvato.",
      lang: "el",
      hood: "astoria",
      tenure: "born",
    },
    {
      alias: "true-coast",
      body: "المقهى المصري الجديد على شارع Steinway فيه شيشة وأكل بيتي. الأسعار معقولة والأجواء حلوة.",
      lang: "ar",
      hood: "astoria",
      tenure: "rooted",
    },
    {
      alias: "calm-anchor",
      body: "O salao brasileiro na 30th Ave faz sobrancelha por $10 e a dona ajuda com traducao de documentos se voce pedir.",
      lang: "pt",
      hood: "astoria",
      tenure: "settled",
    },
    {
      alias: "clear-bay",
      body: "Anyone know a good immigration lawyer around here? Need to renew my work permit and the one on Broadway quoted me $3000 which seems insane.",
      lang: "en",
      hood: "astoria",
      tenure: "new",
    },

    // === Corona ===
    {
      alias: "deep-sun",
      body: "La senora que vende tamales en la Roosevelt y la 104 esta ahi todos los domingos temprano. Los de rajas son los mejores.",
      lang: "es",
      hood: "corona",
      tenure: "born",
    },
    {
      alias: "warm-stone",
      body: "有人知道Corona附近哪里可以学英语吗？免费的最好。我刚来两个月，什么都不懂。",
      lang: "zh",
      hood: "corona",
      tenure: "new",
    },
    {
      alias: "soft-rain",
      body: "Cuidado con el taller mecanico en la Junction. Me cobraron $500 por algo que otro lugar hizo por $150. No vayan ahi.",
      lang: "es",
      hood: "corona",
      tenure: "settled",
    },
    {
      alias: "keen-hill",
      body: "The library on 104th has free tax prep every Saturday until April. They speak Spanish and Mandarin. No appointment needed.",
      lang: "en",
      hood: "corona",
      tenure: "rooted",
    },

    // === East Harlem ===
    {
      alias: "bold-wave",
      body: "La alcapurria de la senora en la 116 y Lexington es la mejor del barrio. Llega antes del mediodia porque se acaban.",
      lang: "es",
      hood: "east-harlem",
      tenure: "born",
    },
    {
      alias: "steady-peak",
      body: "Rent stabilized apartment on 118th just went up $200 and they're saying it's legal. Is that right? Who do I call?",
      lang: "en",
      hood: "east-harlem",
      tenure: "settled",
    },
    {
      alias: "free-cloud",
      body: "La clinica en la 117 y la 3ra atiende sin seguro medico. Hablan espanol y no piden papeles. Mi familia va ahi desde hace anos.",
      lang: "es",
      hood: "east-harlem",
      tenure: "rooted",
    },
    {
      alias: "wide-spark",
      body: "Cherche quelqu'un qui parle francais dans le quartier. Je viens d'arriver du Senegal et je ne connais personne ici.",
      lang: "fr",
      hood: "east-harlem",
      tenure: "new",
    },

    // === NEW: Bengali posts (Jackson Heights / Astoria) ===
    {
      alias: "still-river",
      body: "74th Street এ নতুন একটা গ্রোসারি খুলেছে, দাম অনেক কম। SSN ছাড়াই ফোন প্ল্যান পাওয়া যায়।",
      lang: "bn",
      hood: "jackson-heights",
      tenure: "new",
    },
    {
      alias: "soft-wind",
      body: "37th Ave এর রিয়েলটি অফিসে সাইন করবেন না। সাইন করার পরে অতিরিক্ত ফি যোগ করে।",
      lang: "bn",
      hood: "jackson-heights",
      tenure: "settled",
    },
    {
      alias: "warm-rain",
      body: "কেউ কি জানেন কোথায় ফ্রি ইংরেজি ক্লাস পাওয়া যায়? আমি সবে এসেছি, কিছুই বুঝি না।",
      lang: "bn",
      hood: "jackson-heights",
      tenure: "new",
    },
    {
      alias: "clear-moon",
      body: "Astoria তে ভালো ইমিগ্রেশন উকিল কে চেনেন? ওয়ার্ক পার্মিট রিনিউ করতে হবে।",
      lang: "bn",
      hood: "astoria",
      tenure: "settled",
    },

    // === NEW: Tagalog posts (Jackson Heights / Bushwick) ===
    {
      alias: "bright-shore",
      body: "Yung dentista sa Roosevelt Ave mura lang, $80 cleaning. Magaling siya at matiyaga kahit di ka marunong mag-English.",
      lang: "tl",
      hood: "jackson-heights",
      tenure: "settled",
    },
    {
      alias: "kind-wave",
      body: "Mag-ingat sa realty office sa 37th Ave. May mga hidden fees pagkatapos pumirma. Nangyari sa kapitbahay ko.",
      lang: "tl",
      hood: "jackson-heights",
      tenure: "rooted",
    },
    {
      alias: "free-sail",
      body: "May libreng ESL class sa simbahan tuwing Sabado. Tumatanggap din sila ng kahit anong wika. Maganda ang turo.",
      lang: "tl",
      hood: "bushwick",
      tenure: "new",
    },
    {
      alias: "swift-palm",
      body: "Ang community fridge sa Willoughby lagi namang puno. Nagdadala ako ng gulay tuwing Sabado. Kung gusto nyo tumulong, punta lang.",
      lang: "tl",
      hood: "bushwick",
      tenure: "settled",
    },

    // === NEW: Russian posts (Flushing / Sunset Park) ===
    {
      alias: "cold-star",
      body: "В библиотеке Флашинга бесплатные курсы английского и помощь с документами на гражданство. Персонал говорит по-русски.",
      lang: "ru",
      hood: "flushing",
      tenure: "settled",
    },
    {
      alias: "deep-frost",
      body: "Механик на Bowne St честный. Взял $300 за тормоза, другие просили $800. Спросите Майка.",
      lang: "ru",
      hood: "flushing",
      tenure: "rooted",
    },
    {
      alias: "north-light",
      body: "Аренда выросла на $400, а хозяин ничего не чинит. Кто знает куда жаловаться чтобы не было проблем?",
      lang: "ru",
      hood: "sunset-park",
      tenure: "new",
    },
    {
      alias: "pale-bridge",
      body: "На 8th Avenue есть китайская ассоциация, они помогают с работой и переводом документов бесплатно. Не только для китайцев.",
      lang: "ru",
      hood: "sunset-park",
      tenure: "settled",
    },

    // === NEW: More Hindi (Jackson Heights) ===
    {
      alias: "warm-gate",
      body: "Roosevelt Ave pe dentist bahut sasta hai, $80 mein cleaning. Bahut achha hai, English nahi aati toh bhi koi problem nahi.",
      lang: "hi",
      hood: "jackson-heights",
      tenure: "rooted",
    },

    // === NEW: More Arabic (Astoria / Sunset Park) ===
    {
      alias: "gold-arch",
      body: "محامي الهجرة على Broadway بيطلب ٣٠٠٠ دولار لتجديد تصريح العمل. ده كتير اوي. حد يعرف حد ارخص؟",
      lang: "ar",
      hood: "astoria",
      tenure: "new",
    },
    {
      alias: "red-sand",
      body: "الإيجار زاد ٤٠٠ دولار والمالك مش بيصلح حاجة. مفيش مية سخنة من اسبوعين. حد يعرف نشتكي فين؟",
      lang: "ar",
      hood: "sunset-park",
      tenure: "settled",
    },

    // === NEW: More French (East Harlem / Washington Heights) ===
    {
      alias: "blue-wing",
      body: "La clinique sur la 117e rue accepte les patients sans assurance. Ils parlent espagnol et un peu francais. Pas besoin de papiers.",
      lang: "fr",
      hood: "east-harlem",
      tenure: "settled",
    },
    {
      alias: "dark-root",
      body: "Le loyer a augmente de 200 dollars et ils disent que c'est legal. Quelqu'un connait un avocat gratuit pour les locataires?",
      lang: "fr",
      hood: "east-harlem",
      tenure: "new",
    },
    {
      alias: "green-leaf",
      body: "Il y a des cours d'anglais gratuits a l'eglise sur la 181e rue. Ma femme y va et c'est tres bien. Ils aident aussi avec les formulaires.",
      lang: "fr",
      hood: "washington-heights",
      tenure: "new",
    },

    // === NEW: More Korean (Flushing) ===
    {
      alias: "calm-peak",
      body: "플러싱 도서관에서 무료 시민권 시험 준비반 있어요. 러시아어, 중국어, 한국어 다 돼요. 토요일 오전에 가세요.",
      lang: "ko",
      hood: "flushing",
      tenure: "settled",
    },

    // === NEW: More Nepali (Jackson Heights) ===
    {
      alias: "high-trail",
      body: "37th Ave मा भएको रियल्टी अफिसमा साइन नगर्नुहोस्। साइन गरेपछि थप शुल्क थप्छन्।",
      lang: "ne",
      hood: "jackson-heights",
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
    // Astoria
    22: [{ type: "street", value: "ditmars" }, { type: "business", value: "souvlaki shop" }],
    23: [{ type: "street", value: "steinway" }, { type: "business", value: "egyptian cafe" }],
    24: [{ type: "street", value: "30th ave" }, { type: "issue", value: "document help" }],
    25: [{ type: "issue", value: "immigration lawyer" }, { type: "issue", value: "work permit" }],
    // Corona
    26: [{ type: "street", value: "roosevelt and 104th" }, { type: "business", value: "tamale vendor" }],
    27: [{ type: "issue", value: "free esl" }, { type: "issue", value: "new arrival" }],
    28: [{ type: "business", value: "mechanic on junction" }, { type: "issue", value: "overcharging" }],
    29: [{ type: "org", value: "library on 104th" }, { type: "issue", value: "free tax prep" }],
    // East Harlem
    30: [{ type: "street", value: "116th and lexington" }, { type: "business", value: "alcapurria vendor" }],
    31: [{ type: "issue", value: "rent increase" }, { type: "issue", value: "rent stabilized" }],
    32: [{ type: "street", value: "117th and 3rd" }, { type: "org", value: "clinic" }, { type: "issue", value: "healthcare no insurance" }],
    33: [{ type: "issue", value: "new arrival" }, { type: "issue", value: "french speakers" }],
    // Bengali
    34: [{ type: "street", value: "74th street" }, { type: "issue", value: "phone plan no ssn" }],
    35: [{ type: "street", value: "37th ave" }, { type: "issue", value: "hidden fees" }, { type: "issue", value: "rental scam" }],
    36: [{ type: "issue", value: "free esl" }, { type: "issue", value: "new arrival" }],
    37: [{ type: "issue", value: "immigration lawyer" }, { type: "issue", value: "work permit" }],
    // Tagalog
    38: [{ type: "street", value: "roosevelt ave" }, { type: "issue", value: "dentist" }],
    39: [{ type: "street", value: "37th ave" }, { type: "issue", value: "hidden fees" }, { type: "issue", value: "rental scam" }],
    40: [{ type: "issue", value: "free esl" }],
    41: [{ type: "street", value: "willoughby ave" }, { type: "org", value: "community fridge" }],
    // Russian
    42: [{ type: "org", value: "flushing library" }, { type: "issue", value: "free esl" }, { type: "issue", value: "citizenship prep" }],
    43: [{ type: "street", value: "bowne st" }, { type: "business", value: "mechanic" }],
    44: [{ type: "issue", value: "rent increase" }, { type: "issue", value: "landlord neglect" }],
    45: [{ type: "street", value: "8th avenue" }, { type: "issue", value: "job help" }, { type: "issue", value: "document help" }],
    // Hindi
    46: [{ type: "street", value: "roosevelt ave" }, { type: "issue", value: "dentist" }],
    // Arabic
    47: [{ type: "issue", value: "immigration lawyer" }, { type: "issue", value: "work permit" }, { type: "issue", value: "overcharging" }],
    48: [{ type: "issue", value: "rent increase" }, { type: "issue", value: "landlord neglect" }, { type: "issue", value: "no hot water" }],
    // French
    49: [{ type: "street", value: "117th and 3rd" }, { type: "org", value: "clinic" }, { type: "issue", value: "healthcare no insurance" }],
    50: [{ type: "issue", value: "rent increase" }, { type: "issue", value: "rent stabilized" }],
    51: [{ type: "street", value: "181st street" }, { type: "issue", value: "free esl" }],
    // Korean
    52: [{ type: "org", value: "flushing library" }, { type: "issue", value: "citizenship prep" }, { type: "issue", value: "free esl" }],
    // Nepali
    53: [{ type: "street", value: "37th ave" }, { type: "issue", value: "hidden fees" }, { type: "issue", value: "rental scam" }],
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

    // Astoria
    {
      name: "Taverna Kyclades",
      description_original:
        "To kalytero psari stin Astoria. Ftini timi, megales merides. Ela noris to Savvatokiriako.",
      source_lang: "el",
      category: "food",
      hood: "astoria",
      address: "Ditmars Blvd",
      source: "seed",
    },
    {
      name: "Steinway Hookah & Cafe",
      description_original:
        "شيشة وقهوة عربية. مكان مريح للجالية العربية. مفتوح لغاية 2 الليل.",
      source_lang: "ar",
      category: "nightlife",
      hood: "astoria",
      address: "Steinway St",
      source: "seed",
    },
    {
      name: "Astoria Immigration Legal Services",
      description_original:
        "Free consultations for work permits, green cards, asylum. Greek, Arabic, Spanish, English. Walk-ins Thursday.",
      source_lang: "en",
      category: "services",
      hood: "astoria",
      address: "Broadway",
      source: "seed",
    },

    // Corona
    {
      name: "Corona Public Library",
      description_original:
        "Clases de ingles gratis. Preparacion de impuestos los sabados. Computadoras disponibles. No necesitas tarjeta de biblioteca.",
      source_lang: "es",
      category: "community",
      hood: "corona",
      address: "104th Street",
      source: "seed",
    },
    {
      name: "Taqueria La Esquina",
      description_original:
        "Tacos al pastor, tamales, y aguas frescas. La senora tambien vende champurrado en invierno.",
      source_lang: "es",
      category: "food",
      hood: "corona",
      address: "Roosevelt Ave",
      source: "seed",
    },

    // East Harlem
    {
      name: "Boriken Health Center",
      description_original:
        "Atencion medica sin seguro. Hablan espanol. No piden documentos de inmigracion. Aceptan pago en escala.",
      source_lang: "es",
      category: "health",
      hood: "east-harlem",
      address: "117th Street",
      source: "seed",
    },
    {
      name: "East Harlem Tenant Advocacy",
      description_original:
        "Free help with rent stabilization questions, eviction defense, landlord complaints. English and Spanish.",
      source_lang: "en",
      category: "services",
      hood: "east-harlem",
      address: "116th Street",
      source: "seed",
    },
  ];

  for (const d of directory) {
    createDirectoryEntry(d);
  }

  return { status: "seeded", posts: posts.length, directory: directory.length };
}
