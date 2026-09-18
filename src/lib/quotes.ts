/**
 * QOTD — Quote of the Day (#9)
 * 15 original tech-humor quotes, seed by UTC date for determinism.
 */

export interface Quote {
  text: string;
  author: string;
}

export const QUOTES: Quote[] = [
  { text: "Any sufficiently advanced bug is indistinguishable from a feature.",                               author: "Springfield Engineering Proverb" },
  { text: "There are only two hard problems in CS: naming things, cache invalidation, and off-by-one errors.", author: "Springfield CS Dept." },
  { text: "It works on my machine. Perhaps we should ship your machine.",                                     author: "Dev floor, circa every standup" },
  { text: "Documentation is like a good donut: everyone wants it, nobody wants to make it.",                  author: "Anonymous Springfield Dev" },
  { text: "Move fast and fix things. The breaking was the easy part.",                                        author: "Revised Springfield Motto" },
  { text: "A deploy on Friday is just a weekend adventure you didn't plan.",                                  author: "Springfield SRE Handbook" },
  { text: "Clean code is not written, it is rewritten.",                                                      author: "Springfield Refactor Guild" },
  { text: "The best code is the code you didn't have to write.",                                              author: "Lazy Engineer Quarterly" },
  { text: "An estimate is just a guess wearing a suit and a tie.",                                            author: "Springfield PM Conference 2019" },
  { text: "Every legacy codebase is someone's passionate side project that got promoted.",                    author: "Tales from the On-Call Rotation" },
  { text: "The first rule of optimization is: don't. The second rule is: not yet.",                          author: "Springfield Performance Guild" },
  { text: "Comments should explain why, not what. The code already says what. Badly.",                       author: "Code Review Notes, vol. 7" },
  { text: "Kubernetes is just Docker, but for people who like YAML the way Homer likes donuts.",             author: "Springfield DevOps Zine" },
  { text: "A good API is like a good traffic light: obvious, consistent, and nobody reads the manual.",      author: "Springfield Platform Team" },
  { text: "Ship it. The universe is 13.8 billion years old. Your bug can wait until Monday.",                author: "Existential Engineering Notes" },
];

/**
 * Deterministic daily pick — same quote all day, changes at midnight UTC.
 */
export function getDailyQuote(): Quote {
  const d   = new Date();
  const seed = d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
  return QUOTES[seed % QUOTES.length]!;
}
