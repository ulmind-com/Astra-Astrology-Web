/**
 * The 32 entrance padas in depth — the owner's three PADA-RESOURCES documents:
 * "32 PADAS Residential Impacts", "32 PADAS Commercial Impacts" and "32 PADAS
 * REMEDIES". They add to the 7D Nexus entrance card, under the presiding deity
 * and challenges it already shows, and change nothing about those.
 *
 * Every line of all three is here: each pada keeps the document's own heading
 * and its lines in order — bulleted where the document bullets them, prose
 * where it does not — and the Commercial document's closing selection matrix
 * is kept as the table it is. Checked character for character against the
 * documents (whitespace and bullet marks aside).
 *
 * Two documents do not keep one shape throughout — Residential drops its
 * numbering and bullets its headings from N6 on, and Remedies sometimes puts a
 * pada's remedy on the heading line and sometimes on the lines under it — so
 * headings are found by their pada code rather than by layout.
 */

export type PadaBlock = { t: 'p'; text: string } | { t: 'li'; text: string };

export type PadaEntry = {
  /** The document's own heading for this pada, as written. */
  heading: string;
  blocks: PadaBlock[];
};

type Section = {
  /** Anything the document says before its first pada. */
  intro: string[];
  padas: Record<string, PadaEntry>;
};

const RESIDENTIAL: Section = {
  intro: ['RESIDENTIAL DEEP DIVE'],
  padas: {
    N1: {
      heading: '1. N1 (Roga) [🚫] – The Disease & Hostility Zone',
      blocks: [
        { t: 'li', text: 'Attracts hostile intentions and bad thoughts of others toward residents.' },
        { t: 'li', text: 'Creates strong feeling of enmity, jealousy & distrust.' },
        { t: 'li', text: 'Residents feel others are against them or want to harm them.' },
        { t: 'li', text: 'Increases mental stress, fear & overthinking.' },
        { t: 'li', text: 'Can lead to quarrels, legal issues or sudden conflicts.' },
        { t: 'li', text: 'Health issues (especially bone-related / chronic problems) possible.' },
        { t: 'li', text: 'Overall unstable & restless energy in the house.' },
      ],
    },
    N2: {
      heading: '2. N2 (Naga) [❌] – The Enmity & Suspicion Zone',
      blocks: [
        { t: 'li', text: 'Increases jealousy and envy from relatives, neighbours and outsiders.' },
        { t: 'li', text: 'Creates feeling of isolation – people around but emotional distance.' },
        { t: 'li', text: 'Raises enmity and rivalry (especially among brothers/family members).' },
        { t: 'li', text: 'Triggers comparison mindset and unnecessary competition.' },
        { t: 'li', text: 'Can lead to mental stress and lack of true support.' },
        { t: 'li', text: 'Medium to mildly negative overall (not the worst like N1, but not good).' },
        { t: 'p', text: 'True consensus from classical + modern Vastu sources: N2 is not recommended for main entrance.' },
      ],
    },
    N3: {
      heading: '3. N3 (Mukhya) [⭐⭐] – The Principal Prosperity Gateway',
      blocks: [
        { t: 'p', text: 'One of the strongest and most reliable North entrances.' },
        { t: 'li', text: 'Attracts wealth, money inflow & financial growth.' },
        { t: 'li', text: 'Brings prosperity & abundance.' },
        { t: 'li', text: 'Supports career success & business progress.' },
        { t: 'li', text: 'Helps in family growth (often linked to more male children in classical texts).' },
        { t: 'li', text: 'Creates stability, harmony & ancestral blessings.' },
        { t: 'li', text: 'Positive energy flow into the house → better opportunities & overall progress.' },
        { t: 'li', text: 'One of the most auspicious North entrances (along with N4 & N5)' },
        { t: 'p', text: 'Note: Exact benefits depend on correct measurement from Brahmasthan (centre of house) using a proper compass. Other defects (toilet in North, clutter, etc.) can reduce results.' },
      ],
    },
    N4: {
      heading: '4.  N4 (Bhallata) [⭐⭐⭐] – The Treasury & Inheritance Door',
      blocks: [
        { t: 'p', text: 'Inherited wealth & property – Strong flow of ancestral assets and family wealth.' },
        { t: 'li', text: 'Financial prosperity – Magnifies money, opens new income doors, steady accumulation.' },
        { t: 'li', text: 'Business & career boost – Rapid growth in business; frequent promotions for jobs.' },
        { t: 'li', text: 'Real estate & investments – Especially favourable for property-related gains.' },
        { t: 'li', text: 'Family harmony – Cordial relationships, responsible children, strong family legacy.' },
        { t: 'li', text: 'Overall growth – Happiness, peace, stability, and all-round progress if no major internal Vastu defects.' },
        { t: 'p', text: 'Note: Exact effect depends on precise compass placement of the door and overall house layout. Keep the entrance clean, clutter-free, and well-lit for best results.' },
      ],
    },
    N5: {
      heading: '5. N5 (Soma) [⭐] – The Mental Peace & Spiritual Harmonizer',
      blocks: [
        { t: 'p', text: 'Lunar (Moon) energy zone.' },
        { t: 'li', text: 'Residents become calm, peaceful & non-aggressive.' },
        { t: 'li', text: 'Strong tendency toward religious / spiritual life.' },
        { t: 'li', text: 'Good ability to convert hard work into money (steady profits from efforts).' },
        { t: 'li', text: 'Supports spiritual growth & mental peace.' },
        { t: 'li', text: 'Attracts nourishment energy (health of mind + moderate wealth flow).' },
        { t: 'li', text: 'Overall positive for family harmony and balanced life.' },
        { t: 'li', text: 'Mild risk (as per some modern views): Can make people a bit passive or over-dependent on faith if other Vastu factors are weak.' },
        { t: 'p', text: 'Summary: N5 is one of the best & safest North entrances for homes. It gives peace + steady prosperity rather than sudden huge wealth. Keep the entrance clean, well-lit, and clutter-free for maximum benefit.' },
      ],
    },
    N6: {
      heading: '6. N6 (Bhujanga / Sarp) [❌] – The Volatility & Argument Zone',
      blocks: [
        { t: 'li', text: 'Causes sudden fluctuations: high income is often matched by unexpected expenditures.' },
        { t: 'li', text: 'Frequent arguments, especially with sons or younger family members.' },
        { t: 'li', text: 'Behavioural changes that make others stop listening or respecting the person over time.' },
        { t: 'li', text: 'Speculative ventures tend to suffer sharp losses.' },
        { t: 'li', text: 'Energetically leads to addiction issues, poor decision-making, and unexpected losses through fraud or bad investments.' },
      ],
    },
    N7: {
      heading: 'N7 (Aditi) [❌] – The Detachment & Rebellion Zone',
      blocks: [
        { t: 'li', text: 'Weakens traditional family bonds and worldly ambitions in the younger generation.' },
        { t: 'li', text: 'Daughters or young women may reject family traditions, leading to unconventional choices or estrangement.' },
        { t: 'li', text: 'Can create isolation from family business or sudden shifts toward extreme independence.' },
        { t: 'p', text: 'Generally unfavourable for joint families.' },
      ],
    },
    N8: {
      heading: 'N8 (Diti) [⚠️] – The Savings but Scarcity Mindset Zone',
      blocks: [
        { t: 'li', text: 'Paradoxically increases bank balance because residents become extremely careful with money.' },
        { t: 'li', text: 'Creates an obsessive fear of loss, which prevents bold investment and growth.' },
        { t: 'li', text: 'Moderately better than negative zones but far weaker than N3–N5.' },
        { t: 'p', text: 'Acceptable only if no better option exists; not ideal.' },
      ],
    },
    E1: {
      heading: 'E1 (Shikhi) [🚫] – The Fire Hazard Zone',
      blocks: [
        { t: 'li', text: 'High risk of fire accidents, short circuits, and sudden financial losses.' },
        { t: 'li', text: 'Residents may develop high blood pressure, impulsive behaviour, and career-ruining decisions.' },
        { t: 'li', text: 'Unexpected accidents or legal shocks.' },
        { t: 'p', text: 'Strictly avoid.' },
      ],
    },
    E2: {
      heading: 'E2 (Parjanya) [❌] – The Drainage & Delay Zone',
      blocks: [
        { t: 'li', text: 'Causes continuous wasteful expenditure.' },
        { t: 'li', text: 'Projects get stuck at the final stage (approvals, funds, clearances delayed indefinitely).' },
        { t: 'li', text: 'Higher probability of more female children.' },
        { t: 'li', text: 'Energy feels drained rather than productive.' },
        { t: 'p', text: 'Avoid.' },
      ],
    },
    E3: {
      heading: 'E3 (Jayanta) [⭐] – The Victory & Charisma Gate',
      blocks: [
        { t: 'li', text: 'Builds strong drive, eloquence, and public appeal.' },
        { t: 'li', text: 'Excellent for lawyers, sales leaders, politicians, speakers, and anyone needing recognition.' },
        { t: 'li', text: 'Attracts success, profits, and social reputation.' },
        { t: 'li', text: 'Supports consistent forward movement.' },
        { t: 'p', text: 'Highly recommended.' },
      ],
    },
    E4: {
      heading: 'E4 (Indra) [⭐] – The Authority & Government Support Gate',
      blocks: [
        { t: 'li', text: 'Commands respect and attract high-level patronage (government, institutions, powerful people).' },
        { t: 'li', text: 'Builds lasting organizational influence and leadership presence.' },
        { t: 'li', text: 'Ideal for those in administration, politics, or large organizations.' },
        { t: 'p', text: 'One of the strongest East entrances.' },
      ],
    },
    E5: {
      heading: 'E5 (Surya) [❌] – The Overheated Ego Zone',
      blocks: [
        { t: 'li', text: 'Excessive solar fire without balance.' },
        { t: 'li', text: 'Causes explosive tempers, severe ego clashes between partners, and inability to accept feedback.' },
        { t: 'li', text: 'Relationships become strained due to dominance and anger.' },
        { t: 'p', text: 'Avoid.' },
      ],
    },
    E6: {
      heading: 'E6 (Satya) [❌] – The Broken Promise Zone',
      blocks: [
        { t: 'li', text: 'Distorts truth energy.' },
        { t: 'li', text: 'Residents struggle to keep commitments; reputation suffers from unfulfilled promises.' },
        { t: 'li', text: 'Legal grey areas, broken contracts, and trust issues become common.' },
        { t: 'p', text: 'Avoid.' },
      ],
    },
    E7: {
      heading: 'E7 (Bhrisha) [🚫] – The Insensitivity & Fall Zone',
      blocks: [
        { t: 'li', text: 'Makes people emotionally detached and insensitive to others’ feelings.' },
        { t: 'li', text: 'Words can hurt deeply; relationships suffer.' },
        { t: 'li', text: 'Energy starts sliding toward the dangerous Southeast corner.' },
        { t: 'p', text: 'Avoid.' },
      ],
    },
    E8: {
      heading: 'E8 (Akasha) [🚫] – The Void & Isolation Zone',
      blocks: [
        { t: 'li', text: 'Creates deep isolation and loss of social support.' },
        { t: 'li', text: 'Accidents, thefts, financial losses, and chronic health drains.' },
        { t: 'li', text: 'Feeling of emptiness or disconnection from the world.' },
        { t: 'p', text: 'Strictly avoid.' },
      ],
    },
    S1: {
      heading: 'S1 (Anila) [❌] – The Male Child Disturbance Zone',
      blocks: [
        { t: 'li', text: 'Strongly negative for sons: rebellion, addiction tendencies, desire to leave home, or going against parents’ expectations.' },
        { t: 'li', text: 'Structural instability in family dynamics.' },
        { t: 'p', text: 'Avoid.' },
      ],
    },
    S2: {
      heading: 'S2 (Pushan / Poosha) [⚠️] – The Job-Holder Support Zone',
      blocks: [
        { t: 'li', text: 'Moderately good for salaried professionals (especially MNC or structured jobs) — supports promotions and steady progress.' },
        { t: 'li', text: 'Not suitable for business owners.' },
        { t: 'li', text: 'Can create friction with relatives.' },
        { t: 'p', text: 'Acceptable only for pure job profiles.' },
      ],
    },
    S3: {
      heading: 'S3 (Vitatha) [👍] – The Clever Prosperity Zone',
      blocks: [
        { t: 'li', text: 'Generates significant wealth and the ability to get work done smartly.' },
        { t: 'li', text: 'Residents become resourceful and opportunistic.' },
        { t: 'li', text: 'Underlying frequency can encourage shortcuts or grey-area methods. Ethical people may feel tension here.' },
        { t: 'p', text: 'Good for wealth, but monitor ethics.' },
      ],
    },
    S4: {
      heading: 'S4 (Grihakshata / Grihrakshita) [⭐] – The Protective Fortress Gate',
      blocks: [
        { t: 'li', text: 'Strong protective energy against competitors, lawsuits, and opposition.' },
        { t: 'li', text: 'Supports fame, financial stability, more sons, and success in administration or public roles.' },
        { t: 'li', text: 'Acts like a shield for the household.' },
        { t: 'p', text: 'Best South entrance.' },
      ],
    },
    S5: {
      heading: 'S5 (Yama) [🚫] – The Debt & Penalty Zone',
      blocks: [
        { t: 'li', text: 'Heavy debt traps, chronic litigation, accidents, and a constant undercurrent of fear.' },
        { t: 'li', text: 'Intelligence feels blocked; life becomes increasingly difficult.' },
        { t: 'p', text: 'Strictly avoid.' },
      ],
    },
    S6: {
      heading: 'S6 (Gandharva) [🚫] – The Sensory Drain Zone',
      blocks: [
        { t: 'li', text: 'Over-fixation on luxury, pleasure, and overspending.' },
        { t: 'li', text: 'Core capital erodes; reputation and finances suffer.' },
        { t: 'p', text: 'Avoid.' },
      ],
    },
    S7: {
      heading: 'S7 (Bhringraj) [🚫] – The Wasted Effort Zone',
      blocks: [
        { t: 'li', text: 'Hard work yields almost no results.' },
        { t: 'li', text: 'Progressive disconnection from people and goals.' },
        { t: 'li', text: 'Deep dissatisfaction and loss of motivation.' },
        { t: 'p', text: 'Avoid.' },
      ],
    },
    S8: {
      heading: 'S8 (Mriga) [🚫] – The Isolation & Ruin Zone',
      blocks: [
        { t: 'li', text: 'Leads to rudeness, social isolation, family distress, and heavy material + emotional losses.' },
        { t: 'li', text: 'Near the dangerous Southwest corner.' },
        { t: 'p', text: 'Strictly avoid.' },
      ],
    },
    W1: {
      heading: 'W1 (Pitrigan / Pitra) [🚫] – The Ancestral Block Zone',
      blocks: [
        { t: 'li', text: 'Creates a psychological and financial ceiling. Effort never converts fully into expected results.' },
        { t: 'li', text: 'Weak finances, health decline, and reduced vitality.' },
        { t: 'p', text: 'Avoid.' },
      ],
    },
    W2: {
      heading: 'W2 (Dauwarik / Dwarapalaka) [🚫] – The Instability Zone',
      blocks: [
        { t: 'li', text: 'Career remains unstable; lack of mental clarity.' },
        { t: 'li', text: 'Constant insecurity about relationships, business, and future.' },
        { t: 'li', text: 'Deals stall just before final approval.' },
        { t: 'p', text: 'Avoid.' },
      ],
    },
    W3: {
      heading: 'W3 (Sugriva) [⭐] – The Merchant’s Goldmine',
      blocks: [
        { t: 'li', text: 'Excellent for trade, manufacturing, and commercial networks.' },
        { t: 'li', text: 'Builds reliable supply chains, liquid capital, and steady growth.' },
        { t: 'li', text: 'One of the strongest wealth zones in the West.' },
        { t: 'p', text: 'Highly recommended for business.' },
      ],
    },
    W4: {
      heading: 'W4 (Pushpadanta) [⭐] – The Divine Treasury',
      blocks: [
        { t: 'li', text: 'Brings multi-generational wealth, luxurious assets, high-end property, and protected environments for children.' },
        { t: 'li', text: 'Smooth, prosperous life with strong male progeny support.' },
        { t: 'li', text: 'Linked to Kubera’s supportive energy.' },
        { t: 'p', text: 'Top West entrance.' },
      ],
    },
    W5: {
      heading: 'W5 (Varuna) [✅] – The Discipline & Efficiency Zone',
      blocks: [
        { t: 'li', text: 'Enforces systematic work habits, operational excellence, and financial success.' },
        { t: 'li', text: 'Risk of emotional coldness or over-ambition if not balanced.' },
        { t: 'li', text: 'Good for large-scale operations when managed consciously.' },
        { t: 'p', text: 'Positive with awareness.' },
      ],
    },
    W6: {
      heading: 'W6 (Asura) [🚫] – The Paranoia & Stress Zone',
      blocks: [
        { t: 'li', text: 'Deep business anxieties, fear of takeovers, and self-sabotaging suspicion.' },
        { t: 'li', text: 'Depression and mental fatigue become common.' },
        { t: 'p', text: 'Avoid.' },
      ],
    },
    W7: {
      heading: 'W7 (Shok / Shosha) [🚫] – The Sorrow & Drain Zone',
      blocks: [
        { t: 'li', text: 'Emotional trauma, vulnerability to addictions, rapid cash drain, and deep household grief.' },
        { t: 'li', text: 'Loss of general happiness.' },
        { t: 'p', text: 'Avoid.' },
      ],
    },
    W8: {
      heading: 'W8 (Papa-Yakshma) [🚫] – The Terminal Decay Zone',
      blocks: [
        { t: 'li', text: 'Chronic treatment-resistant illnesses, legal degradation, unethical tendencies, and collapse of family harmony.' },
        { t: 'li', text: 'Male members may stay away from home.' },
        { t: 'p', text: 'Strictly avoid.' },
      ],
    },
  },
};

const COMMERCIAL: Section = {
  intro: ['Commercial Impact & Deep Analysis:'],
  padas: {
    N1: {
      heading: '1. N1 (Roga) — 🚫 [AVOID / HIGHLY DANGEROUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Entrances located in N1 trigger immediate, unprovoked hostility from market competitors and regulatory authorities.' },
        { t: 'li', text: 'Businesses face sudden, aggressive legal notices, unexpected labor strikes, and harsh scrutiny from tax departments or municipal boards.' },
        { t: 'li', text: 'Cash flow is chronically choked by recurring court fines, legal defense fees, and operational bottlenecks that bring business activities to a complete standstill.' },
        { t: 'li', text: 'Energetically, this pada disrupts the watery stability required for smooth liquidity, turning fluid capital into blocked funds trapped in litigation.' },
      ],
    },
    N2: {
      heading: '2. N2 (Naga) — ❌ [BAD / INAUSPICIOUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Commercial partnerships initiated or operated through N2 frequently succumb to hidden agendas, internal backstabbing, and fraudulent breaches of trust.' },
        { t: 'li', text: 'Employees in these setups often leak confidential trade secrets, client databases, and pricing strategies to direct competitors.' },
        { t: 'li', text: 'Furthermore, corporate clients and credit buyers deliberately delay invoice clearances, forcing management into severe mental stress and working capital shortages.' },
        { t: 'li', text: 'This pada fosters an underlying current of suspicion, destroying team cohesion and vendor confidence over time.' },
      ],
    },
    N3: {
      heading: '3. N3 (Mukhya) — ⭐ [GOOD / HIGHLY AUSPICIOUS - RECOMMENDED ENTRY]',
      blocks: [
        { t: 'li', text: 'Widely recognized as a powerhouse entrance for corporate offices, retail showrooms, and customer-facing commercial spaces.' },
        { t: 'li', text: 'Mukhya naturally draws genuine, high-intent, and repeat customers through the door.' },
        { t: 'li', text: 'It maintains an ideal equilibrium between incoming revenue and operational outgoings, successfully building robust financial reserves and rainy-day capital essential for long-term business survival and expansion.' },
        { t: 'li', text: 'It aligns perfectly with Kubera’s abundance frequency, ensuring that commercial energy welcomes regular customer influx without friction.' },
      ],
    },
    N4: {
      heading: '4. N4 (Bhallat / Bhallata) — ⭐ [GOOD / HIGHLY AUSPICIOUS - RECOMMENDED ENTRY]',
      blocks: [
        { t: 'li', text: 'The ultimate orientation for retail billing cash counters, corporate bank vaults, high-frequency trading desks, and executive headquarters.' },
        { t: 'li', text: 'Inventory and stock move out rapidly at profit-multiplying speeds, preventing dead stock accumulation.' },
        { t: 'li', text: 'The brand builds substantial market authority, effortlessly networking with high-net-worth clients and institutional buyers to multiply gross margins.' },
        { t: 'li', text: 'It represents accumulated wealth and multi-fold financial multiplication, turning modest inventory investments into high-yield commercial returns.' },
      ],
    },
    N5: {
      heading: '5. N5 (Soma) — ⭐ [GOOD / HIGHLY AUSPICIOUS - RECOMMENDED ENTRY]',
      blocks: [
        { t: 'li', text: 'Streamlines raw material procurement, vendor coordination, and logistics networks with exceptional fluidity.' },
        { t: 'li', text: 'Suppliers and manufacturers dispatch inventory without delays, corporate clients clear advance payments smoothly, and internal management stress remains remarkably low.' },
        { t: 'li', text: 'It guarantees a steady, reliable financial turnover and predictable daily cash inflows. It acts as a stabilizing bridge between operational execution and financial reward, ensuring frictionless trade relationships.' },
      ],
    },
    N6: {
      heading: '6. N6 (Bhujag / Bhujanga) — ⚠️ [AVERAGE / MODERATE - CONDITIONAL ENTRY]',
      blocks: [
        { t: 'li', text: 'Induces highly erratic, unpredictable revenue cycles that make financial forecasting nearly impossible.3' },
        { t: 'li', text: 'Sales figures skyrocket unexpectedly for a brief, deceptive window, only to be followed by prolonged months of absolute market silence and zero customer walk-ins.' },
        { t: 'li', text: 'Speculative investments and expansion bets placed here suffer sharp, sudden losses.' },
        { t: 'li', text: 'The serpentine energy of Bhujanga creates sudden loops of high activity followed by hibernation, disrupting steady corporate growth.' },
      ],
    },
    N7: {
      heading: '7. N7 (Aditi) — ❌ [BAD / INAUSPICIOUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Characterized by a complete breakdown of internal corporate governance, chain of command, and leadership control.' },
        { t: 'li', text: 'Junior operational staff and floor workers openly defy management directives, creating high employee turnover, union friction, and chaotic workplace environments.' },
        { t: 'li', text: 'Management spends more time resolving internal disputes than driving revenue.' },
        { t: 'li', text: 'It weakens organizational discipline, leading to a porous operational structure where accountability is entirely lost.' },
      ],
    },
    N8: {
      heading: '8. N8 (Diti) — 🚫 [AVOID / HIGHLY DANGEROUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Drives aggressive, short-sighted cost-cutting measures motivated by scarcity and fear, which severely compromise product and service quality. This drop in output standards invites harsh market rejection, the rapid loss of elite clientele, and catastrophic capital erosion.' },
        { t: 'li', text: 'Saving pennies on operations results in losing millions in market valuation.' },
        { t: 'li', text: 'It destroys long-term brand equity in exchange for short-term, desperate financial savings, alienating the core consumer base.' },
      ],
    },
    E1: {
      heading: '9. E1 (Shikhi) — 🚫 [AVOID / HIGHLY DANGEROUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Prone to frequent electrical short circuits, server data crashes, heavy industrial machinery breakdowns, and unexpected worker injuries on the factory shop floor.' },
        { t: 'li', text: 'Businesses face sudden, disruptive regulatory shocks, electrical board penalties, or abrupt operational shutdowns due to fire safety violations and equipment failures.' },
        { t: 'li', text: 'It mismanages raw fiery energy near the boundary, converting creative spark into destructive hazards and technical malfunctions.' },
      ],
    },
    E2: {
      heading: '10. E2 (Parjanya) — ❌ [BAD / INAUSPICIOUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Heavy marketing budgets, expansive promotional campaigns, and bloated office overheads yield a complete zero return on investment (ROI).' },
        { t: 'li', text: 'Advertising expenses drain working capital relentlessly without generating matching customer conversions, leaving the business cash-strapped with expensive, unproductive infrastructure.' },
        { t: 'li', text: 'It generates clouds of unrealized potential that rain heavy expenses down upon the enterprise without yielding actual harvestable fruit.' },
      ],
    },
    E3: {
      heading: '11. E3 (Jayanta) — ⭐ [GOOD / HIGHLY AUSPICIOUS - RECOMMENDED ENTRY]',
      blocks: [
        { t: 'li', text: 'Exceptional orientation for law firms, aggressive sales organizations, political campaign offices, dynamic startups, and corporate boardrooms.' },
        { t: 'li', text: 'Consistently secures victory in competitive market biddings, government tenders, high-stakes negotiations, and rapid client acquisition drives, ensuring the enterprise stays ahead of market rivals.' },
        { t: 'li', text: 'It infuses the enterprise with competitive vigor, ensuring that leadership ideas successfully conquer market resistance and secure mandates.' },
      ],
    },
    E4: {
      heading: '12. E4 (Indra) — ⭐ [GOOD / HIGHLY AUSPICIOUS - RECOMMENDED ENTRY]',
      blocks: [
        { t: 'li', text: 'Outstanding for public relations (PR) firms, media houses, corporate liaison offices, and administrative headquarters.' },
        { t: 'li', text: 'Effortlessly secures high-value government contracts, licensing approvals, and institutional patronage. Builds lasting corporate influence, commanding industry respect and regulatory backing.' },
        { t: 'li', text: 'It aligns the enterprise with sovereign authority, making it easier to navigate bureaucratic hurdles and secure elite institutional status.' },
      ],
    },
    E5: {
      heading: '13. E5 (Surya) — ⚠️ [AVERAGE / MODERATE - CONDITIONAL ENTRY]',
      blocks: [
        { t: 'li', text: 'Fosters an autocratic, ego-driven leadership style that systematically alienates top corporate talent.' },
        { t: 'li', text: 'Triggers workforce rebellions, union strikes, severe internal friction, and sudden walkouts by key institutional clients who refuse to deal with rigid management attitudes.' },
        { t: 'li', text: 'Unbalanced solar intensity scorches collaborative relationships, turning leaders into isolated figures surrounded by dissent.' },
      ],
    },
    E6: {
      heading: '14. E6 (Satya) — ❌ [BAD / INAUSPICIOUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Chronic, systemic failures to deliver products, projects, or services on committed schedules trigger heavy market penalties and legal grey areas.' },
        { t: 'li', text: 'Vendor contracts are frequently broken or litigated, resulting in a severely tarnished commercial credit score and permanent loss of market trust.' },
        { t: 'li', text: 'It undermines the foundational promise of truth and delivery, leading counterparties to pull back credit lines and business agreements.' },
      ],
    },
    E7: {
      heading: '15. E7 (Bhrisha) — 🚫 [AVOID / HIGHLY DANGEROUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Cultivates a toxic, cutthroat corporate culture marked by high employee grievance rates, internal backstabbing, severe labour dissatisfaction, and public scandals that trigger widespread customer boycotts and brand defamation across digital platforms.' },
        { t: 'li', text: 'It amplifies organizational negativity, turning internal friction into public-facing reputational damage.' },
      ],
    },
    E8: {
      heading: '16. E8 (Akash) — 🚫 [AVOID / HIGHLY DANGEROUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Invites severe internal financial embezzlement, inventory pilferage by trusted staff, sudden corporate bankruptcy, and total business insolvency.' },
        { t: 'li', text: 'Assets are rapidly liquidated under court orders or creditor pressure, wiping out years of entrepreneurial effort overnight.' },
        { t: 'li', text: 'It represents absolute space and emptiness; physical and financial assets vanish into thin air due to unchecked fraudulent practices.' },
      ],
    },
    S1: {
      heading: '17. S1 (Anil / Anila) — ❌ [BAD / INAUSPICIOUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Erratic top-level decision-making leads to flawed product rollouts, unstable business strategies, and sudden leadership failures.' },
        { t: 'li', text: 'Management constantly changes direction mid-project, confusing middle management and destabilizing ongoing commercial operations.' },
        { t: 'li', text: 'Wind elements destabilize southern grounding, causing corporate strategies to shift direction with every changing market breeze.' },
      ],
    },
    S2: {
      heading: '18. S2 (Poosha / Pushan) — ⚠️ [AVERAGE / MODERATE - CONDITIONAL ENTRY]',
      blocks: [
        { t: 'li', text: 'Completely unsuitable for ambitious business owners seeking expansion.' },
        { t: 'li', text: 'The enterprise may manage day-to-day survival on bare minimum profit margins, but scaling up, opening new branch offices, expanding manufacturing capacity, or raising venture capital is entirely blocked.' },
        { t: 'li', text: 'It keeps the business locked in a permanent survival loop, denying it the momentum required to break into higher tiers of market success.' },
      ],
    },
    S3: {
      heading: '19. S3 (Vitatha) — ⚠️ [AVERAGE / MODERATE - CONDITIONAL ENTRY]',
      blocks: [
        { t: 'li', text: 'Highly profitable for short-term speculative trading, stock market operations, and opportunistic business ventures, but carries severe, ongoing vulnerability to sudden regulatory raids, tax department scrutiny, and compliance audits that freeze operations.' },
        { t: 'li', text: 'It operates in a legal grey zone where high financial gains are perpetually counterbalanced by the threat of investigative exposure.' },
      ],
    },
    S4: {
      heading: '20. S4 (Grihrakshita / Grihakshata) — ⭐ [GOOD / HIGHLY AUSPICIOUS - RECOMMENDED ENTRY]',
      blocks: [
        { t: 'li', text: 'Exceptional for private security agencies, corporate headquarters, and large-scale manufacturing hubs.' },
        { t: 'li', text: 'Successfully safeguards heavy industrial machinery, capital assets, and intellectual property against external theft, industrial espionage, and aggressive competitor sabotage.' },
        { t: 'li', text: 'It acts as an impenetrable protective shield for physical infrastructure, ensuring heavy assets remain secure and productive.' },
      ],
    },
    S5: {
      heading: '21. S5 (Yama) — 🚫 [AVOID / HIGHLY DANGEROUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Drives catastrophic business failure, heavy unrecoverable market liabilities, severe debt traps, bank asset seizures, and forced commercial liquidation. Loans default rapidly, and creditors force the legal shutdown of all commercial operations.' },
        { t: 'li', text: 'The domain of Karmic justice and finality; unmanaged liabilities collapse under the weight of strict regulatory and financial reckoning.' },
      ],
    },
    S6: {
      heading: '22. S6 (Gandharva) — ❌ [BAD / INAUSPICIOUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Characterized by extravagant, wasteful spending on luxury office interiors, ostentatious corporate parties, and excessive entertainment budgets with zero operational productivity.' },
        { t: 'li', text: 'This drains core working capital, leaving the business cash-starved for essential manufacturing inputs.' },
        { t: 'li', text: 'It prioritizes superficial glamor and sensory indulgence over bottom-line productivity, eroding financial substance for flashy appearance.' },
      ],
    },
    S7: {
      heading: '23. S7 (Bhringraj) — 🚫 [AVOID / HIGHLY DANGEROUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Continuous, bleeding financial losses despite working exhaustive hours, putting in maximum physical labor, running heavy multi-shift operations, and repeatedly injecting fresh personal capital into the failing business venture.' },
        { t: 'li', text: 'High sweat equity yields negative financial returns, trapping the entrepreneur in an exhausting cycle of unrewarded toil.' },
      ],
    },
    S8: {
      heading: '24. S8 (Mriga) — 🚫 [AVOID / HIGHLY DANGEROUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Results in total business closure, complete legal forfeiture of commercial assets, permanent business partnership dissolution, and massive unmanageable debt liabilities that cripple future entrepreneurial endeavors.' },
        { t: 'li', text: 'It represents the extreme boundary of southern dissolution, where commercial ventures meet permanent termination and asset stripping.' },
      ],
    },
    W1: {
      heading: '25. W1 (Pitra / Pitrigan) — 🚫 [AVOID / HIGHLY DANGEROUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Triggers the rapid loss of generational family business legacies, the erosion of accumulated commercial capital, and the complete failure to successfully pass down established trade networks and client portfolios to business successors.' },
        { t: 'li', text: 'It breaks ancestral and foundational commercial continuity, causing inherited wealth and market standing to dissipate quickly.' },
      ],
    },
    W2: {
      heading: '26. W2 (Dwarik / Dauwarik) — ❌ [BAD / INAUSPICIOUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Commercial deals stall permanently right at the final documentation and signing stage. Government licenses, export permits, bank loan approvals, and institutional funding requests are consistently rejected or indefinitely delayed by authorities.' },
        { t: 'li', text: 'It acts as a gatekeeper that denies entry and approval, keeping vital commercial transactions trapped in perpetual bureaucratic limbo.' },
      ],
    },
    W3: {
      heading: '27. W3 (Sugriva) — ⭐ [GOOD / HIGHLY AUSPICIOUS - RECOMMENDED ENTRY]',
      blocks: [
        { t: 'li', text: 'Ideal for large-scale trade houses, manufacturing distribution networks, B2B corporate consultants, and educational institutions.' },
        { t: 'li', text: 'Builds highly reliable supply chains, stable liquid capital, and sustainable long-term growth with consistent, healthy profit margins.' },
        { t: 'li', text: 'It aligns with commercial distribution channels, ensuring smooth movement of goods from warehouses to end-market buyers.' },
      ],
    },
    W4: {
      heading: '28. W4 (Pushpdanta) — ⭐ [GOOD / HIGHLY AUSPICIOUS - RECOMMENDED ENTRY]',
      blocks: [
        { t: 'li', text: 'Outstanding location for commercial banks, jewelry showrooms, financial institutions, and major corporate headquarters.' },
        { t: 'li', text: 'Drives exponential asset accumulation, massive cash reserves, and high-end commercial scaling with minimal resistance.' },
        { t: 'li', text: 'The premier wealth-accumulation pada of the West, anchoring corporate reserves and long-term asset security.' },
      ],
    },
    W5: {
      heading: '29. W5 (Varun) — ⭐ [GOOD / HIGHLY AUSPICIOUS - RECOMMENDED ENTRY]',
      blocks: [
        { t: 'li', text: 'Excellent for import-export firms, shipping and logistics enterprises, and large-scale corporate operations requiring strict administrative efficiency, foreign trade navigation, and rigorous liquid asset management.' },
        { t: 'li', text: 'It harnesses oceanic and global trade energies, facilitating cross-border transactions and seamless maritime or overland logistics.' },
      ],
    },
    W6: {
      heading: '30. W6 (Asur / Asura) — ❌ [BAD / INAUSPICIOUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'High exposure to complex corporate fraud, fake joint-venture investments, fear of aggressive hostile takeovers, and severe betrayal by fraudulent business partners, co-directors, or financial backers.' },
        { t: 'li', text: 'It attracts illusory and deceptive commercial energies, inviting cunning adversaries who seek to manipulate company ownership structures.' },
      ],
    },
    W7: {
      heading: '31. W7 (Shauka / Shosha) — 🚫 [AVOID / HIGHLY DANGEROUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Plagued by persistently low employee morale, high absenteeism, chronic cash crunches, and slow, continuous financial bleeding that starves the business of the working capital needed to fulfill daily orders.' },
        { t: 'li', text: 'It gradually drains financial vitality and staff enthusiasm, creating an atmosphere of quiet resignation and slow business decay.' },
      ],
    },
    W8: {
      heading: '32. W8 (Papyakshama) — 🚫 [AVOID / HIGHLY DANGEROUS - RESTRICTED ENTRY]',
      blocks: [
        { t: 'li', text: 'Implicates the enterprise and its directors in serious financial crimes, hawala investigations, money laundering inquiries, sudden tax evasion raids, and absolute commercial ruin leading to criminal prosecution.' },
        { t: 'li', text: 'It represents the zone of ultimate ethical and financial collapse, where illicit shortcuts culminate in total structural devastation.' },
      ],
    },
  },
};

const REMEDIES: Section = {
  intro: [],
  padas: {
    N1: {
      heading: '1. N1 – Roga',
      blocks: [
        { t: 'p', text: 'Remedies: -' },
        { t: 'li', text: 'Place copper strip under the threshold.' },
        { t: 'li', text: 'Hang Ganesha + Swastik + Om on both sides of the door.' },
        { t: 'li', text: 'Paint door in light green or blue.' },
        { t: 'li', text: 'Keep a small copper kalash with water + coin near the entrance (change weekly).' },
        { t: 'li', text: 'Place Roga-nashak yantra or pyramid outside the door.' },
      ],
    },
    N2: {
      heading: '2. N2 – Naga',
      blocks: [
        { t: 'p', text: 'Remedies:' },
        { t: 'li', text: 'Copper strip at threshold.' },
        { t: 'li', text: 'Place Naga dosh nivaran yantra.' },
        { t: 'li', text: 'Keep a small plant (money plant or tulsi) near entrance.' },
        { t: 'li', text: 'Use white or light blue colour on door.' },
        { t: 'li', text: 'Light a ghee diya daily facing north.' },
      ],
    },
    N3: {
      heading: '3. N3 – Mukhya (Highly Auspicious)',
      blocks: [
        { t: 'p', text: 'Remedies (to enhance):' },
        { t: 'li', text: 'Keep the area clean and well-lit.' },
        { t: 'li', text: 'Place Kuber yantra or Lakshmi-Kuber photo.' },
        { t: 'li', text: 'Use green colour accents.' },
        { t: 'li', text: 'Hang wind chime or small bell.' },
      ],
    },
    N4: {
      heading: '4. N4 – Bhallata (Highly Auspicious)',
      blocks: [
        { t: 'p', text: 'Remedies (to enhance): Same as N3 + place a small water feature or blue crystal near entrance.' },
      ],
    },
    N5: {
      heading: '5. N5 – Soma (Highly Auspicious)',
      blocks: [
        { t: 'p', text: 'Remedies (to enhance): Silver items, white/moon-related décor, keep area bright.' },
      ],
    },
    N6: {
      heading: '6. N6 – Bhujanga',
      blocks: [
        { t: 'p', text: 'Remedies:' },
        { t: 'li', text: 'Copper strip.' },
        { t: 'li', text: 'Place Bhujanga-related or health yantra.' },
        { t: 'li', text: 'Use light colours; keep entrance clutter-free.' },
        { t: 'li', text: 'Hang protective symbols (Trishul + Om).' },
      ],
    },
    N7: {
      heading: '7. N7 – Aditi',
      blocks: [
        { t: 'p', text: 'Remedies:' },
        { t: 'li', text: 'Copper strip + Ganesha on both sides.' },
        { t: 'li', text: 'Aditi or protection yantra.' },
        { t: 'li', text: 'Keep entrance brightly lit and positive.' },
      ],
    },
    N8: {
      heading: '8. N8 – Diti',
      blocks: [
        { t: 'p', text: 'Remedies: Copper strip, clean threshold, positive symbols, light blue/white colour.' },
      ],
    },
    E1: {
      heading: '9. E1 – Shikhi',
      blocks: [
        { t: 'p', text: 'Remedies:' },
        { t: 'li', text: 'Brass/copper strip under threshold.' },
        { t: 'li', text: 'Red or orange door colour (controlled).' },
        { t: 'li', text: 'Place Agni or fire-balancing yantra + Ganesha.' },
        { t: 'li', text: 'Keep a small water bowl near entrance to balance fire.' },
      ],
    },
    E2: {
      heading: '10. E2 – Parjanya',
      blocks: [
        { t: 'p', text: 'Remedies:' },
        { t: 'li', text: 'Brass/copper strip.' },
        { t: 'li', text: 'Place fertility/positive yantra.' },
        { t: 'li', text: 'Use yellow or light green colour.' },
        { t: 'li', text: 'Hang wind chime.' },
      ],
    },
    E3: {
      heading: '11. E3 – Jayanta (Highly Auspicious)',
      blocks: [
        { t: 'p', text: 'Remedies (to enhance): Keep bright, place Indra/Jayanta yantra or rising sun image, green/yellow accents.' },
      ],
    },
    E4: {
      heading: '12. E4 – Indra (Highly Auspicious)',
      blocks: [
        { t: 'p', text: 'Remedies (to enhance): Same as E3 + place Indra yantra or leadership symbols.' },
      ],
    },
    E5: {
      heading: '13. E5 – Surya',
      blocks: [
        { t: 'p', text: 'Remedies:' },
        { t: 'li', text: 'Brass strip.' },
        { t: 'li', text: 'Soften with water element (small fountain or blue item).' },
        { t: 'li', text: 'Light yellow/orange colour (not pure red).' },
        { t: 'li', text: 'Surya yantra if needed for balance.' },
      ],
    },
    E6: {
      heading: '14. E6 – Satya',
      blocks: [
        { t: 'p', text: 'Remedies:' },
        { t: 'p', text: '1. Brass strip, Satya or truth-related yantra' },
        { t: 'p', text: '2. clean bright entrance, white/yellow colour.' },
      ],
    },
    E7: {
      heading: '15. E7 – Bhrisha',
      blocks: [
        { t: 'p', text: 'Remedies: Brass strip, calming colours (cream/light yellow), protective symbols, pyramid.' },
      ],
    },
    E8: {
      heading: '16. E8 – Akasha',
      blocks: [
        { t: 'p', text: 'Remedies: Brass strip, keep entrance open and bright, place space-balancing crystal or yantra, avoid clutter.' },
      ],
    },
    S1: {
      heading: '17. S1 – Anila',
      blocks: [
        { t: 'p', text: 'Remedies: Iron/lead strip, protective Hanuman image, red/maroon door colour (controlled), pyramid.' },
      ],
    },
    S2: {
      heading: '18. S2 – Pusha.',
      blocks: [
        { t: 'p', text: 'Remedies: Iron/lead strip, strength yantra, keep entrance strong and heavy-looking.' },
      ],
    },
    S3: {
      heading: '19. S3 – Vitatha (Good for some professionals)',
      blocks: [
        { t: 'p', text: 'Remedies (to enhance or balance): Iron strip if needed, Surya or fame symbols, bright lighting.' },
      ],
    },
    S4: {
      heading: '20. S4 – Grihakshata (Auspicious)',
      blocks: [
        { t: 'p', text: 'Remedies (to enhance): Keep clean, place prosperity yantra, red accents carefully.' },
      ],
    },
    S5: {
      heading: '21. S5 – Yama',
      blocks: [
        { t: 'p', text: 'Remedies: Iron/lead strip, Yama-balancing or protection yantra, Hanuman idol, red colour, heavy threshold.' },
      ],
    },
    S6: {
      heading: '22. S6 – Gandharva',
      blocks: [
        { t: 'p', text: 'Remedies: Iron strip, heavy door, protection symbols, avoid light colours, place earth-element items.' },
      ],
    },
    S7: {
      heading: '23. S7 – Bhringraj',
      blocks: [
        { t: 'p', text: 'Remedies: Iron strip, protective yantra + Hanuman ji, keep entrance strong.' },
      ],
    },
    S8: {
      heading: '24. S8 – Mriga / Nirriti zone',
      blocks: [
        { t: 'p', text: 'Remedies: Iron/lead strip, full protection set (Ganesha + Hanuman + Trishul + Om), pyramid in SW, heavy threshold, red/maroon colour.' },
      ],
    },
    W1: {
      heading: '25. W1 – Pitra',
      blocks: [
        { t: 'p', text: 'Remedies: Silver/steel strip, Pitra or ancestral yantra, keep clean, light a diya for ancestors weekly.' },
      ],
    },
    W2: {
      heading: '26. W2 – Dauvarika',
      blocks: [
        { t: 'p', text: 'Remedies: Silver/steel strip, wealth-retention yantra, green/blue accents.' },
      ],
    },
    W3: {
      heading: '27. W3 – Sugriva',
      blocks: [
        { t: 'p', text: 'Remedies: Silver strip, balance with prosperity symbols, keep bright.' },
      ],
    },
    W4: {
      heading: '28. W4 – Pushpadanta (Auspicious)',
      blocks: [
        { t: 'p', text: 'Remedies (to enhance): Silver items, prosperity yantra, clean and bright entrance.' },
      ],
    },
    W5: {
      heading: '29. W5 – Varuna (Auspicious)',
      blocks: [
        { t: 'p', text: 'Remedies (to enhance): Blue/silver colour, water-related symbols, Varuna or ocean-themed décor carefully.' },
      ],
    },
    W6: {
      heading: '30. W6 – Asura',
      blocks: [
        { t: 'p', text: 'Remedies: Silver/steel strip, protection yantra, keep entrance strong and well-lit.' },
      ],
    },
    W7: {
      heading: '31. W7 – Shosha',
      blocks: [
        { t: 'p', text: 'Remedies: Silver strip, health + wealth balancing yantra, avoid excess dryness (add small plant).' },
      ],
    },
    W8: {
      heading: '32. W8 – Papayakshma',
      blocks: [
        { t: 'p', text: 'Remedies: Silver/steel strip, purification yantra,' },
        { t: 'p', text: 'daily cleaning + positive affirmations, protective symbols.' },
      ],
    },
  },
};

export const COMMERCIAL_MATRIX = {

  title: 'Commercial Master Selection Matrix',

  header: ['Direction', 'Good / Highly Auspicious [⭐] (Recommended)', 'Average / Moderate [⚠️] (Conditional)', 'Bad / Inauspicious [❌] (Avoid)', 'Avoided / Highly Dangerous [🚫] (Restricted)'],

  rows: [

    ['North', 'N3, N4, N5', 'N6', 'N2, N7', 'N1, N8'],

    ['East', 'E3, E4', 'E5', 'E2, E6', 'E1, E7, E8'],

    ['South', 'S4', 'S2, S3', 'S1, S6', 'S5, S7, S8'],

    ['West', 'W3, W4, W5', '—', 'W2, W6', 'W1, W7, W8'],

  ],

} as const;

export type EntranceAspect = 'residential' | 'commercial' | 'remedies';

const SECTIONS: Record<EntranceAspect, Section> = {
  residential: RESIDENTIAL,
  commercial: COMMERCIAL,
  remedies: REMEDIES,
};

/** One pada's reading from one of the three documents. */
export function entranceEntry(aspect: EntranceAspect, code?: string | null): PadaEntry | null {
  if (!code) return null;
  return SECTIONS[aspect].padas[code.toUpperCase()] ?? null;
}

/** The line a document opens with, before its first pada. */
export function entranceIntro(aspect: EntranceAspect): string[] {
  return SECTIONS[aspect].intro;
}

/** The heading without the document's list number: "3. N3 (Mukhya) …" → "N3 (Mukhya) …". */
export function entranceHeading(entry: PadaEntry): string {
  return entry.heading.replace(/^\d{1,2}\.\s*/, '');
}
