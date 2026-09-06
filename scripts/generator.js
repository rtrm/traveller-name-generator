const MODULE_ID = "traveller-name-generator";

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function esc(s) {
  return (s || "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

// ---------------------------------------------------------------------------
// Solomani names — evolved Terran (Anglic) names, deliberately spread across
// a few Earth-culture flavors per the source material (American/European,
// Hispanic, Slavic, Chinese). These are ordinary real-world-style name
// pools, not a constructed language, so they're just curated lists.
// ---------------------------------------------------------------------------
const SOLOMANI_CULTURES = {
  anglo: {
    label: "Anglo",
    male: ["James", "William", "Henry", "Alexander", "Benjamin", "Samuel", "Daniel", "Nathaniel", "Charles", "Edward", "Frederick", "Arthur", "Owen", "Marcus", "Julian", "Simon", "Gregory", "Adrian", "Victor", "Nolan"],
    female: ["Elizabeth", "Margaret", "Charlotte", "Eleanor", "Catherine", "Amelia", "Victoria", "Sophia", "Alice", "Emily", "Grace", "Claire", "Diana", "Rachel", "Julia", "Vivian", "Rosalind", "Miranda", "Fiona", "Nadia"],
    surname: ["Sterling", "Whitfield", "Ashworth", "Bancroft", "Harrow", "Kensington", "Fairweather", "Blackwood", "Winters", "Hale", "Sinclair", "Radcliffe", "Ashford", "Thorne", "Merrick", "Halloway", "Pemberton", "Stanton", "Fenwick", "Calloway"],
  },
  latin: {
    label: "Latin",
    male: ["Alejandro", "Rafael", "Diego", "Mateo", "Santiago", "Emilio", "Lorenzo", "Marco", "Antonio", "Gabriel", "Rodrigo", "Vicente", "Salvador", "Esteban", "Ignacio", "Fernando", "Ricardo", "Adriano", "Julio", "Nicolas"],
    female: ["Maria", "Isabella", "Sofia", "Valentina", "Camila", "Lucia", "Elena", "Carmen", "Adriana", "Beatriz", "Paloma", "Rosa", "Teresa", "Valeria", "Ines", "Alejandra", "Gabriela", "Marisol", "Renata", "Ximena"],
    surname: ["Reyes", "Castillo", "Vargas", "Delgado", "Ortega", "Navarro", "Mendoza", "Salazar", "Fuentes", "Aguilar", "Cabrera", "Rios", "Guerrero", "Montoya", "Espinoza", "Carrasco", "Bautista", "Valdez", "Serrano", "Marquez"],
  },
  slavic: {
    label: "Slavic",
    male: ["Alexei", "Dmitri", "Nikolai", "Ivan", "Sergei", "Mikhail", "Vladimir", "Pavel", "Yuri", "Boris", "Anton", "Viktor", "Roman", "Igor", "Andrei", "Stepan", "Leonid", "Grigori", "Maksim", "Oleg"],
    female: ["Anastasia", "Yekaterina", "Natalya", "Svetlana", "Olga", "Irina", "Tatiana", "Larissa", "Galina", "Vera", "Zoya", "Ksenia", "Marina", "Polina", "Yelena", "Nadia", "Oksana", "Raisa", "Valeria", "Yulia"],
    surname: ["Novikov", "Volkov", "Petrov", "Sokolov", "Morozov", "Kuznetsov", "Belova", "Zhukov", "Antonov", "Baranov", "Semenov", "Kalinin", "Voronov", "Bogdanov", "Chernov", "Ivashkin", "Sorokin", "Yashin", "Zaitsev", "Orlova"],
  },
  chinese: {
    label: "Chinese",
    male: ["Wei", "Jian", "Hao", "Feng", "Ming", "Lei", "Qiang", "Yong", "Bo", "Chen", "Jun", "Kai", "Long", "Peng", "Tao", "Xin", "Yang", "Zhi", "Cheng", "Han"],
    female: ["Mei", "Ling", "Xia", "Yan", "Fang", "Hui", "Jing", "Lan", "Na", "Qing", "Rui", "Shan", "Ting", "Xue", "Ying", "Yun", "Zhen", "Hua", "Li", "Wen"],
    surname: ["Chen", "Wang", "Li", "Zhang", "Liu", "Yang", "Huang", "Zhao", "Wu", "Zhou", "Sun", "Ma", "Zhu", "Hu", "Guo", "He", "Lin", "Gao", "Luo", "Song"],
  },
};
const SOLOMANI_CULTURE_IDS = Object.keys(SOLOMANI_CULTURES);

function solomaniCulture(id) {
  if (id && SOLOMANI_CULTURES[id]) return SOLOMANI_CULTURES[id];
  return SOLOMANI_CULTURES[pick(SOLOMANI_CULTURE_IDS)];
}

function solomaniFirstName(cultureId, gender) {
  const c = solomaniCulture(cultureId);
  const g = gender === "male" || gender === "female" ? gender : pick(["male", "female"]);
  return pick(c[g]);
}

function solomaniSurname(cultureId) {
  return pick(solomaniCulture(cultureId).surname);
}

function generateSolomaniName(cultureId, gender) {
  const c = solomaniCulture(cultureId);
  const g = gender === "male" || gender === "female" ? gender : pick(["male", "female"]);
  return `${pick(c[g])} ${pick(c.surname)}`;
}

// ---------------------------------------------------------------------------
// Vilani names — agglutinative, vowel-heavy, with doubled consonants (kk,
// sh, nn, rr, gg). Real canonical examples (from Mongoose/Freelance
// Traveller sources) are mixed in directly for authenticity; the rest are
// built from syllable fragments reverse-engineered from those same examples.
// Vilani doesn't clearly gender-mark by sound in the available source
// material, so "gender" here only affects which canonical examples get
// pulled in — the syllable engine itself is shared.
// ---------------------------------------------------------------------------
const VILANI_CANON_MALE = ["Adkhar", "Eneri", "Enli", "Ganidiirsi", "Shannash", "Mazun", "Khugi", "Ishugi", "Ganimakkur", "Riga", "Khazuni"];
const VILANI_CANON_FEMALE = ["Gamaagin", "Nashu", "Sharikkamur", "Shana", "Iikush", "Musush", "Eshi", "Tamesha", "Kaagira", "Eleni"];
const VILANI_CANON_CLAN = ["Akrashash", "Amikshuke", "Anasha", "Dagaarmaashra", "Darrashnu", "Gashirrishu"];

const VILANI_STARTS = ["a", "e", "i", "u", "o", "ga", "sha", "kha", "ma", "na", "ri", "ta", "ka", "da", "za", "gha", "mi", "shu", "khu", "dar"];
const VILANI_MIDS = ["ma", "ni", "ku", "ri", "sha", "kha", "gi", "du", "zu", "shi", "gu", "ta", "na", "ra", "ki", "mu", "ssa", "nni", "ggu", "rri", "maa", "gaar", "rash"];
const VILANI_ENDS = ["kkur", "ggin", "shu", "nash", "zun", "ghi", "kush", "asha", "ashra", "ashnu", "ishu", "uke", "ash", "irsi", "amur", "eri", "ali", "unu", "ika", "oshi", "gira", "sush"];

function buildVilaniSyllableName(minParts) {
  let name = pick(VILANI_STARTS);
  const parts = minParts + (Math.random() < 0.5 ? 1 : 0);
  for (let i = 0; i < parts; i++) name += pick(VILANI_MIDS);
  name += pick(VILANI_ENDS);
  return cap(name);
}

function vilaniPersonalName(gender) {
  // ~35% of the time, draw a real canonical example for an authenticity anchor.
  if (Math.random() < 0.35) {
    if (gender === "male") return pick(VILANI_CANON_MALE);
    if (gender === "female") return pick(VILANI_CANON_FEMALE);
    return pick([...VILANI_CANON_MALE, ...VILANI_CANON_FEMALE]);
  }
  return buildVilaniSyllableName(0);
}

function vilaniClanName() {
  if (Math.random() < 0.3) return pick(VILANI_CANON_CLAN);
  return buildVilaniSyllableName(1);
}

function vilaniSocialName() {
  // No canonical examples survive for this rarely-used component; approximated
  // with the same syllable engine, kept short.
  return buildVilaniSyllableName(0);
}

function generateVilaniName(gender, includeClan, includeSocial) {
  const parts = [vilaniPersonalName(gender)];
  if (includeSocial) parts.push(vilaniSocialName());
  if (includeClan) parts.push(vilaniClanName());
  return parts.join(" ");
}

// ---------------------------------------------------------------------------
// Mixed Solomani/Vilani heritage names — a Solomani given name paired with a
// Vilani-style clan name, or the reverse, for frontier/mixed-culture NPCs.
// ---------------------------------------------------------------------------
function generateMixedName(style, gender) {
  const useSolFirst = style === "sol-first" || (style === "random" && Math.random() < 0.5);
  if (useSolFirst) {
    return `${solomaniFirstName(null, gender)} ${vilaniClanName()}`;
  }
  return `${vilaniPersonalName(gender)} ${solomaniSurname(null)}`;
}

// ---------------------------------------------------------------------------
// Starship names — drawing on classic Traveller conventions: single virtue
// or mythological words, evocative poetic phrases, and merchant-flavored
// aspirational names (per Free Trader tradition).
// ---------------------------------------------------------------------------
const SHIP_VIRTUES = ["Valiant", "Intrepid", "Resolute", "Indomitable", "Steadfast", "Endeavour", "Vigilant", "Dauntless", "Tenacious", "Relentless", "Constancy", "Perseverance", "Fortitude", "Audacity", "Defiance", "Vanguard", "Sentinel", "Paragon", "Ascendant", "Zenith"];
const SHIP_MYTH = ["Beowulf", "Perseus", "Icarus", "Prometheus", "Odysseus", "Ozymandias", "Excalibur", "Valkyrie", "Nemesis", "Atlas", "Orpheus", "Cassandra", "Leviathan", "Charon", "Nike", "Hyperion", "Ariadne", "Achilles", "Pandora", "Chimera"];
const SHIP_NOUNS = ["Comet", "Nebula", "Horizon", "Aurora", "Meridian", "Eclipse", "Zephyr", "Tempest", "Solstice", "Starfall", "Twilight", "Wanderer", "Voyager", "Drifter", "Nomad", "Tide", "Current", "Ember", "Frost", "Storm"];
const SHIP_ABSTRACT = ["Whisper", "Echo", "Shadow", "Memory", "Promise", "Legacy", "Fortune", "Destiny", "Requiem", "Anthem", "Journey", "Passage", "Reckoning", "Solace", "Reverie", "Vigil", "Omen", "Verdict", "Covenant", "Threshold"];
const SHIP_ADJECTIVES = ["Silent", "Distant", "Restless", "Wandering", "Fading", "Rising", "Last", "Lone", "Forgotten", "Endless", "Silver", "Golden", "Crimson", "Northern", "Far", "Quiet", "Bold", "Free", "Wild", "Bright"];
const SHIP_MERCHANT = ["Fair Wind", "Long Reach", "Silver Fortune", "Golden Venture", "Steady Trade", "Open Road", "Second Chance", "Lucky Star", "Honest Profit", "Far Horizon", "Trade Wind", "Safe Passage", "Merchant's Hope", "Free Passage", "Northern Star"];

function generateShipName(style) {
  const s = style && style !== "any" ? style : pick(["virtue", "myth", "poetic", "merchant"]);
  if (s === "virtue") return pick(SHIP_VIRTUES);
  if (s === "myth") return pick(SHIP_MYTH);
  if (s === "merchant") return pick(SHIP_MERCHANT);
  // poetic
  const form = pick(["adj-noun", "abstract-of-noun"]);
  if (form === "adj-noun") return `The ${pick(SHIP_ADJECTIVES)} ${pick(SHIP_NOUNS)}`;
  return `${pick(SHIP_ABSTRACT)} of the ${pick(SHIP_NOUNS)}`;
}

// ---------------------------------------------------------------------------
// Application
// ---------------------------------------------------------------------------
class TravellerNameGeneratorApp extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "traveller-name-generator-app",
      title: "Traveller Name Generator",
      template: `modules/${MODULE_ID}/templates/generator.hbs`,
      width: 480,
      height: 640,
      resizable: true,
      classes: ["tng-window"]
    });
  }

  constructor(options = {}) {
    super(options);
    this.currentTab = "solomani";
    this.options_ = {
      solomani: { culture: "any", gender: "any", quantity: 10 },
      vilani: { gender: "any", includeClan: true, includeSocial: false, quantity: 10 },
      mixed: { style: "random", gender: "any", quantity: 10 },
      ships: { style: "any", quantity: 10 },
    };
    this.results = [];
  }

  getData() { return {}; }

  activateListeners(html) {
    super.activateListeners(html);
    const root = html[0].querySelector("#tng-root");
    this.root = root;

    root.querySelectorAll("[data-tng-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.currentTab = btn.dataset.tngTab;
        root.querySelectorAll("[data-tng-tab]").forEach(b => b.classList.toggle("active", b === btn));
        root.querySelectorAll("[data-tng-panel]").forEach(p => p.classList.toggle("active", p.dataset.tngPanel === this.currentTab));
        this.results = [];
        this._renderResults();
      });
    });

    root.querySelectorAll("[data-tng-toggle-group]").forEach(group => {
      group.querySelectorAll("[data-tng-toggle]").forEach(btn => {
        btn.addEventListener("click", () => {
          const tab = group.dataset.tngToggleGroup.split(":")[0];
          const key = group.dataset.tngToggleGroup.split(":")[1];
          this.options_[tab][key] = btn.dataset.tngToggle === "true" ? true : btn.dataset.tngToggle === "false" ? false : btn.dataset.tngToggle;
          group.querySelectorAll("[data-tng-toggle]").forEach(b => b.classList.toggle("active", b === btn));
        });
      });
    });

    root.querySelectorAll("[data-tng-generate]").forEach(btn => {
      btn.addEventListener("click", () => this._generate(btn.dataset.tngGenerate));
    });

    root.querySelectorAll("[data-tng-qty]").forEach(input => {
      input.addEventListener("change", () => {
        const tab = input.dataset.tngQty;
        const n = Math.max(1, Math.min(100, Number(input.value) || 10));
        input.value = n;
        this.options_[tab].quantity = n;
      });
    });

    root.querySelector("[data-tng-copy-all]").addEventListener("click", () => this._copyAll());

    root.addEventListener("click", (e) => {
      const copyBtn = e.target.closest("[data-tng-copy-line]");
      if (copyBtn) {
        const text = copyBtn.closest("[data-tng-result]").querySelector(".tng-result-text").textContent;
        this._copyText(text, copyBtn);
      }
    });
  }

  async _copyText(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
      if (btn) {
        const original = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => { btn.textContent = original; }, 1000);
      }
    } catch (err) {
      ui.notifications.warn("Couldn't copy to clipboard — select and copy the text manually.");
    }
  }

  _copyAll() {
    if (!this.results.length) {
      ui.notifications.warn("Generate some names first.");
      return;
    }
    this._copyText(this.results.join("\n"));
    ui.notifications.info(`Copied ${this.results.length} names to clipboard.`);
  }

  _generate(tab) {
    const opts = this.options_[tab];
    const n = opts.quantity || 10;
    const results = [];
    for (let i = 0; i < n; i++) {
      if (tab === "solomani") {
        results.push(generateSolomaniName(opts.culture === "any" ? null : opts.culture, opts.gender === "any" ? null : opts.gender));
      } else if (tab === "vilani") {
        results.push(generateVilaniName(opts.gender === "any" ? null : opts.gender, opts.includeClan, opts.includeSocial));
      } else if (tab === "mixed") {
        results.push(generateMixedName(opts.style, opts.gender === "any" ? null : opts.gender));
      } else if (tab === "ships") {
        results.push(generateShipName(opts.style));
      }
    }
    this.results = results;
    this._renderResults();
  }

  _renderResults() {
    const el = this.root.querySelector("[data-tng-results]");
    if (!this.results.length) {
      el.innerHTML = `<p class="tng-empty">Click Generate to produce a list of names.</p>`;
      return;
    }
    el.innerHTML = this.results.map(name => `
      <div class="tng-result" data-tng-result>
        <span class="tng-result-text">${esc(name)}</span>
        <button type="button" class="tng-copy-btn" data-tng-copy-line>Copy</button>
      </div>`).join("");
  }
}

Hooks.once("ready", () => {
  const mod = game.modules.get(MODULE_ID);
  const openGenerator = () => {
    if (!mod.app) mod.app = new TravellerNameGeneratorApp();
    mod.app.render(true);
  };
  if (mod) mod.api = { open: openGenerator };
});

// Best-effort button in the Actors Directory header, alongside the reliable
// macro-based way to open the generator.
Hooks.on("renderActorDirectory", (app, html) => {
  try {
    const el = html instanceof jQuery ? html[0] : html;
    const header = el.querySelector(".directory-header") || el;
    if (header.querySelector(".tng-open-btn")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("tng-open-btn");
    btn.innerHTML = '<i class="fa-solid fa-dice"></i> Name Generator';
    btn.style.width = "100%";
    btn.addEventListener("click", () => game.modules.get(MODULE_ID)?.api?.open());
    const actions = header.querySelector(".header-actions") || header;
    actions.appendChild(btn);
  } catch (err) {
    console.warn("Traveller Name Generator | Could not add sidebar button, use the macro instead.", err);
  }
});
