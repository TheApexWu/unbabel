import { createPost, createDirectoryEntry, insertEntities, addBookmark, db } from "./db";

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

    // === Elmhurst === (indices 54-57)
    {
      alias: "fast-drum",
      body: "El landlord subio la renta $350 sin aviso. Alguien sabe si eso es legal? Llevo 4 anos en el mismo apartamento.",
      lang: "es",
      hood: "elmhurst",
      tenure: "settled",
    },
    {
      alias: "still-lotus",
      body: "Broadway上面新开了一家免费ESL班，周三和周五晚上。老师很有耐心，推荐给刚来的朋友。",
      lang: "zh",
      hood: "elmhurst",
      tenure: "rooted",
    },
    {
      alias: "kind-leaf",
      body: "আমার বিল্ডিংয়ে ইঁদুরের সমস্যা খুব খারাপ। ল্যান্ডলর্ড কিছু করছে না। কোথায় অভিযোগ করতে পারি?",
      lang: "bn",
      hood: "elmhurst",
      tenure: "new",
    },
    {
      alias: "bold-reef",
      body: "May free ESL class sa simbahan malapit sa Queens Center Mall. Monday at Wednesday 6pm. Maganda para sa mga bagong dating.",
      lang: "tl",
      hood: "elmhurst",
      tenure: "settled",
    },

    // === Chinatown === (indices 58-60)
    {
      alias: "old-lantern",
      body: "东百老汇那边有个办公室帮忙填表格，报税和申请福利都行。不收钱，说中文就行。",
      lang: "zh",
      hood: "chinatown",
      tenure: "rooted",
    },
    {
      alias: "jade-bridge",
      body: "有人知道哪里可以找到餐馆的工作吗？刚来纽约，什么都不熟悉。会做粤菜。",
      lang: "zh",
      hood: "chinatown",
      tenure: "new",
    },
    {
      alias: "red-gate",
      body: "The tenant association on Mott St helped me fight an illegal rent increase. Free, walk-in, they speak Cantonese and Mandarin.",
      lang: "en",
      hood: "chinatown",
      tenure: "settled",
    },

    // === Brighton Beach === (indices 61-63)
    {
      alias: "cold-tide",
      body: "Хозяин квартиры поднял аренду на $500 и ничего не чинит. Крыша течет уже месяц. Куда жаловаться?",
      lang: "ru",
      hood: "brighton-beach",
      tenure: "settled",
    },
    {
      alias: "grey-shore",
      body: "На Brighton Beach Ave есть юрист который помогает с документами бесплатно. По четвергам с 3 до 6. Говорит по-русски и по-английски.",
      lang: "ru",
      hood: "brighton-beach",
      tenure: "rooted",
    },
    {
      alias: "white-sail",
      body: "The pharmacy on Brighton 6th overcharged my grandmother for medication. Be careful and compare prices before buying there.",
      lang: "en",
      hood: "brighton-beach",
      tenure: "settled",
    },

    // === Fordham === (indices 64-67)
    {
      alias: "strong-arch",
      body: "Hay una clinica gratis en la Grand Concourse que atiende sin seguro medico. No piden papeles. Hablan espanol.",
      lang: "es",
      hood: "fordham",
      tenure: "rooted",
    },
    {
      alias: "iron-bell",
      body: "Free legal clinic on Fordham Road every Tuesday. Immigration, housing, labor rights. No appointment, no ID. Ask for the Bronx Legal Services table.",
      lang: "en",
      hood: "fordham",
      tenure: "settled",
    },
    {
      alias: "amber-hill",
      body: "الإيجار زاد ٣٠٠ دولار والبيت محتاج صيانة. المحكمة على Fordham Road فيها مساعدة مجانية للمستأجرين.",
      lang: "ar",
      hood: "fordham",
      tenure: "new",
    },
    {
      alias: "dark-flame",
      body: "Cuidado con la farmacia nueva en la Grand Concourse, cobran de mas por las medicinas. Mejor ir a la de Kingsbridge.",
      lang: "es",
      hood: "fordham",
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
    // Elmhurst
    54: [{ type: "issue", value: "rent increase" }, { type: "issue", value: "landlord neglect" }],
    55: [{ type: "issue", value: "free esl" }, { type: "issue", value: "new arrival" }],
    56: [{ type: "issue", value: "landlord neglect" }, { type: "issue", value: "pest infestation" }],
    57: [{ type: "issue", value: "free esl" }, { type: "issue", value: "new arrival" }],
    // Chinatown
    58: [{ type: "street", value: "east broadway" }, { type: "issue", value: "document help" }, { type: "issue", value: "free tax prep" }],
    59: [{ type: "issue", value: "job help" }, { type: "issue", value: "new arrival" }],
    60: [{ type: "street", value: "mott st" }, { type: "issue", value: "rent increase" }, { type: "issue", value: "document help" }],
    // Brighton Beach
    61: [{ type: "issue", value: "rent increase" }, { type: "issue", value: "landlord neglect" }],
    62: [{ type: "street", value: "brighton beach ave" }, { type: "issue", value: "document help" }, { type: "issue", value: "free legal clinic" }],
    63: [{ type: "street", value: "brighton 6th" }, { type: "issue", value: "overcharging" }],
    // Fordham
    64: [{ type: "street", value: "grand concourse" }, { type: "org", value: "clinic" }, { type: "issue", value: "healthcare no insurance" }],
    65: [{ type: "street", value: "fordham road" }, { type: "issue", value: "free legal clinic" }],
    66: [{ type: "issue", value: "rent increase" }, { type: "issue", value: "landlord neglect" }, { type: "street", value: "fordham road" }],
    67: [{ type: "street", value: "grand concourse" }, { type: "issue", value: "overcharging" }],
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

  // --- Pre-baked translations for instant language switching ---
  // English translations for all non-English seed posts (keyed by post index)
  const SEED_TRANSLATIONS_EN: Record<number, string> = {
    0: "Anyone know a cheap dentist? My son has a toothache and the hospital said 3 weeks wait.",
    1: "New momo shop opened on Roosevelt, really good, you should check it out",
    3: "The new grocery store on 74th street has really cheap desi stuff. You can get a phone plan without SSN too.",
    4: "The church on 82nd has free English classes Saturdays at 10am. My wife went and says they're really good. They help with forms too.",
    5: "The new dumpling place is better than Old Sichuan. The owner is from Fujian and helps translate documents for free.",
    6: "The guy at the Main Street laundromat proofreads resumes in English. Just ask when you drop off laundry. Really nice guy.",
    7: "The library has free citizenship test prep on Saturdays, and someone helps you practice interview English. Get there early, not many seats.",
    9: "Looking for someone to watch my kid in the neighborhood. Doesn't have to be a licensed daycare. Just someone trustworthy.",
    10: "The super in the building on 175th won't fix anything. We've had no hot water for 2 weeks. Anyone know how to report this without getting in trouble?",
    11: "Any moms in the neighborhood want to practice English together? I just got here from Santo Domingo and don't know anyone. I have a 4 year old.",
    13: "Watch out for the new laundromat on Broadway. They charge by weight but the scale is off. I went twice and it always weighs more than it should.",
    14: "New Fujianese restaurant opened on 8th Ave, the oyster cakes taste just like back home. Owner says he can help newcomers find jobs, kitchen or construction.",
    15: "Be careful at the intersection of 5th and 45th. Almost got hit twice this week. There's no stop sign and cars go fast.",
    16: "Anyone know a good Chinese medicine doctor nearby? My back has been hurting for days. Preferably someone who speaks Fujianese.",
    19: "The bodega on Myrtle has the best tamales on Sunday mornings. Get there before 9 because they sell out fast. The lady also sells atole.",
    21: "Looking for someone to practice English with. I can help with Spanish. Can't afford classes but I learn fast.",
    22: "The souvlaki on Ditmars is the best. The guy who makes it is from Thessaloniki. We go every Saturday.",
    23: "The new Egyptian cafe on Steinway has hookah and homemade food. Prices are reasonable and the vibe is great.",
    24: "The Brazilian salon on 30th Ave does eyebrows for $10 and the owner helps translate documents if you ask.",
    26: "The lady who sells tamales at Roosevelt and 104th is there every Sunday morning. The rajas ones are the best.",
    27: "Does anyone know where to learn English near Corona? Free would be best. I just got here two months ago and don't understand anything.",
    28: "Watch out for the mechanic shop at the Junction. They charged me $500 for something another place did for $150. Don't go there.",
    30: "The alcapurria from the lady on 116th and Lexington is the best in the neighborhood. Get there before noon because they sell out.",
    32: "The clinic on 117th and 3rd sees patients without insurance. They speak Spanish and don't ask for papers. My family has been going there for years.",
    33: "Looking for someone who speaks French in the neighborhood. I just arrived from Senegal and don't know anyone here.",
    34: "A new grocery store opened on 74th Street, prices are really low. You can get a phone plan without SSN too.",
    35: "Don't sign anything at the realty office on 37th Ave. They add extra fees after you sign.",
    36: "Does anyone know where to get free English classes? I just arrived and don't understand anything.",
    37: "Anyone know a good immigration lawyer in Astoria? I need to renew my work permit.",
    38: "The dentist on Roosevelt Ave is cheap, $80 for cleaning. She's good and patient even if you don't speak English.",
    39: "Be careful at the realty office on 37th Ave. There are hidden fees after you sign. Happened to my neighbor.",
    40: "There's a free ESL class at the church every Saturday. They accept any language. The teaching is good.",
    41: "The community fridge on Willoughby is always stocked. I bring vegetables every Saturday. If you want to help, just show up.",
    42: "The Flushing library has free English courses and help with citizenship documents. Staff speaks Russian.",
    43: "The mechanic on Bowne St is honest. Charged $300 for brakes, others wanted $800. Ask for Mike.",
    44: "Rent went up $400 and the landlord doesn't fix anything. Anyone know where to complain without getting in trouble?",
    45: "There's a Chinese association on 8th Avenue that helps with jobs and translating documents for free. Not just for Chinese people.",
    46: "The dentist on Roosevelt Ave is really cheap, $80 for cleaning. Really good, no problem even if you don't speak English.",
    47: "The immigration lawyer on Broadway wants $3000 to renew a work permit. That's way too much. Anyone know someone cheaper?",
    48: "Rent went up $400 and the landlord won't fix anything. No hot water for two weeks. Anyone know where to complain?",
    49: "The clinic on 117th street accepts patients without insurance. They speak Spanish and a little French. No papers needed.",
    50: "Rent went up $200 and they say it's legal. Anyone know a free lawyer for tenants?",
    51: "There are free English classes at the church on 181st street. My wife goes and it's really good. They help with forms too.",
    52: "The Flushing library has a free citizenship test prep class. Russian, Chinese, Korean all available. Go Saturday morning.",
    53: "Don't sign anything at the realty office on 37th Ave. They add extra fees after you sign.",
  };

  // Spanish translations for English seed posts
  const SEED_TRANSLATIONS_ES: Record<number, string> = {
    2: "NO firmen nada en la oficina de bienes raices en la 37th Ave. Agregan cargos despues de firmar y dicen que estaba en el contrato. Le paso a dos personas de mi edificio.",
    8: "El mecanico en Bowne St es honesto. Me cobro $300 por los frenos, otro lugar queria $800. Pregunten por Mike, el te explica lo que esta haciendo.",
    12: "Clinica legal de inmigracion gratis todos los jueves en el sotano de St. Joan of Arc en la 181. Sin cita, sin identificacion. Hablan espanol, hindi, urdu.",
    17: "Si alguien necesita botas de trabajo o equipo de seguridad barato, la tienda de excedentes en la 4th Ave tiene buenas cosas. No hacen preguntas y aceptan efectivo.",
    18: "El alquiler subio $400 y mi casero no arregla la calefaccion. La organizacion de derechos de inquilinos en Myrtle me ayudo a presentar una queja gratis. Pregunten por Maria.",
    20: "La nevera comunitaria en Willoughby todavia se esta llenando? Puedo traer verduras extra los sabados si alguien coordina.",
    25: "Alguien conoce un buen abogado de inmigracion por aqui? Necesito renovar mi permiso de trabajo y el de Broadway me cobro $3000, me parece una locura.",
    29: "La biblioteca en la 104 tiene preparacion de impuestos gratis todos los sabados hasta abril. Hablan espanol y mandarin. No necesitas cita.",
    31: "El apartamento de renta estabilizada en la 118 subio $200 y dicen que es legal. Es verdad? A quien llamo?",
  };

  // Insert pre-baked translations
  const insertTrans = db.prepare(
    "INSERT OR IGNORE INTO translations (post_id, target_lang, translated_text) VALUES (?, ?, ?)"
  );
  for (const [indexStr, text] of Object.entries(SEED_TRANSLATIONS_EN)) {
    const postId = Number(indexStr) + 1; // posts are 1-indexed in DB
    insertTrans.run(postId, "en", text);
  }
  for (const [indexStr, text] of Object.entries(SEED_TRANSLATIONS_ES)) {
    const postId = Number(indexStr) + 1;
    insertTrans.run(postId, "es", text);
  }

  // Chinese translations for non-Chinese posts
  const SEED_TRANSLATIONS_ZH: Record<number, string> = {
    0: "有人知道便宜的牙医吗？我儿子牙疼，医院说要等三周。",
    1: "Roosevelt大道新开了一家饺子馆，特别好吃，快去尝尝",
    2: "千万不要在37th Ave的房产中介签任何东西。签完合同后他们会加收费用，说合同里写了。我楼里两个人都被骗了。",
    3: "74街新开的杂货店东西很便宜，没有SSN也能办手机套餐。",
    4: "82街的教堂周六上午10点有免费英语课。我老婆去了说很好，还帮忙填表格。",
    8: "Bowne街的修车师傅很实在。刹车报价300美元，别的地方要800。找Mike，他会解释在修什么。",
    9: "有人知道附近哪里可以托管小孩吗？不一定要正规的日托，靠谱就行。",
    10: "175街那栋楼的管理员什么都不修。我们两周没有热水了。有人知道怎么投诉又不会惹麻烦吗？",
    11: "有没有住在这个社区的妈妈想一起练英语？我刚从圣多明各来，谁都不认识。我有个4岁的女儿。",
    12: "181街St. Joan of Arc教堂地下室每周四有免费移民法律咨询。不用预约，不需要证件。他们会说西班牙语、印地语和乌尔都语。",
    13: "小心Broadway上新开的洗衣店。按重量收费但秤不准。我去了两次每次都多称。",
    15: "5th Ave和45街的路口要小心。这周差点被撞两次。没有停车标志，车开得很快。",
    17: "谁需要便宜的工作靴或安全装备，4th Ave的军需品店东西不错。收现金，不问问题。",
    18: "房租涨了400美元，房东还不修暖气。Myrtle街的租户权益组织帮我免费投诉了。找Maria。",
    19: "Myrtle街的小店周日早上的tamales最好吃。9点前去，晚了就卖完了。",
    20: "Willoughby街的社区冰箱还在补货吗？如果有人协调的话，我周六可以带些蔬菜过去。",
    21: "找人一起练英语。我可以教西班牙语。没钱上课但学得快。",
    22: "Ditmars的souvlaki是最好的。做的那个大叔是从Thessaloniki来的。我们每个周六都去。",
    23: "Steinway街新开了一家埃及咖啡馆，有水烟和家常菜。价格合理，氛围很好。",
    24: "30th Ave的巴西美容院做眉毛只要10美元，老板娘还帮忙翻译文件。",
    25: "有人知道附近好的移民律师吗？要续工作许可，Broadway那个要3000美元，太离谱了。",
    26: "每个周日一大早Roosevelt和104街卖tamales的阿姨都在。辣椒馅的最好吃。",
    28: "Junction的修车铺别去。一个东西收我500美元，别的地方只要150。",
    29: "104街的图书馆每周六有免费报税服务。有说西班牙语和中文的工作人员。不用预约。",
    30: "116街和Lexington的阿姨做的alcapurria是全社区最好吃的。中午前去，晚了就没了。",
    31: "118街的稳租房涨了200美元，他们说合法的。是真的吗？该打给谁？",
    32: "117街和3rd Ave的诊所不需要保险就能看病。说西班牙语，不查身份。我家去了好多年了。",
    33: "找住在这个社区说法语的人。我刚从塞内加尔来，这里谁都不认识。",
    34: "74街新开了一家杂货店，东西很便宜。没有SSN也能办手机套餐。",
    35: "37th Ave的房产中介千万别签。签完后加收各种费用。",
    36: "有人知道哪里有免费英语课吗？我刚来，什么都不懂。",
    37: "有人知道好的移民律师吗？要续工作许可。",
    38: "Roosevelt Ave的牙医很便宜，洗牙80美元。技术好，不会英语也没关系。",
    39: "小心37th Ave的房产中介。签完有隐藏费用。我邻居也被骗了。",
    40: "教堂每周六有免费英语课。任何语言都欢迎。教得很好。",
    41: "Willoughby的社区冰箱总是满的。我每周六带蔬菜去。想帮忙的话直接去就行。",
    42: "Flushing图书馆有免费英语课和公民身份考试辅导。工作人员会说俄语。",
    43: "Bowne街的修车师傅很老实。刹车收300美元，别家要800。找Mike。",
    44: "房租涨了400美元，房东什么都不修。有人知道去哪里投诉不会有麻烦吗？",
    45: "8th Avenue的华人协会帮忙找工作和翻译文件，免费的。不只是帮华人。",
    46: "Roosevelt Ave的牙医很便宜，80美元洗牙。很好，不会英语也没问题。",
    47: "Broadway的移民律师续工作许可要3000美元。太贵了。有人知道便宜的吗？",
    48: "房租涨了400美元，房东不修东西。两周没热水了。去哪里投诉？",
    49: "117街的诊所接受没有保险的病人。说西班牙语和一点法语。不需要证件。",
    50: "房租涨了200美元，他们说合法的。有人知道免费的租户律师吗？",
    51: "181街的教堂有免费英语课。我老婆去了说很好。还帮忙填表格。",
    52: "Flushing图书馆有免费公民身份考试辅导班。俄语、中文、韩语都可以。周六上午去。",
    53: "37th Ave的房产中介别去。签完后加收费用。",
    // Elmhurst (54-57)
    54: "Elmhurst的房租涨了300美元，房东什么都不修。有人知道去哪里投诉吗？",
    55: "Broadway上面新开了一家免费ESL班，周三和周五晚上。老师很有耐心，推荐给刚来的朋友。",
    56: "Queens Center Mall附近的教堂每周一和周三有免费英语课。适合刚来的新移民。",
    57: "Elmhurst的房东不修东西，好几个租客都有同样的问题。有人知道租户权益组织吗？",
    // Chinatown (58-60)
    59: "华埠的移民律师帮忙办工作许可和绿卡。说中文。不需要预约。",
    60: "Canal Street那家翻译社帮忙翻译文件，价格公道。也帮忙填表格。",
    // Brighton Beach (61-63)
    61: "Brighton Beach大道上的修车铺收费太高。换刹车要800美元，别的地方只要300。",
    62: "Brighton Beach的社区中心有免费法律咨询。帮忙处理房租、移民和劳工问题。",
    63: "房租涨了很多，房东不修暖气。有人知道怎么投诉吗？",
    // Fordham (64-67)
    64: "Grand Concourse上有免费诊所，不需要保险。说西班牙语。不查身份。",
    65: "Fordham Road每周二有免费法律咨询。移民、住房、劳工权益都管。不需要预约。",
    66: "房租涨了300美元，房子需要维修。Fordham Road的法院有免费租户援助。",
    67: "Grand Concourse上的新药店药价太高。去Kingsbridge那家更好。",
  };
  for (const [indexStr, text] of Object.entries(SEED_TRANSLATIONS_ZH)) {
    const postId = Number(indexStr) + 1;
    insertTrans.run(postId, "zh", text);
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

    // Elmhurst
    {
      name: "Elmhurst Hospital Community Outreach",
      description_original:
        "Free health screenings, vaccinations, and referrals. No insurance needed. Staff speaks Spanish, Chinese, Bengali, Tagalog.",
      source_lang: "en",
      category: "health",
      hood: "elmhurst",
      address: "Broadway",
      source: "seed",
    },
    {
      name: "Queens Center ESL Program",
      description_original:
        "Clases de ingles gratis lunes y miercoles 6pm. Cerca del Queens Center Mall. Todos son bienvenidos.",
      source_lang: "es",
      category: "community",
      hood: "elmhurst",
      address: "Queens Blvd",
      source: "seed",
    },

    // Chinatown
    {
      name: "华埠服务中心 Chinatown Service Center",
      description_original:
        "帮忙填表格、翻译文件、报税。免费。说中文就行。周一到周五 9am-5pm。",
      source_lang: "zh",
      category: "services",
      hood: "chinatown",
      address: "East Broadway",
      source: "seed",
    },
    {
      name: "Mott Street Tenant Association",
      description_original:
        "Free help fighting illegal rent increases and evictions. Walk-in. Cantonese, Mandarin, English.",
      source_lang: "en",
      category: "services",
      hood: "chinatown",
      address: "Mott Street",
      source: "seed",
    },

    // Brighton Beach
    {
      name: "Русский книжный магазин Russian Bookstore",
      description_original:
        "Книги, газеты, помощь с переводом документов. Также помогают с заполнением форм.",
      source_lang: "ru",
      category: "services",
      hood: "brighton-beach",
      address: "Brighton Beach Ave",
      source: "seed",
    },
    {
      name: "Brighton Beach Free Legal Aid",
      description_original:
        "Бесплатная юридическая помощь по четвергам 3-6pm. Иммиграция, жилье, трудовые права. Русский и английский.",
      source_lang: "ru",
      category: "services",
      hood: "brighton-beach",
      address: "Brighton Beach Ave",
      source: "seed",
    },

    // Fordham
    {
      name: "Bronx Legal Services - Fordham",
      description_original:
        "Free legal clinic every Tuesday. Immigration, housing, labor. No appointment, no ID needed. Spanish, Arabic, English.",
      source_lang: "en",
      category: "services",
      hood: "fordham",
      address: "Fordham Road",
      source: "seed",
    },
    {
      name: "Clinica del Pueblo Fordham",
      description_original:
        "Atencion medica gratuita sin seguro. No piden papeles. Hablan espanol. Grand Concourse cerca de Fordham Road.",
      source_lang: "es",
      category: "health",
      hood: "fordham",
      address: "Grand Concourse",
      source: "seed",
    },
  ];

  for (const d of directory) {
    createDirectoryEntry(d);
  }

  // --- Demo bookmarks for /tower/demo-user ---
  const demoBookmarks = [
    { postId: 1, topic: "health" },      // ES, dentist, jackson-heights
    { postId: 6, topic: "food" },         // ZH, dumpling restaurant, flushing
    { postId: 13, topic: "legal" },       // EN, free legal clinic, washington-heights
    { postId: 18, topic: "housing" },     // EN, rent increase, bushwick (actually post 19 is 1-indexed)
    { postId: 5, topic: "education" },    // ES, free ESL, jackson-heights
    { postId: 17, topic: "services" },    // EN, surplus store, sunset-park (actually post 18 is 1-indexed)
  ];
  for (const bm of demoBookmarks) {
    addBookmark("demo-user", bm.postId, bm.topic);
  }

  return { status: "seeded", posts: posts.length, directory: directory.length };
}
