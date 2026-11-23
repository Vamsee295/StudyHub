import type { LessonQuestions } from './index';

export const quantQuestions: LessonQuestions = {
  "number-system": [
    { q: "What is the unit digit of 7^95?", o: ["3", "7", "9", "1"], a: 0, e: "Unit digits of powers of 7 cycle 7, 9, 3, 1. 95 mod 4 = 3, so the third value: 3." },
    { q: "How many trailing zeros does 100! have?", o: ["24", "20", "10", "25"], a: 0, e: "Count factors of 5: 100/5 + 100/25 = 20 + 4 = 24." },
    { q: "What is the remainder when 2^10 is divided by 7?", o: ["2", "1", "4", "3"], a: 0, e: "2^10 = 1024 and 7 × 146 = 1022, leaving 2." },
  ],
  "types-of-numbers": [
    { q: "Which statement about 1 is true?", o: ["It is neither prime nor composite", "It is the smallest prime", "It is composite", "It is irrational"], a: 0, e: "A prime has exactly two factors; 1 has only one." },
    { q: "How many primes are there between 1 and 20?", o: ["8", "7", "9", "10"], a: 0, e: "2, 3, 5, 7, 11, 13, 17, 19." },
    { q: "Which number is irrational?", o: ["√2", "0.75", "22/7", "√16"], a: 0, e: "√2 can't be written as a ratio of integers; √16 = 4." },
  ],
  "divisibility-rules": [
    { q: "Which number is divisible by 8?", o: ["2,345,672", "1,234,561", "7,654,324", "9,876,542"], a: 0, e: "Check the last three digits: 672 / 8 = 84 exactly." },
    { q: "Is 918,082 divisible by 11?", o: ["Yes", "No", "Only by 2", "It can't be determined without dividing"], a: 0, e: "Alternate digit sums: (9 + 8 + 8) − (1 + 0 + 2) = 22, a multiple of 11." },
    { q: "When is a number divisible by 3?", o: ["When the sum of its digits is divisible by 3", "When its last digit is 3", "When it's odd", "When its last two digits are divisible by 3"], a: 0, e: "The same digit-sum rule works for 9." },
  ],
  "factors-multiples": [
    { q: "How many factors does 72 have?", o: ["12", "10", "8", "6"], a: 0, e: "72 = 2³ × 3², so (3 + 1)(2 + 1) = 12 factors." },
    { q: "What is the sum of all factors of 12?", o: ["28", "16", "24", "22"], a: 0, e: "1 + 2 + 3 + 4 + 6 + 12 = 28." },
    { q: "How many multiples of 7 are there from 1 to 100?", o: ["14", "13", "15", "7"], a: 0, e: "floor(100 / 7) = 14, the last being 98." },
  ],
  "lcm-hcf": [
    { q: "What are the HCF and LCM of 36 and 48?", o: ["12 and 144", "6 and 288", "12 and 72", "4 and 144"], a: 0, e: "36 = 2² × 3², 48 = 2⁴ × 3. HCF = 2² × 3 = 12, LCM = 2⁴ × 3² = 144." },
    { q: "Two numbers have HCF 6 and LCM 72. One is 18. What is the other?", o: ["24", "12", "36", "48"], a: 0, e: "Product = HCF × LCM = 432, and 432 / 18 = 24." },
    { q: "Bells ring every 6, 8 and 12 minutes. They ring together now. When next?", o: ["After 24 minutes", "After 48 minutes", "After 12 minutes", "After 96 minutes"], a: 0, e: "They coincide at the least common multiple: LCM(6, 8, 12) = 24 minutes." },
  ],
  "percentages": [
    { q: "What is 20% of 150?", o: ["30", "20", "15", "35"], a: 0, e: "20% means 20/100, so 0.2 × 150 = 30." },
    { q: "Price rises 25%. By what percent must consumption fall to keep spending the same?", o: ["20%", "25%", "15%", "33.33%"], a: 0, e: "25 / (100 + 25) × 100 = 20%." },
    { q: "Successive increases of 10% and 20% equal a single increase of what?", o: ["32%", "30%", "31%", "28%"], a: 0, e: "Multiply the factors: 1.1 × 1.2 = 1.32, a 32% increase, not 30%." },
  ],
  "profit-and-loss": [
    { q: "Cost price 400, selling price 500. What is the profit percent?", o: ["25%", "20%", "10%", "30%"], a: 0, e: "Profit 100 on cost 400 = 25%. Profit percent is on cost price." },
    { q: "An item sold for 450 at a 10% loss. What was the cost price?", o: ["500", "495", "405", "550"], a: 0, e: "0.9 × CP = 450, so CP = 500." },
    { q: "Marked price 1,000 with successive discounts of 20% and 10%. What is the selling price?", o: ["720", "700", "750", "800"], a: 0, e: "1000 × 0.8 × 0.9 = 720." },
  ],
  "ratio-proportion": [
    { q: "Divide 600 in the ratio 2:3. What is the larger share?", o: ["360", "240", "300", "400"], a: 0, e: "There are 2 + 3 = 5 parts; the larger share is 600 × 3/5 = 360." },
    { q: "a:b = 2:3 and b:c = 4:5. What is a:b:c?", o: ["8:12:15", "2:3:5", "8:12:20", "4:6:5"], a: 0, e: "Make b equal: 2:3 = 8:12 and 4:5 = 12:15." },
    { q: "What is the mean proportional of 4 and 16?", o: ["8", "10", "12", "6"], a: 0, e: "The mean proportional of a and b is √(ab) = √(4 × 16) = 8." },
  ],
  "averages": [
    { q: "What is the average of 10, 20, 30 and 40?", o: ["25", "20", "30", "100"], a: 0, e: "The sum is 100 across 4 numbers, so the average is 25." },
    { q: "Five numbers average 20. Removing one leaves an average of 18. What was removed?", o: ["28", "20", "18", "22"], a: 0, e: "Total 100; remaining 4 × 18 = 72; removed 28." },
    { q: "What is the average of the first 10 natural numbers?", o: ["5.5", "5", "10", "55"], a: 0, e: "Sum 55 divided by 10." },
  ],
  "simple-interest": [
    { q: "Simple interest on 5,000 at 8% per year for 3 years?", o: ["1,200", "1,000", "1,500", "800"], a: 0, e: "SI = P × R × T / 100 = 5000 × 8 × 3 / 100." },
    { q: "A sum doubles in 8 years at simple interest. What is the rate?", o: ["12.5%", "8%", "10%", "15%"], a: 0, e: "Interest equals P in 8 years: 100 / 8 = 12.5% per year." },
    { q: "Amount after 2 years at 10% simple interest is 1,200. What is the principal?", o: ["1,000", "1,100", "1,080", "960"], a: 0, e: "A = P(1 + 0.2), so P = 1200 / 1.2." },
  ],
  "compound-interest": [
    { q: "Compound interest on 10,000 at 10% for 2 years, compounded yearly?", o: ["2,100", "2,000", "2,200", "1,000"], a: 0, e: "10000 × 1.1² = 12100, interest 2100." },
    { q: "Difference between CI and SI on 10,000 at 10% for 2 years?", o: ["100", "200", "50", "10"], a: 0, e: "For 2 years, CI − SI = P(r/100)² = 10000 × 0.01." },
    { q: "Money doubles in 5 years at compound interest. In how many years does it become 8 times?", o: ["15", "20", "40", "10"], a: 0, e: "8 = 2³, so three doubling periods of 5 years." },
  ],
  "time-and-work": [
    { q: "A finishes a job in 10 days and B in 15. Together?", o: ["6 days", "12.5 days", "5 days", "8 days"], a: 0, e: "1/10 + 1/15 = 1/6 per day." },
    { q: "A takes 12 days; A and B together take 8. How long does B take alone?", o: ["24 days", "20 days", "16 days", "4 days"], a: 0, e: "B's daily rate is the combined rate minus A's: 1/8 − 1/12 = 1/24." },
    { q: "10 men finish a job in 12 days. How long would 15 men take?", o: ["8 days", "18 days", "10 days", "6 days"], a: 0, e: "Man-days are constant: 120 / 15 = 8." },
  ],
  "pipes-and-cisterns": [
    { q: "Pipes fill a tank in 20 and 30 minutes. Both together?", o: ["12 minutes", "25 minutes", "10 minutes", "15 minutes"], a: 0, e: "Add the filling rates: 1/20 + 1/30 = 1/12 of the tank per minute." },
    { q: "A pipe fills a tank in 10 hours; a leak empties it in 15. How long to fill with the leak?", o: ["30 hours", "25 hours", "6 hours", "20 hours"], a: 0, e: "The leak subtracts from the fill rate: 1/10 − 1/15 = 1/30 per hour." },
    { q: "An inlet fills in 6 hours and an outlet empties in 8. Both open: how long to fill?", o: ["24 hours", "14 hours", "48 hours", "12 hours"], a: 0, e: "Net rate = inlet minus outlet: 1/6 − 1/8 = 1/24 of the tank per hour." },
  ],
  "time-speed-distance": [
    { q: "Convert 72 km/h to m/s.", o: ["20", "25", "18", "72"], a: 0, e: "Multiply by 5/18: 72 × 5/18 = 20." },
    { q: "You drive to a town at 40 km/h and back at 60 km/h. Average speed?", o: ["48 km/h", "50 km/h", "45 km/h", "52 km/h"], a: 0, e: "For equal distances, average = 2ab / (a + b) = 4800 / 100." },
    { q: "A car covers 300 km in 5 hours. How long for 450 km at the same speed?", o: ["7.5 hours", "7 hours", "8 hours", "6.5 hours"], a: 0, e: "Speed 60 km/h; 450 / 60 = 7.5." },
  ],
  "boats-and-streams": [
    { q: "Downstream speed 15 km/h, upstream 9 km/h. Speed of the stream?", o: ["3 km/h", "6 km/h", "12 km/h", "4 km/h"], a: 0, e: "Stream = (15 − 9) / 2 = 3." },
    { q: "Boat 10 km/h in still water, stream 2 km/h. Time to go 24 km downstream?", o: ["2 hours", "3 hours", "2.4 hours", "4 hours"], a: 0, e: "Downstream speed 12 km/h." },
    { q: "Which formula gives the boat's speed in still water?", o: ["(downstream + upstream) / 2", "(downstream − upstream) / 2", "downstream × upstream", "downstream / upstream"], a: 0, e: "The stream's effect cancels when averaging." },
  ],
  "trains": [
    { q: "A 150 m train at 54 km/h passes a pole in how long?", o: ["10 seconds", "15 seconds", "8 seconds", "12 seconds"], a: 0, e: "54 km/h = 15 m/s; 150 / 15 = 10." },
    { q: "A 200 m train at 36 km/h crosses a 300 m platform in how long?", o: ["50 seconds", "20 seconds", "30 seconds", "40 seconds"], a: 0, e: "Distance 500 m at 10 m/s." },
    { q: "Trains of 100 m and 120 m run towards each other at 40 and 50 km/h. Time to cross?", o: ["8.8 seconds", "10 seconds", "22 seconds", "4.4 seconds"], a: 0, e: "Relative speed 90 km/h = 25 m/s; 220 / 25 = 8.8." },
  ],
  "basic-algebra": [
    { q: "Solve 3x + 7 = 22.", o: ["x = 5", "x = 7", "x = 3", "x = 15"], a: 0, e: "Subtract 7 from both sides to get 3x = 15, then divide by 3." },
    { q: "If x + 1/x = 3, what is x² + 1/x²?", o: ["7", "9", "11", "5"], a: 0, e: "Square both sides: x² + 2 + 1/x² = 9." },
    { q: "Simplify (a² − b²) / (a − b) for a ≠ b.", o: ["a + b", "a − b", "a² + b²", "1"], a: 0, e: "a² − b² = (a + b)(a − b)." },
  ],
  "linear-equations": [
    { q: "x + y = 10 and x − y = 4. What is x?", o: ["7", "3", "6", "4"], a: 0, e: "Add the equations: 2x = 14." },
    { q: "Which pair of equations has no solution?", o: ["2x + 3y = 5 and 4x + 6y = 7", "x + y = 2 and x − y = 0", "x = 1 and y = 2", "2x + y = 4 and x + y = 3"], a: 0, e: "The lines are parallel (same slope) but distinct." },
    { q: "A father is 3 times his son's age. Five years ago he was 4 times. How old is the son now?", o: ["15", "10", "20", "12"], a: 0, e: "3s − 5 = 4(s − 5), so s = 15." },
  ],
  "quadratic-equations": [
    { q: "What are the roots of x² − 5x + 6 = 0?", o: ["2 and 3", "−2 and −3", "1 and 6", "−1 and 6"], a: 0, e: "Factor as (x − 2)(x − 3) = 0: two numbers multiplying to 6 and adding to 5." },
    { q: "What is the sum of the roots of 2x² − 8x + 3 = 0?", o: ["4", "−4", "3/2", "8"], a: 0, e: "For ax² + bx + c, the sum of roots is −b/a = 8/2 = 4." },
    { q: "Which equation has no real roots?", o: ["x² + x + 1 = 0", "x² − 4 = 0", "x² − 2x + 1 = 0", "x² − 3x + 2 = 0"], a: 0, e: "Its discriminant 1 − 4 = −3 is negative." },
  ],
  "algebraic-identities": [
    { q: "Which is the expansion of (a + b)²?", o: ["a² + 2ab + b²", "a² + b²", "a² − 2ab + b²", "2a + 2b"], a: 0, e: "(a + b)(a + b) gives the middle term 2ab." },
    { q: "Compute 102² using an identity.", o: ["10,404", "10,204", "10,004", "10,400"], a: 0, e: "(100 + 2)² = 10000 + 400 + 4." },
    { q: "a + b = 5 and ab = 6. What is a² + b²?", o: ["13", "25", "19", "11"], a: 0, e: "(a + b)² − 2ab = 25 − 12." },
  ],
  "progressions": [
    { q: "What is the 10th term of the AP 3, 7, 11, ...?", o: ["39", "43", "40", "35"], a: 0, e: "The nth term is a + (n − 1)d = 3 + 9 × 4 = 39." },
    { q: "What is the sum of the first 20 natural numbers?", o: ["210", "200", "220", "190"], a: 0, e: "n(n + 1)/2 = 20 × 21 / 2." },
    { q: "What is the 5th term of the GP 2, 6, 18, ...?", o: ["162", "54", "486", "108"], a: 0, e: "The ratio is 3, so the 5th term is 2 × 3⁴ = 162." },
  ],
  "permutations": [
    { q: "How many arrangements of the letters of LEVEL are there?", o: ["30", "120", "60", "20"], a: 0, e: "5! / (2! × 2!) for the repeated L and E." },
    { q: "In how many ways can 5 people stand in a row?", o: ["120", "25", "60", "24"], a: 0, e: "Arrangements of 5 distinct people: 5! = 5 × 4 × 3 × 2 × 1 = 120." },
    { q: "In how many ways can 6 people sit around a round table?", o: ["120", "720", "360", "60"], a: 0, e: "Circular arrangements: (n − 1)! = 5!." },
  ],
  "combinations": [
    { q: "What is C(10, 3)?", o: ["120", "720", "30", "210"], a: 0, e: "10 × 9 × 8 / 6 = 120." },
    { q: "How many handshakes happen if 8 people each shake hands once with everyone else?", o: ["28", "56", "64", "16"], a: 0, e: "Each handshake is a pair of people: C(8, 2) = 8 × 7 / 2 = 28." },
    { q: "From 5 men and 4 women, how many 3-person committees have exactly 2 women?", o: ["30", "60", "20", "45"], a: 0, e: "C(4, 2) × C(5, 1) = 6 × 5." },
  ],
  "probability": [
    { q: "Two dice are rolled. Probability the sum is 7?", o: ["1/6", "1/12", "7/36", "1/9"], a: 0, e: "6 favourable outcomes out of 36." },
    { q: "A card is drawn from a deck. Probability it's a king or a heart?", o: ["4/13", "17/52", "1/4", "1/13"], a: 0, e: "(4 + 13 − 1) / 52 = 16/52, removing the king of hearts counted twice." },
    { q: "A coin is tossed 3 times. Probability of at least one head?", o: ["7/8", "1/2", "3/8", "1/8"], a: 0, e: "1 − P(all tails) = 1 − 1/8." },
  ],
  "geometry": [
    { q: "What is the sum of interior angles of a hexagon?", o: ["720°", "540°", "360°", "900°"], a: 0, e: "(n − 2) × 180 = 4 × 180." },
    { q: "A triangle has sides 3, 4 and 5. What type is it?", o: ["Right-angled", "Equilateral", "Obtuse", "Isosceles"], a: 0, e: "Since 3² + 4² = 9 + 16 = 25 = 5², Pythagoras says it has a right angle." },
    { q: "What is the angle in a semicircle?", o: ["90°", "180°", "45°", "60°"], a: 0, e: "Thales' theorem: an angle subtended by a diameter is a right angle." },
  ],
  "mensuration": [
    { q: "Area of a circle with radius 7 (π = 22/7)?", o: ["154", "44", "49", "308"], a: 0, e: "Area = πr² = 22/7 × 49 = 154 square units." },
    { q: "Volume of a cube with side 4?", o: ["64", "16", "48", "96"], a: 0, e: "Volume of a cube is side³: 4³ = 64 cubic units." },
    { q: "Volume of a cylinder with radius 7 and height 10 (π = 22/7)?", o: ["1,540", "440", "770", "3,080"], a: 0, e: "πr²h = 22/7 × 49 × 10." },
  ],
  "data-interpretation": [
    { q: "Sales grew from 200 to 250. What is the growth rate?", o: ["25%", "20%", "50%", "40%"], a: 0, e: "50 / 200 = 25%. Always divide by the starting value." },
    { q: "What is the average of 30, 40 and 50?", o: ["40", "45", "35", "120"], a: 0, e: "The sum is 120 across 3 values, so the average is 40." },
    { q: "In a pie chart, a 90° sector represents what share?", o: ["25%", "90%", "9%", "50%"], a: 0, e: "A full circle is 360°, and 90 / 360 = 1/4 = 25%." },
  ],
};

export const logicalQuestions: LessonQuestions = {
  "number-series": [
    { q: "2, 6, 12, 20, 30, ?", o: ["42", "40", "36", "44"], a: 0, e: "Terms are n(n + 1): the next is 6 × 7." },
    { q: "3, 9, 27, 81, ?", o: ["243", "162", "324", "108"], a: 0, e: "Each term is multiplied by 3." },
    { q: "1, 4, 9, 16, ?", o: ["25", "20", "24", "36"], a: 0, e: "Perfect squares: 5² = 25." },
  ],
  "alphabet-series": [
    { q: "A, C, E, G, ?", o: ["I", "H", "J", "K"], a: 0, e: "Skip one letter each time." },
    { q: "Z, X, V, T, ?", o: ["R", "S", "Q", "U"], a: 0, e: "Moving backwards two letters each step." },
    { q: "AB, DE, GH, ?", o: ["JK", "IJ", "KL", "HI"], a: 0, e: "Each pair starts three letters after the previous pair's start." },
  ],
  "alphanumeric-series": [
    { q: "A1, C3, E5, ?", o: ["G7", "F6", "G6", "H8"], a: 0, e: "Letters skip one; the number is the letter's position." },
    { q: "B2, D4, F6, ?", o: ["H8", "G7", "H7", "I9"], a: 0, e: "Even-position letters with matching numbers." },
    { q: "Z26, Y25, X24, ?", o: ["W23", "V22", "W22", "U21"], a: 0, e: "Backwards through the alphabet with positions." },
  ],
  "analogies": [
    { q: "Book : Author :: Painting : ?", o: ["Painter", "Canvas", "Gallery", "Brush"], a: 0, e: "The relationship is creation and creator." },
    { q: "4 : 16 :: 6 : ?", o: ["36", "24", "12", "18"], a: 0, e: "The second number is the square of the first." },
    { q: "Doctor : Hospital :: Teacher : ?", o: ["School", "Book", "Student", "Lesson"], a: 0, e: "The relationship is worker and workplace." },
  ],
  "odd-one-out": [
    { q: "Which is the odd one out: 2, 3, 5, 9, 11?", o: ["9", "2", "5", "11"], a: 0, e: "All others are prime." },
    { q: "Which is the odd one out: Apple, Mango, Potato, Banana?", o: ["Potato", "Apple", "Mango", "Banana"], a: 0, e: "Potato is a vegetable; the others are fruits." },
    { q: "Which is the odd one out: 121, 144, 169, 190?", o: ["190", "121", "144", "169"], a: 0, e: "The others are perfect squares." },
  ],
  "coding-decoding": [
    { q: "If CAT is coded as DBU, how is DOG coded?", o: ["EPH", "EOH", "CNF", "DPH"], a: 0, e: "Each letter shifts forward by one." },
    { q: "If APPLE = 50 by adding letter positions, what is BALL?", o: ["27", "26", "30", "25"], a: 0, e: "2 + 1 + 12 + 12 = 27." },
    { q: "If each word is written backwards, how is TEACHER written?", o: ["REHCAET", "RECHAET", "REHCATE", "TEACHER"], a: 0, e: "Reverse the letters in order." },
  ],
  "blood-relations": [
    { q: "A is B's brother, and B is C's mother. How is A related to C?", o: ["Maternal uncle", "Father", "Brother", "Grandfather"], a: 0, e: "A is the brother of C's mother." },
    { q: "Pointing to a man, a woman says: 'His mother is the only daughter of my mother.' How is she related to him?", o: ["Mother", "Sister", "Aunt", "Grandmother"], a: 0, e: "The only daughter of her mother is herself." },
    { q: "Rahul says: 'He is the son of my father's only son.' How is the person related to Rahul?", o: ["Son", "Brother", "Nephew", "Cousin"], a: 0, e: "His father's only son is Rahul himself." },
  ],
  "direction-sense": [
    { q: "You walk 3 km north, then 4 km east. How far are you from the start?", o: ["5 km", "7 km", "1 km", "6 km"], a: 0, e: "Pythagoras: √(9 + 16) = 5." },
    { q: "Facing north, you turn right twice. Which way do you face?", o: ["South", "East", "West", "North"], a: 0, e: "Two right turns are 180°." },
    { q: "In the morning, which way does your shadow fall?", o: ["West", "East", "North", "South"], a: 0, e: "The sun rises in the east, casting shadows west." },
  ],
  "ranking-and-ordering": [
    { q: "Ravi is 7th from the top and 12th from the bottom. How many students are in the class?", o: ["18", "19", "17", "20"], a: 0, e: "Ravi is counted in both ranks: 7 + 12 − 1 = 18." },
    { q: "In a class of 40, Meera ranks 15th from the top. What's her rank from the bottom?", o: ["26", "25", "24", "27"], a: 0, e: "Rank from bottom = total − rank from top + 1 = 40 − 15 + 1 = 26." },
    { q: "A is taller than B, B is taller than C, and D is taller than A. Who is tallest?", o: ["D", "A", "B", "C"], a: 0, e: "Order: D > A > B > C." },
  ],
  "clocks-calendars": [
    { q: "What is the angle between the hands at 3:00?", o: ["90°", "60°", "180°", "45°"], a: 0, e: "Each hour mark is 30°; 3 × 30 = 90." },
    { q: "What is the angle between the hands at 3:30?", o: ["75°", "90°", "60°", "105°"], a: 0, e: "|30H − 5.5M| = |90 − 165| = 75." },
    { q: "1 January 2023 was a Sunday. What day was 1 January 2024?", o: ["Monday", "Sunday", "Tuesday", "Saturday"], a: 0, e: "2023 isn't a leap year: 365 days = 52 weeks + 1 day." },
  ],
  "syllogisms": [
    { q: "All cats are animals. All animals are living things. Conclusion: All cats are living things.", o: ["Follows", "Does not follow", "Only if some animals are cats", "Can't be determined"], a: 0, e: "A chain of 'all' statements is transitive." },
    { q: "Some A are B. All B are C. Conclusion: Some A are C.", o: ["Follows", "Does not follow", "All A are C", "No A is C"], a: 0, e: "The A's that are B must also be C." },
    { q: "All roses are flowers. Some flowers fade quickly. Conclusion: Some roses fade quickly.", o: ["Does not follow", "Follows", "All roses fade quickly", "No rose fades"], a: 0, e: "The fading flowers might not include any roses." },
  ],
  "statements-conclusions": [
    { q: "Statement: Every student who studies regularly passes. Conclusion: A student who failed didn't study regularly.", o: ["Follows", "Does not follow", "Partly follows", "Contradicts the statement"], a: 0, e: "This is the contrapositive, which is logically equivalent." },
    { q: "Statement: The government raised fuel prices to reduce the deficit. Conclusion: The deficit will definitely fall.", o: ["Does not follow", "Follows", "Follows strongly", "Is the stated fact"], a: 0, e: "The statement gives an intention, not a guaranteed outcome." },
    { q: "When does a conclusion follow from a statement?", o: ["When it is directly implied by the statement, without outside assumptions", "When it sounds reasonable", "When it's true in real life", "When it repeats keywords"], a: 0, e: "Judge only on the given information." },
  ],
  "data-sufficiency": [
    { q: "Is integer x even? (1) x² is even. (2) x is prime.", o: ["Statement 1 alone is sufficient", "Statement 2 alone is sufficient", "Both together are needed", "Neither is sufficient"], a: 0, e: "If x² is even, x is even. Primes can be 2 or odd, so (2) doesn't decide." },
    { q: "What is x? (1) x + y = 10. (2) x − y = 2.", o: ["Both statements together are needed", "Statement 1 alone is sufficient", "Statement 2 alone is sufficient", "Neither, even together"], a: 0, e: "Two independent equations give x = 6." },
    { q: "In data sufficiency questions, what are you asked to decide?", o: ["Whether the data is enough to answer, not the answer itself", "The exact numerical answer", "Which statement is true", "The fastest method"], a: 0, e: "Stop calculating once sufficiency is clear." },
  ],
  "seating-arrangement": [
    { q: "Five people sit in a row and A sits exactly in the middle. Which seat is A's?", o: ["3rd", "2nd", "4th", "1st"], a: 0, e: "The middle of 5 seats is the third." },
    { q: "Six people sit evenly around a table. Who sits opposite seat 1?", o: ["Seat 4", "Seat 3", "Seat 5", "Seat 6"], a: 0, e: "Opposite is half the table away: 1 + 3." },
    { q: "In a circle with everyone facing the centre, moving to a person's left means going which way?", o: ["Clockwise", "Anticlockwise", "Across the table", "It depends on the person"], a: 0, e: "Facing the centre, your left hand points clockwise around the circle." },
  ],
};

export const verbalQuestions: LessonQuestions = {
  "synonyms": [
    { q: "Choose the synonym of ABUNDANT.", o: ["Plentiful", "Scarce", "Rare", "Tiny"], a: 0, e: "Abundant means existing in large quantities." },
    { q: "Choose the synonym of CANDID.", o: ["Frank", "Secretive", "Polite", "Shy"], a: 0, e: "Candid means honest and direct." },
    { q: "Choose the synonym of DILIGENT.", o: ["Hardworking", "Lazy", "Careless", "Quick"], a: 0, e: "Diligent means showing care and effort in work." },
  ],
  "antonyms": [
    { q: "Choose the antonym of ANCIENT.", o: ["Modern", "Old", "Antique", "Historic"], a: 0, e: "Ancient means very old." },
    { q: "Choose the antonym of SCARCE.", o: ["Plentiful", "Rare", "Limited", "Few"], a: 0, e: "Scarce means in short supply." },
    { q: "Choose the antonym of BENEVOLENT.", o: ["Malevolent", "Kind", "Generous", "Charitable"], a: 0, e: "Benevolent means well-meaning; malevolent means wishing harm." },
  ],
  "one-word-substitution": [
    { q: "One who knows everything:", o: ["Omniscient", "Omnipotent", "Omnipresent", "Optimist"], a: 0, e: "Omnipotent is all-powerful; omnipresent is everywhere." },
    { q: "An abnormal fear of heights:", o: ["Acrophobia", "Claustrophobia", "Hydrophobia", "Agoraphobia"], a: 0, e: "Claustrophobia is fear of enclosed spaces." },
    { q: "A person who loves books:", o: ["Bibliophile", "Philatelist", "Lexicographer", "Bibliographer"], a: 0, e: "A philatelist collects stamps." },
  ],
  "vocabulary-in-context": [
    { q: "'The new embankments will mitigate the effects of flooding.' Mitigate means:", o: ["Lessen", "Worsen", "Ignore", "Measure"], a: 0, e: "To mitigate is to make less severe." },
    { q: "'His laconic reply ended the discussion.' Laconic means:", o: ["Brief", "Angry", "Detailed", "Confused"], a: 0, e: "Laconic means using very few words." },
    { q: "'They made an ostentatious display of wealth.' Ostentatious means:", o: ["Showy", "Modest", "Hidden", "Accidental"], a: 0, e: "Ostentatious means designed to impress or attract notice." },
  ],
  "parts-of-speech": [
    { q: "In 'She sings beautifully', what part of speech is 'beautifully'?", o: ["Adverb", "Adjective", "Verb", "Noun"], a: 0, e: "It describes how she sings, modifying the verb." },
    { q: "In 'The quick fox jumped', what part of speech is 'quick'?", o: ["Adjective", "Adverb", "Noun", "Preposition"], a: 0, e: "It describes the noun 'fox'." },
    { q: "In 'He ran to the store', what part of speech is 'to'?", o: ["Preposition", "Conjunction", "Adverb", "Pronoun"], a: 0, e: "It shows the relationship between 'ran' and 'the store'." },
  ],
  "subject-verb-agreement": [
    { q: "Each of the students ___ a laptop.", o: ["has", "have", "are having", "were having"], a: 0, e: "'Each' is singular, so it takes the singular verb 'has'." },
    { q: "Neither the teacher nor the students ___ present.", o: ["were", "was", "is", "has been"], a: 0, e: "With neither/nor, the verb agrees with the nearer subject, 'students'." },
    { q: "The number of applicants ___ increased this year.", o: ["has", "have", "are", "were"], a: 0, e: "'The number' is singular; 'a number of' would take a plural verb." },
  ],
  "tenses": [
    { q: "She ___ in Pune since 2020.", o: ["has lived", "lives", "lived", "is living"], a: 0, e: "'Since' with an ongoing period takes the present perfect." },
    { q: "By next June, I ___ my degree.", o: ["will have completed", "complete", "completed", "am completing"], a: 0, e: "An action finished before a future point uses the future perfect." },
    { q: "If I ___ you, I would apologise.", o: ["were", "was", "am", "will be"], a: 0, e: "Hypothetical conditionals use the subjunctive 'were'." },
  ],
  "sentence-correction": [
    { q: "Correct the sentence: 'He is senior than me.'", o: ["He is senior to me.", "He is more senior than me.", "He is seniorer than me.", "He is senior from me."], a: 0, e: "Senior, junior, superior and inferior take 'to', not 'than'." },
    { q: "Correct the sentence: 'One of my friend is a doctor.'", o: ["One of my friends is a doctor.", "One of my friends are a doctor.", "One of my friend are doctors.", "One my friend is a doctor."], a: 0, e: "'One of' takes a plural noun and a singular verb." },
    { q: "Correct the sentence: 'I am knowing the answer.'", o: ["I know the answer.", "I knowing the answer.", "I am know the answer.", "I have knowing the answer."], a: 0, e: "Stative verbs such as know rarely take continuous forms." },
  ],
  "reading-comprehension": [
    { q: "What should support your answer to a reading comprehension question?", o: ["Evidence in the passage", "Your general knowledge", "The longest option", "The first option that sounds familiar"], a: 0, e: "Options true in real life but not in the passage are traps." },
    { q: "What does an inference question ask for?", o: ["Something implied by the passage but not stated directly", "A word's dictionary meaning", "A direct quote", "The author's name"], a: 0, e: "The inference must follow from the text." },
    { q: "Which option is usually wrong in 'main idea' questions?", o: ["One that covers only a detail from one paragraph", "One that summarizes the whole passage", "One that matches the author's purpose", "One that uses neutral wording"], a: 0, e: "Main ideas span the passage, not a single detail." },
  ],
  "para-jumbles": [
    { q: "Which sentence is most likely to open a paragraph?", o: ["One that introduces the topic without referring back to anything", "One starting with 'However'", "One starting with 'This shows'", "One starting with 'Therefore'"], a: 0, e: "Openers stand alone without pronouns or connectors pointing backwards." },
    { q: "A sentence begins 'This approach...'. What does that suggest?", o: ["It follows a sentence that describes the approach", "It's the first sentence", "It's the conclusion only", "It's unrelated"], a: 0, e: "Pronouns and demonstratives refer back to earlier ideas." },
    { q: "What helps most when solving para jumbles?", o: ["Finding mandatory pairs linked by pronouns, connectors or chronology", "Reading options aloud", "Picking the longest sentence first", "Counting words"], a: 0, e: "Fix pairs, then place them in order." },
  ],
  "fill-in-the-blanks": [
    { q: "Despite the heavy rain, the match ___.", o: ["continued", "cancelled", "was stopped immediately", "postponed itself"], a: 0, e: "'Despite' signals contrast with the rain." },
    { q: "She was ___ to hear that she had been selected.", o: ["delighted", "disappointed", "indifferent", "furious"], a: 0, e: "Being selected is good news." },
    { q: "The scientist's ___ research opened a new field of study.", o: ["pioneering", "trivial", "redundant", "outdated"], a: 0, e: "Opening a new field implies groundbreaking work." },
  ],
};

export const diQuestions: LessonQuestions = {
  "reading-tables": [
    { q: "A table shows sales of 120 in 2021 and 150 in 2022. What is the growth?", o: ["25%", "30%", "20%", "15%"], a: 0, e: "The increase of 30 is measured against the starting value: 30 / 120 = 25%." },
    { q: "A table lists monthly values 120, 150 and 130. What is the total?", o: ["400", "380", "420", "390"], a: 0, e: "120 + 150 + 130 = 400." },
    { q: "Before calculating from a table, what should you check first?", o: ["Units and headings, for example thousands or crores", "Font size", "Row colours", "The table's title length"], a: 0, e: "Misreading units gives answers that are off by orders of magnitude." },
  ],
  "data-comparison": [
    { q: "What is the ratio of 150 to 100?", o: ["3:2", "2:3", "1:2", "5:3"], a: 0, e: "Divide both by their HCF, 50, to get 3:2." },
    { q: "By what percent is 150 more than 120?", o: ["25%", "20%", "30%", "15%"], a: 0, e: "The increase of 30 is measured against the starting value: 30 / 120 = 25%." },
    { q: "By what percent is 120 less than 150?", o: ["20%", "25%", "30%", "15%"], a: 0, e: "30 / 150 = 20%. The base changes, so the percentages differ." },
  ],
  "bar-graphs": [
    { q: "Bars show 40, 60 and 80. What is the average?", o: ["60", "50", "70", "180"], a: 0, e: "The bars sum to 180 across 3 values, so the average is 60." },
    { q: "Bars show 40, 60 and 80. What is the difference between the tallest and shortest?", o: ["40", "20", "80", "60"], a: 0, e: "Tallest minus shortest: 80 − 40 = 40." },
    { q: "A bar graph's axis starts at 50 instead of 0. What's the risk?", o: ["Differences look larger than they are", "Values become wrong", "Bars disappear", "No risk"], a: 0, e: "Truncated axes exaggerate visual differences; read the numbers." },
  ],
  "line-graphs": [
    { q: "On a line graph, the steepest upward segment shows what?", o: ["The largest increase in that interval", "The highest value", "The average", "A decrease"], a: 0, e: "Slope shows the rate of change." },
    { q: "A value rises from 50 to 80. What is the percentage increase?", o: ["60%", "30%", "37.5%", "62.5%"], a: 0, e: "The rise of 30 is measured against the starting value 50: 60%." },
    { q: "Line graphs are best for showing what?", o: ["Trends over time", "Parts of a whole", "Unordered categories only", "Single values"], a: 0, e: "Pie charts show parts of a whole." },
  ],
  "pie-charts": [
    { q: "A category is 25% of the total. What is its angle in a pie chart?", o: ["90°", "25°", "45°", "120°"], a: 0, e: "Angle = share × 360° = 0.25 × 360 = 90°." },
    { q: "A sector of 72° in a total of 5,000. What value does it represent?", o: ["1,000", "720", "1,440", "500"], a: 0, e: "72 / 360 = 1/5 of 5000." },
    { q: "What do all angles in a pie chart add up to?", o: ["360°", "180°", "100°", "90°"], a: 0, e: "The full circle represents 100% of the data." },
  ],
  "mixed-graphs": [
    { q: "A bar shows revenue of 200 and a line shows a profit margin of 15%. What is the profit?", o: ["30", "15", "215", "185"], a: 0, e: "Profit = margin × revenue = 15% of 200 = 30." },
    { q: "In a chart with two y-axes, what must you check before comparing values?", o: ["Which axis and scale each series uses", "The colours only", "The legend font", "Nothing"], a: 0, e: "Two series can look equal while measuring very different numbers." },
    { q: "Why do mixed graphs combine bars and lines?", o: ["To show absolute values and rates or percentages together", "To save space only", "Because one chart type can't show numbers", "For decoration"], a: 0, e: "Bars for amounts, lines for trends or ratios." },
  ],
  "caselet-di": [
    { q: "Of 100 students, 60 like tea, 50 like coffee and 20 like both. How many like neither?", o: ["10", "20", "30", "0"], a: 0, e: "Tea or coffee = 60 + 50 − 20 = 90." },
    { q: "There are 200 students and 40% are girls. How many girls?", o: ["80", "40", "120", "60"], a: 0, e: "40% of 200 students is 0.4 × 200 = 80." },
    { q: "What is the best first step in a caselet (paragraph-based) DI set?", o: ["Organize the information into a table or diagram", "Guess the answers", "Read only the questions", "Calculate every possible value"], a: 0, e: "Structure makes the questions quick." },
  ],
  "di-data-sufficiency": [
    { q: "To find a profit percentage, which data do you need?", o: ["Cost price and selling price (or profit)", "Only the selling price", "Only the marked price", "Only the quantity sold"], a: 0, e: "Profit percent = profit / cost × 100." },
    { q: "Find A's sales. (1) Total sales are 500. (2) A has 40% of total sales.", o: ["Both together are needed", "Statement 1 alone", "Statement 2 alone", "Neither is enough"], a: 0, e: "Together they give A = 200." },
    { q: "Statement 1 alone answers the question, and so does statement 2 alone. What's the answer choice?", o: ["Each statement alone is sufficient", "Both together are needed", "Neither is sufficient", "Only statement 1 is sufficient"], a: 0, e: "Check each statement independently before combining." },
  ],
};

export const placementAptitudeQuestions: LessonQuestions = {
  "tcs-ninja-patterns": [
    { q: "In a timed test, what should you do with a question you can't crack in about a minute?", o: ["Mark it, move on and return if time remains", "Keep working until solved", "Leave the test", "Answer randomly and never return"], a: 0, e: "Time spent on one hard question costs several easy ones." },
    { q: "A test section has no negative marking. What follows?", o: ["Attempt every question, guessing if needed", "Leave unsure questions blank", "Answer only easy ones", "Spend all time on the first question"], a: 0, e: "A blank scores zero; a guess might score." },
    { q: "Which topics come up most often in service-company aptitude tests?", o: ["Percentages, ratios, time and work, and number series", "Calculus and matrices", "Organic chemistry", "Advanced statistics proofs"], a: 0, e: "Practise the high-frequency arithmetic topics first." },
  ],
  "infosys-logical": [
    { q: "Three boxes are labelled Apples, Oranges and Mixed, and every label is wrong. Picking one fruit from which box lets you label all three?", o: ["The box labelled Mixed", "The box labelled Apples", "The box labelled Oranges", "Any box"], a: 0, e: "The 'Mixed' box must hold a single fruit type; that fixes the others." },
    { q: "All bloops are razzies and all razzies are lazzies. Are all bloops lazzies?", o: ["Yes, definitely", "No", "Only some", "Can't be determined"], a: 0, e: "'All' relations chain transitively." },
    { q: "A, B and C sit in a row. A isn't at either end, and B is to A's right. Who sits on the left end?", o: ["C", "A", "B", "Can't be determined"], a: 0, e: "A is in the middle and B on the right, leaving C on the left." },
  ],
  "elimination-techniques": [
    { q: "Which of these can't be a perfect square?", o: ["72", "81", "64", "49"], a: 0, e: "Perfect squares never end in 2, 3, 7 or 8." },
    { q: "Using only unit digits, which is 123 × 457?", o: ["56,211", "56,214", "56,217", "56,218"], a: 0, e: "3 × 7 = 21, so the product ends in 1." },
    { q: "When the answer options are numbers, a fast way to solve an equation is what?", o: ["Substitute the options back into the equation", "Always solve fully first", "Pick the middle option", "Skip the question"], a: 0, e: "Plugging in options often beats algebra under time pressure." },
  ],
  "skimming-questions": [
    { q: "In a long word problem, what should you read first?", o: ["The final question being asked", "Every number in order", "The answer options only", "The title"], a: 0, e: "Knowing the target tells you which details matter." },
    { q: "Why skim a DI set before starting it?", o: ["To judge whether it's worth the time", "To memorize every value", "To find typos", "It wastes time"], a: 0, e: "Some sets are calculation-heavy and better left for later." },
    { q: "Which signal suggests a question is a time sink?", o: ["Many conditions and long calculations", "Short numbers", "A familiar topic", "Few options"], a: 0, e: "Attempt quick questions first, then return to heavy ones." },
  ],
};
