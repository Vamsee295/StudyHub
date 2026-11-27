// Formula sheets for aptitude topics: shown at the end of each lesson and gathered on /learn/<course>/formulas.
// Each entry: [what it's for, the formula, an optional worked example].

export type Formula = [string, string, string?];

export const FORMULAS: Record<string, Record<string, Formula[]>> = {
  "quantitative-aptitude": {
    "number-system": [
      ["Unit digit cycles", "2: 2,4,8,6 · 3: 3,9,7,1 · 7: 7,9,3,1 · 8: 8,4,2,6 · 4: 4,6 · 9: 9,1 · 0,1,5,6 stay", "7⁹⁵: 95 mod 4 = 3 → 3"],
      ["Trailing zeros of n!", "⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + …", "100! → 20 + 4 = 24"],
      ["Sum of first n natural numbers", "n(n + 1)/2", "1 to 50 → 1275"],
      ["Sum of first n squares", "n(n + 1)(2n + 1)/6", "1² to 10² → 385"],
      ["Sum of first n cubes", "[n(n + 1)/2]²", "1³ to 5³ → 225"],
      ["Dividend relation", "Dividend = Divisor × Quotient + Remainder", "47 = 5 × 9 + 2"],
    ],
    "types-of-numbers": [
      ["Sum of first n odd numbers", "n²", "1 + 3 + 5 + 7 = 16"],
      ["Sum of first n even numbers", "n(n + 1)", "2 + 4 + 6 = 12"],
      ["Primes below 100", "25 primes; check divisors up to √n only", "Is 91 prime? 7 × 13 → no"],
    ],
    "divisibility-rules": [
      ["By 2, 4, 8", "last 1, 2, 3 digits divisible by 2, 4, 8", "1,232: 232 ÷ 8 = 29 ✔"],
      ["By 3, 9", "digit sum divisible by 3, 9", "729: 7+2+9 = 18 ✔ both"],
      ["By 5, 10", "ends in 0 or 5 / ends in 0"],
      ["By 6", "divisible by both 2 and 3"],
      ["By 11", "(sum of odd-place digits) − (sum of even-place digits) is 0 or a multiple of 11", "918,082: 22 ✔"],
    ],
    "factors-multiples": [
      ["Number of factors", "n = pᵃ × qᵇ × rᶜ → (a + 1)(b + 1)(c + 1)", "72 = 2³×3² → 12"],
      ["Sum of factors", "(p⁰ + … + pᵃ)(q⁰ + … + qᵇ)", "12 = 2²×3 → 7 × 4 = 28"],
    ],
    "lcm-hcf": [
      ["Product rule (two numbers)", "HCF × LCM = a × b", "HCF 4, LCM 48, a = 12 → b = 16"],
      ["HCF of fractions", "HCF of numerators / LCM of denominators"],
      ["LCM of fractions", "LCM of numerators / HCF of denominators"],
      ["Events together again", "after LCM of their intervals", "bells every 4, 6, 8 min → 24 min"],
    ],
    "percentages": [
      ["x% of y", "x × y / 100", "15% of 480 = 72"],
      ["Percentage change", "(new − old)/old × 100"],
      ["Successive changes", "x + y + xy/100", "+20% then −20% → −4%"],
      ["A is x% more than B; B is less than A by", "x/(100 + x) × 100 %", "25% more → 20% less"],
      ["Population after n years", "P(1 + r/100)ⁿ"],
    ],
    "profit-and-loss": [
      ["Profit %", "(SP − CP)/CP × 100"],
      ["SP from CP", "CP × (100 + profit%)/100", "CP 400, 25% → 500"],
      ["CP from SP", "SP × 100/(100 + profit%)"],
      ["Discount", "Marked price − SP; discount% on marked price"],
      ["Same SP, x% gain and x% loss", "net loss of x²/100 %", "10% each → 1% loss"],
    ],
    "ratio-proportion": [
      ["Divide N in a : b", "N × a/(a + b) and N × b/(a + b)"],
      ["Fourth proportional of a, b, c", "bc/a"],
      ["Mean proportional of a, b", "√(ab)", "4 and 9 → 6"],
      ["Combine A : B and B : C", "make B equal, then read A : B : C"],
    ],
    "averages": [
      ["Average", "sum / count"],
      ["New member changes average", "new value = new avg × new count − old total"],
      ["Replacement", "new person = old person + count × change in average"],
      ["Average of consecutive numbers", "(first + last)/2"],
    ],
    "simple-interest": [
      ["Simple interest", "SI = P × R × T / 100", "₹5,000, 8%, 3 yrs → ₹1,200"],
      ["Amount", "A = P + SI"],
      ["Time to double", "100/R years", "at 8% → 12.5 yrs"],
    ],
    "compound-interest": [
      ["Amount", "A = P(1 + R/100)ᵀ"],
      ["Compound interest", "CI = A − P"],
      ["CI − SI for 2 years", "P(R/100)²", "₹10,000 at 10% → ₹100"],
      ["CI − SI for 3 years", "P(R/100)²(300 + R)/100"],
      ["Half-yearly compounding", "rate R/2, time 2T"],
    ],
    "time-and-work": [
      ["Work rate", "a job in n days → 1/n of it per day"],
      ["Together (A and B)", "ab/(a + b) days", "10 and 15 → 6 days"],
      ["B alone from together", "1/B = 1/T − 1/A"],
      ["Wages", "share in ratio of work done (rates × days)"],
    ],
    "pipes-and-cisterns": [
      ["Two fill pipes", "ab/(a + b) hours"],
      ["Fill a, leak e", "ae/(e − a) hours", "10 and 15 → 30 h"],
      ["Net rate", "sum of fill rates − sum of empty rates"],
    ],
    "time-speed-distance": [
      ["Basic", "distance = speed × time"],
      ["km/h ↔ m/s", "× 5/18 to m/s, × 18/5 to km/h", "72 km/h = 20 m/s"],
      ["Average speed (equal distances)", "2xy/(x + y)", "40 and 60 → 48"],
      ["Relative speed", "opposite: add; same direction: subtract"],
    ],
    "boats-and-streams": [
      ["Downstream", "boat + stream"],
      ["Upstream", "boat − stream"],
      ["Boat speed", "(down + up)/2"],
      ["Stream speed", "(down − up)/2"],
    ],
    "trains": [
      ["Passing a pole or person", "time = train length / speed"],
      ["Passing a platform or bridge", "time = (train + platform) / speed"],
      ["Two trains", "time = (L₁ + L₂) / relative speed"],
    ],
    "basic-algebra": [
      ["Solving ax + b = c", "x = (c − b)/a"],
      ["Distributive law", "a(b + c) = ab + ac"],
    ],
    "linear-equations": [
      ["Sum and difference given", "x = (s + d)/2, y = (s − d)/2"],
      ["Elimination", "multiply to match one variable, then add or subtract"],
    ],
    "quadratic-equations": [
      ["Roots", "x = [−b ± √(b² − 4ac)] / 2a"],
      ["Sum and product of roots", "−b/a and c/a"],
      ["Nature of roots (D = b² − 4ac)", "D > 0 two real · D = 0 equal · D < 0 none real"],
    ],
    "algebraic-identities": [
      ["Square of a sum", "(a + b)² = a² + 2ab + b²"],
      ["Square of a difference", "(a − b)² = a² − 2ab + b²"],
      ["Difference of squares", "a² − b² = (a + b)(a − b)"],
      ["Sum of squares", "a² + b² = (a + b)² − 2ab"],
      ["Cubes", "a³ + b³ = (a + b)³ − 3ab(a + b); a³ − b³ = (a − b)(a² + ab + b²)"],
    ],
    "progressions": [
      ["AP nth term", "a + (n − 1)d"],
      ["AP sum", "n/2 [2a + (n − 1)d] = n/2 (first + last)"],
      ["GP nth term", "a rⁿ⁻¹"],
      ["GP sum", "a(rⁿ − 1)/(r − 1)"],
      ["Infinite GP (|r| < 1)", "a/(1 − r)"],
    ],
    "permutations": [
      ["Arrangements of n", "n!"],
      ["r from n, order matters", "ⁿPᵣ = n!/(n − r)!"],
      ["With repeated letters", "n!/(p! q! …)", "APPLE → 5!/2! = 60"],
      ["Around a circle", "(n − 1)!"],
    ],
    "combinations": [
      ["r from n, order doesn't matter", "ⁿCᵣ = n!/[r!(n − r)!]"],
      ["Symmetry", "ⁿCᵣ = ⁿCₙ₋ᵣ"],
      ["Diagonals of a polygon", "n(n − 3)/2"],
      ["Handshakes / matches", "ⁿC₂ = n(n − 1)/2"],
    ],
    "probability": [
      ["Probability", "favourable / total"],
      ["Not happening", "1 − P(A)"],
      ["Either A or B", "P(A) + P(B) − P(A and B)"],
      ["Independent events together", "P(A) × P(B)"],
      ["Two dice", "36 outcomes; sum 7 has 6 ways"],
    ],
    "geometry": [
      ["Triangle angles", "sum = 180°"],
      ["Polygon interior angles", "(n − 2) × 180°"],
      ["Pythagoras", "a² + b² = c²", "3, 4, 5"],
      ["Exterior angle of a regular polygon", "360°/n"],
    ],
    "mensuration": [
      ["Rectangle / square", "area lb, a² · perimeter 2(l + b), 4a"],
      ["Triangle", "½ × base × height"],
      ["Circle", "area πr² · circumference 2πr"],
      ["Cube", "volume a³ · surface 6a²"],
      ["Cuboid", "volume lbh · surface 2(lb + bh + hl)"],
      ["Cylinder", "volume πr²h · curved surface 2πrh"],
      ["Cone", "volume ⅓πr²h · curved surface πrl"],
      ["Sphere", "volume ⁴⁄₃πr³ · surface 4πr²"],
    ],
    "data-interpretation": [
      ["Growth %", "(this year − last year)/last year × 100"],
      ["Share of total", "part/total × 100"],
      ["Pie chart degrees", "value = degrees/360 × total"],
    ],
    "simplification-and-approximation": [
      ["Order", "brackets → powers → ÷ and × (left to right) → + and − (left to right)"],
      ["× 25", "× 100 ÷ 4"],
      ["× 11 (two digits)", "first digit, digit sum, last digit", "43 × 11 = 473"],
      ["Squares near 50", "(25 ± d) followed by d²", "47² = 2209"],
    ],
    "surds-indices-and-logarithms": [
      ["Same base", "aᵐ × aⁿ = aᵐ⁺ⁿ · aᵐ ÷ aⁿ = aᵐ⁻ⁿ · (aᵐ)ⁿ = aᵐⁿ"],
      ["Special powers", "a⁰ = 1 · a⁻ⁿ = 1/aⁿ · a^(1/n) = ⁿ√a"],
      ["Log rules", "log ab = log a + log b · log aⁿ = n log a"],
      ["Change of base", "log_b a = log a / log b"],
      ["Digits in N", "⌊log N⌋ + 1"],
      ["Values", "log 2 ≈ 0.3010 · log 3 ≈ 0.4771"],
    ],
    "problems-on-ages": [
      ["n years ago / after n years", "x − n / x + n"],
      ["Constant gap", "the difference in ages never changes"],
      ["Ratio a : b", "ages ak and bk"],
    ],
    "mixtures-and-alligation": [
      ["Alligation", "cheaper : dearer = (dearer − mean) : (mean − cheaper)"],
      ["Repeated replacement", "left = V(1 − r/V)ⁿ"],
      ["Mean price", "(c₁q₁ + c₂q₂)/(q₁ + q₂)"],
    ],
    "partnership": [
      ["Profit share", "in ratio of capital × time"],
      ["Joins after m months", "capital × (12 − m)"],
      ["Time ratio", "profit ratio ÷ capital ratio"],
    ],
    "remainders-and-unit-digits": [
      ["Product remainder", "(a × b) mod n = (a mod n × b mod n) mod n"],
      ["Fermat", "p prime: a^(p−1) mod p = 1"],
      ["Digit sum and 9", "N mod 9 = digit sum mod 9"],
    ],
    "decimal-fractions": [
      ["0.aaa…", "a/9"],
      ["0.abab…", "ab/99"],
      ["Multiplying decimals", "total decimal places of both factors"],
    ],
    "square-and-cube-roots": [
      ["Square root last digits", "1 → 1/9 · 4 → 2/8 · 6 → 4/6 · 9 → 3/7 · 5 → 5"],
      ["Cube root last digits", "2 ↔ 8, 3 ↔ 7; others match"],
      ["Decimals", "√(a/10ⁿ) with n even → half the decimal places"],
    ],
    "chain-rule-and-variation": [
      ["Work formula", "M₁D₁H₁/W₁ = M₂D₂H₂/W₂"],
      ["Direct", "more → more (multiply)"],
      ["Inverse", "more → less (product stays fixed)"],
    ],
    "problems-on-numbers": [
      ["Two-digit number", "10a + b; reversed 10b + a"],
      ["Number − reverse", "9 × (tens − units)"],
      ["Consecutive numbers", "x, x + 1, x + 2; even/odd: x, x + 2, x + 4"],
    ],
    "races-and-games": [
      ["Beats by x m in d m", "speed ratio d : (d − x)"],
      ["Margin from time", "margin = loser's speed × time margin"],
      ["Three runners", "multiply the ratios"],
    ],
    "heights-and-distances": [
      ["tan θ", "height / ground distance"],
      ["Values", "tan 30° = 1/√3 · tan 45° = 1 · tan 60° = √3"],
      ["sin, cos", "sin 30° = cos 60° = ½ · sin 60° = cos 30° = √3/2"],
    ],
    "stocks-and-shares": [
      ["Dividend per share", "dividend% × face value"],
      ["Shares bought", "investment ÷ market price"],
      ["Return %", "dividend per share ÷ market price × 100"],
    ],
    "true-and-bankers-discount": [
      ["Present worth", "PW = 100A/(100 + RT)"],
      ["True discount", "TD = A − PW = PW × R × T / 100"],
      ["Banker's discount", "BD = A × R × T / 100"],
      ["Banker's gain", "BG = BD − TD = TD × R × T / 100"],
    ],
  },
  "logical-reasoning": {
    "clocks-calendars": [
      ["Angle between hands", "|30H − 5.5M| (take 360 − it if over 180)", "3:30 → 75°"],
      ["Hands overlap", "every 65 5/11 minutes"],
      ["Odd days", "normal year 1, leap year 2; day after n days: n mod 7"],
      ["Leap year", "divisible by 4, but centuries only if divisible by 400"],
    ],
    "ranking-and-ordering": [
      ["Total from both ends", "top + bottom − 1"],
      ["Position from the other end", "total − position + 1"],
    ],
    "cubes-and-dice": [
      ["Painted n-cube", "3 faces: 8 · 2 faces: 12(n − 2) · 1 face: 6(n − 2)² · none: (n − 2)³"],
      ["Standard die", "opposite faces add up to 7"],
    ],
    "venn-diagrams": [
      ["Two sets", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)"],
      ["Three sets", "A + B + C − (pairs) + (all three)"],
    ],
    "direction-sense": [
      ["Distance after turns", "√(net east-west² + net north-south²)"],
      ["Right turn", "N → E → S → W (clockwise)"],
    ],
    "arithmetic-reasoning": [
      ["Heads and legs", "four-legged = (legs − 2 × heads)/2"],
      ["Items in a row", "gaps + 1 (circle: gaps)"],
      ["Handshakes / matches", "n(n − 1)/2"],
    ],
  },
};

export const formulasFor = (course: string, lesson: string) => FORMULAS[course]?.[lesson];
