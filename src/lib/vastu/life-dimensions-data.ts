/**
 * The 16-Zone Life Dimension & Key Area of Life table — transcribed from Newmeric Compass.
 */

export type Lang = 'en' | 'bn' | 'hi';

export type LifeChain = { label?: string; steps: string[] };

export type LifeDimension = {
  /** "Zone of Opportunities, Wealth & Resource Flow" */
  title: string;
  /** The zone's central question, where the document states one. */
  principle?: string;
  /** The paragraph placing the zone in the tradition. */
  context?: string;
  /** The word the document quotes on the Life Aspects line. */
  theme?: string;
  /** "Primary Life Aspects" for North; "Life Aspects" everywhere else. */
  aspectsLabel?: string;
  aspects: string[];
  /** The interpretive lines, in the order the document sets them down. */
  notes?: string[];
  /** The chains the document draws with arrows. */
  chains?: LifeChain[];
  /** WSW's student applications. */
  applicationsIntro?: string;
  applications?: string[];
  positiveLabel: string;
  positiveIntro?: string;
  positive: string[];
  shadowLabel: string;
  shadowIntro?: string;
  shadow: string[];
  /** One-word essence, shown as the hero pill. */
  attribute: string;
};

const ORIGINAL: Record<string, LifeDimension> = {
  N: {
    title: 'Zone of Opportunities, Wealth & Resource Flow',
    principle: 'What comes into my life?',
    context: 'In classical Vastu, North is ruled by Kubera, the custodian of wealth, and corresponds to the Water element. It is the primary gateway through which fresh energies, people, possibilities, and financial resources enter the life of an individual or business.',
    aspectsLabel: 'Primary Life Aspects',
    aspects: ['Opportunities', 'Wealth flow', 'Career growth', 'Incoming prosperity', 'Business inquiries', 'Customers'],
    positiveLabel: 'Positive Expression (When Balanced)',
    positiveIntro: 'When North is open, light, and balanced:',
    positive: [
      'Steady influx of opportunities',
      'Career advancement & job offers',
      'Consistent client inquiries',
      'Financial stability through incoming resources',
      'A sense that "doors are opening."',
    ],
    shadowLabel: 'Shadow / Disturbed Expression (When Afflicted)',
    shadowIntro: 'When North is blocked, cut, heavy, or burdened by Fire/Earth elements:',
    shadow: [
      'Stagnant career with few opportunities',
      'Business dry spells',
      'Efforts made but results delayed',
      'Difficulty attracting new income streams',
      'A feeling of being "invisible" in the market.',
    ],
    attribute: 'OPPORTUNITY',
  },
  NNE: {
    title: 'Zone of Health, Immunity & Healing',
    principle: 'How well do I heal and sustain life?',
    context: 'Positioned between the abundant flow of North and the spiritual purity of North-East, NNE carries a refined Water energy specifically connected with bodily rejuvenation, the immune response, and overall wellness.',
    aspects: ['Health', 'Immunity', 'Healing energy', 'Physical recovery', 'Strength', 'Vitality'],
    positiveLabel: 'Positive Expression (When Balanced)',
    positive: [
      'Strong immune function',
      'Quick recovery from illness',
      'Good baseline physical energy',
      'Therapies and medications work effectively',
      'General feeling of wellness and vitality.',
    ],
    shadowLabel: 'Shadow / Disturbed Expression (When Afflicted)',
    shadow: [
      'Frequent or prolonged illness',
      'Low vitality and chronic fatigue',
      'Medicines failing to show results',
      'Unexplained aches, pains, or recurring issues.',
    ],
    attribute: 'IMMUNITY',
  },
  NE: {
    title: 'Zone of Clarity, Wisdom & Spiritual Vision',
    principle: 'Where am I going and why?',
    context: 'Ishanya (North-East) is traditionally the most sacred zone of any space, associated with Lord Shiva and Jupiter. It governs the head of the Vastu Purusha and acts as the receiver of higher consciousness and cosmic intelligence.',
    aspects: ['Mental clarity', 'Spiritual vision', 'Wisdom', 'Insight', 'Intuition', 'Purity of thought'],
    positiveLabel: 'Positive Expression (When Balanced)',
    positive: [
      'Crystal-clear thinking and focus',
      'Access to intuitive insights',
      'Constructive life vision',
      'Deep inner peace and purpose',
      'Good decision-making at critical junctions.',
    ],
    shadowLabel: 'Shadow / Disturbed Expression (When Afflicted)',
    shadow: [
      'Confusion and mental fog',
      'Lack of direction in life',
      'Headaches or neurological tension',
      'Wrong life choices caused by impaired judgment',
      'Loss of faith or spiritual emptiness.',
    ],
    attribute: 'WISDOM',
  },
  ENE: {
    title: 'Zone of Joy, Rejuvenation & Happiness',
    principle: 'Do I enjoy my life?',
    context: 'Positioned between the divine clarity of NE and the social connection of East, ENE translates wisdom into lived experience: relaxation, celebration, laughter, and mental refreshment.',
    aspects: ['Happiness', 'Joy', 'Rejuvenation', 'Recreation', 'Refreshment', 'Cheerfulness'],
    positiveLabel: 'Positive Expression (When Balanced)',
    positive: [
      'Laughter and cheerful domestic atmosphere',
      'Ability to relax and unwind deeply',
      'Enjoyment of daily life',
      'Creativity flowing without pressure',
      'Emotional resilience through positivity.',
    ],
    shadowLabel: 'Shadow / Disturbed Expression (When Afflicted)',
    shadow: [
      'Dull, monotonous domestic routine',
      'Inability to relax or have fun',
      'Frequent melancholy or low moods',
      'Life feeling heavy and burdensome.',
    ],
    attribute: 'JOY',
  },
  E: {
    title: 'Zone of Social Connectivity, Networking & State Favor',
    principle: 'How am I connected to the world?',
    context: 'Ruled by Indra (the king of gods) and the Sun, East is the zone of sunrise, social illumination, and public engagement. It determines how a person or business connects to society, the market, and authority.',
    aspects: ['Social connectivity', 'Networking', 'Government connections', 'Public relations', 'Society'],
    positiveLabel: 'Positive Expression (When Balanced)',
    positive: [
      'Extensive and supportive social network',
      'Recognition and favorable attention from authorities',
      'Helpful acquaintances and influential contacts',
      'Public acceptance and easy outreach.',
    ],
    shadowLabel: 'Shadow / Disturbed Expression (When Afflicted)',
    shadow: [
      'Social isolation or estrangement',
      'Problems with government officials, bureaucracy or permits',
      'Difficulty building meaningful social alliances',
      'Feeling disconnected from society.',
    ],
    attribute: 'SOCIETY',
  },
  ESE: {
    title: 'Zone of Analysis, Churning & Decision-Making',
    principle: 'How do I process information and thoughts?',
    context: 'ESE represents the internal "Manthan" (churning of the ocean). It governs the mental process through which information is analyzed, weighed, and resolved into decisions.',
    aspects: ['Analysis', 'Churning', 'Deep thinking', 'Discrimination', 'Mental digestion'],
    positiveLabel: 'Positive Expression (When Balanced)',
    positive: [
      'Sharp analytical faculties',
      'Ability to weigh pros and cons calmly',
      'Decisions made with confidence and clarity',
      'Balanced intellectual curiosity.',
    ],
    shadowLabel: 'Shadow / Disturbed Expression (When Afflicted)',
    shadow: [
      'Chronic overthinking, anxiety, and sleeplessness',
      'Indecisiveness (analysis paralysis)',
      'Obsessive-compulsive thought loops',
      'Constant domestic arguments over trivial issues.',
    ],
    attribute: 'CHURNING',
  },
  SE: {
    title: 'Zone of Cash Liquidity, Fire & Transformation',
    principle: 'Do I have the cash flow and driving energy to act?',
    context: 'Agneya (South-East) is ruled by Agni (Fire) and Venus. It represents the active, transformative spark required to convert goods and services into liquid wealth, and drive physical passion.',
    aspects: ['Cash flow', 'Liquidity', 'Fire energy', 'Action', 'Enthusiasm', 'Purchasing power'],
    positiveLabel: 'Positive Expression (When Balanced)',
    positive: [
      'Healthy, predictable cash liquidity',
      'Prompt payment collection from clients',
      'Dynamic physical energy and drive',
      'Warm enthusiasm in relationships and work.',
    ],
    shadowLabel: 'Shadow / Disturbed Expression (When Afflicted)',
    shadow: [
      'Acute cash-flow crunches and payment delays',
      'Impulsive, unproductive expenditures',
      'Lethargy or, conversely, uncontrollable temper',
      'Obstacles during auspicious occasions (weddings, ceremonies).',
    ],
    attribute: 'LIQUIDITY',
  },
  SSE: {
    title: 'Zone of Power, Confidence & Physical Strength',
    principle: 'Do I possess inner strength and courage?',
    context: 'Sitting between South-East (Fire) and South (Fame), SSE governs the core physical power, inner stamina, and courage necessary to stand firm against adversity.',
    aspects: ['Power', 'Confidence', 'Courage', 'Physical strength', 'Willpower'],
    positiveLabel: 'Positive Expression (When Balanced)',
    positive: [
      'Unshakable self-confidence',
      'Physical stamina and enduring vigor',
      'Courage to take calculated risks',
      'Commanding, respected personal presence.',
    ],
    shadowLabel: 'Shadow / Disturbed Expression (When Afflicted)',
    shadow: [
      'Persistent self-doubt and fear of failure',
      'Feeling intimidated by competitors or authority',
      'Physical exhaustion and lack of stamina',
      'Hesitation when bold action is urgently needed.',
    ],
    attribute: 'POWER',
  },
  S: {
    title: 'Zone of Fame, Recognition & Relaxation',
    principle: 'Am I recognized for my work, and can I rest deeply?',
    context: 'Ruled by Yama (Lord of Dharma and restraint) and Mars, South is the zenith of the sun. It governs public reputation, brand goodwill, and the ability to drop daily vigilance into restful sleep.',
    aspects: ['Fame', 'Recognition', 'Relaxation', 'Brand image', 'Reputation', 'Deep rest'],
    positiveLabel: 'Positive Expression (When Balanced)',
    positive: [
      'Respected reputation and brand recognition',
      'Genuine praise and market visibility for one’s contributions',
      'Sound, restorative sleep free from anxiety',
      'Inner calm and satisfaction with one’s status.',
    ],
    shadowLabel: 'Shadow / Disturbed Expression (When Afflicted)',
    shadow: [
      'Loss of face, defamation, or negative public rumors',
      'Hard work going unnoticed and uncredited',
      'Chronic restlessness and inability to sleep peacefully',
      'Constant anxiety regarding personal standing.',
    ],
    attribute: 'FAME',
  },
  SSW: {
    title: 'Zone of Expenditure, Disposal & Detachment',
    principle: 'What must be let go of?',
    context: 'SSW is the natural zone of release, waste disposal, and shedding. It governs the body’s excretory system, mental release of sorrow, and the termination of unprofitable attachments.',
    aspects: ['Expenditure', 'Disposal', 'Letting go', 'Waste removal', 'Drainage'],
    positiveLabel: 'Positive Expression (When Balanced)',
    positive: [
      'Effortless elimination of mental and physical toxins',
      'Ability to let go of dead habits and relationships',
      'Controlled, deliberate expenditures',
      'Optimal placement for toilets and trash bins.',
    ],
    shadowLabel: 'Shadow / Disturbed Expression (When Afflicted)',
    shadow: [
      'Uncontrolled financial drain and leaky expenses',
      'Important activities (studies, work, bed) placed here leading to complete exhaustion',
      'Loss of vital physical energy and chronic depletion',
      'Valuable assets draining away without trace.',
    ],
    attribute: 'DISPOSAL',
  },
  SW: {
    title: 'Zone of Relationships, Skills & Grounding Stability',
    principle: 'What is my foundation?',
    context: 'Nairitya (South-West) is governed by the Earth element and Rahu/Nirriti. It is the heaviest, most anchoring sector of the Vastu mandala, holding the pitris (ancestors) and grounding stability.',
    aspects: ['Relationships', 'Skills', 'Stability', 'Family harmony', 'Ancestral blessings', 'Mastery'],
    positiveLabel: 'Positive Expression (When Balanced)',
    positive: [
      'Rock-solid marital and familial bonds',
      'Professional competence, craftsmanship, and mastery',
      'Strong ancestral support and grounded domestic peace',
      'Loyal, long-term partnerships and client retention.',
    ],
    shadowLabel: 'Shadow / Disturbed Expression (When Afflicted)',
    shadow: [
      'Severe marital conflict, divorce, or emotional disconnection',
      'Inability to develop or monetize personal skills',
      'Chronic instability in career and residence',
      'Loss of respect as the head of the family.',
    ],
    attribute: 'STABILITY',
  },
  WSW: {
    title: 'Zone of Education, Knowledge & Savings',
    principle: 'What have I learned, and what have I saved?',
    context: 'Positioned between Earth (SW) and Metal/Space (W), WSW combines grounded discipline with intellectual accumulation. It is the premier zone for students, scholars, and financial savings.',
    aspects: ['Education', 'Knowledge', 'Savings', 'Memory', 'Study', 'Analytical depth'],
    positiveLabel: 'Positive Expression (When Balanced)',
    positive: [
      'High academic retention and top examination performance',
      'Steady accumulation of financial savings',
      'Practical wisdom applied to business and investments',
      'Deep focus during study and research sessions.',
    ],
    shadowLabel: 'Shadow / Disturbed Expression (When Afflicted)',
    shadow: [
      'Difficulty retaining knowledge; poor academic grades',
      'Inability to save money despite high earnings',
      'Lack of discipline and fragmented concentration',
      'Investments made without thorough understanding.',
    ],
    attribute: 'KNOWLEDGE',
  },
  W: {
    title: 'Zone of Gains, Profits & Fulfillment',
    principle: 'What do I receive for my efforts?',
    context: 'Ruled by Varuna (Lord of Cosmic Waters and fate) and Saturn, West governs the harvest. It answers the question of whether hard work translates into tangible rewards, profits, and fulfillment of desires.',
    aspects: ['Gains', 'Profits', 'Fulfillment', 'Success', 'Commercial returns', 'Accomplishment'],
    positiveLabel: 'Positive Expression (When Balanced)',
    positive: [
      'High profit margins and business expansion',
      'Efforts translating directly into tangible rewards',
      'Satisfaction and fulfillment of cherished desires',
      'Reliable, prompt returns on capital and time.',
    ],
    shadowLabel: 'Shadow / Disturbed Expression (When Afflicted)',
    shadow: [
      'Tremendous effort expended with minimal financial return',
      'Business deals falling through at the final signature',
      'Perpetual dissatisfaction and unfulfilled wishes',
      'Profits swallowed by unexpected overheads.',
    ],
    attribute: 'GAINS',
  },
  WNW: {
    title: 'Zone of Depression, Emotional Release & Detox',
    principle: 'How do I release sorrow and emotional baggage?',
    context: 'WNW governs emotional catharsis. When balanced, it provides a safe psychological space to grieve, process losses, and let go of resentment, leaving the mind clean and renewed.',
    aspects: ['Emotional release', 'Detox', 'Sorrow processing', 'Mental healing', 'Catharsis'],
    positiveLabel: 'Positive Expression (When Balanced)',
    positive: [
      'Healthy processing of emotional setbacks',
      'Ability to release past grudges and mourn cleanly',
      'Quick psychological bounce-back from disappointment',
      'Deep emotional lightness after venting.',
    ],
    shadowLabel: 'Shadow / Disturbed Expression (When Afflicted)',
    shadow: [
      'Chronic clinical depression and persistent sorrow',
      'Ruminating endlessly over past failures and betrayals',
      'Living in a perpetual state of victimhood',
      'Addiction or toxic coping mechanisms.',
    ],
    attribute: 'DETOX',
  },
  NW: {
    title: 'Zone of Support, Banking & Helpful Contacts',
    principle: 'Who helps me from the outside world?',
    context: 'Vayavya (North-West) is governed by Vaayu (Wind) and the Moon. It represents the movement of outside support: banks, investors, friends, colleagues, in-laws, and government agencies.',
    aspects: ['Support', 'Banking assistance', 'Helpful contacts', 'Alliances', 'External favors'],
    positiveLabel: 'Positive Expression (When Balanced)',
    positive: [
      'Ready approval of bank loans and credit facilities',
      'Dependable, supportive friends and business associates',
      'Timely help arriving during unforeseen emergencies',
      'Seamless collaboration with external partners.',
    ],
    shadowLabel: 'Shadow / Disturbed Expression (When Afflicted)',
    shadow: [
      'Loan rejections and uncooperative banking institutions',
      'Allies and friends deserting in times of critical need',
      'Feeling isolated with no external safety net',
      'Chronic disputes with suppliers and assistants.',
    ],
    attribute: 'SUPPORT',
  },
  NNW: {
    title: 'Zone of Attraction, Companionship & Emotional Fulfilment',
    principle: 'How attractive, charismatic, and emotionally fulfilled am I?',
    context: 'Sitting between Support (NW) and Opportunity (N), NNW governs social magnetism, charisma, romantic attraction, and intimacy within relationships.',
    aspects: ['Attraction', 'Relationships', 'Companionship', 'Emotional fulfilment', 'Social magnetism', 'Charisma'],
    positiveLabel: 'Positive Expression (When Balanced)',
    positive: [
      'Magnetic personal charm and charisma',
      'Passionate and emotionally fulfilling romance',
      'Strong customer attraction and commercial appeal',
      'Joyful, harmonious couple dynamics.',
    ],
    shadowLabel: 'Shadow / Disturbed Expression (When Afflicted)',
    shadow: [
      'Lack of physical or emotional attraction between partners',
      'Difficulty finding a romantic companion',
      'Extramarital complications or temptation when heavily distorted',
      'Dull, uninspiring public persona.',
    ],
    attribute: 'ATTRACTION',
  },
};

export function lifeDimension(dir16?: string | null): LifeDimension | null {
  if (!dir16) return null;
  return ORIGINAL[dir16.toUpperCase()] ?? null;
}

