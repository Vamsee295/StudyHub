import { Course } from './types';
import { createAptitudeLesson } from './aptitude-factory';

export const aptitudeQuantitativeCourse: Course = {
  id: "course-quant-aptitude",
  slug: "quantitative-aptitude",
  title: "Quantitative Aptitude",
  description: "Master the mathematical concepts required to solve placement aptitude problems quickly and accurately.",
  category: "Aptitude",
  icon: "Percent",
  displayOrder: 8,
  modules: [
    {
      id: "quant-mod-1",
      slug: "number-fundamentals",
      title: "Number Fundamentals",
      description: "Core number concepts and divisibility.",
      difficulty: "Beginner",
      estimatedMinutes: 100,
      lessons: [
        createAptitudeLesson(
          "number-system",
          "Number System",
          "Introduction to the foundation of mathematics.",
          "A number system is a method of representing numbers mathematically using a set of digits or symbols.",
          "Almost every quantitative problem starts with a solid understanding of basic number properties.",
          "Numbers are divided into Real and Imaginary. Real numbers branch into Rational and Irrinal. Further classification gives Integers, Whole numbers, and Natural numbers.",
          "Identify the category of a given number by checking if it can be represented as p/q (Rational) or if it has fractional parts.",
          "Is -5 a natural number? No, natural numbers start from 1. It is an integer.",
          "Representing repeating decimals as fractions: 0.333... = 1/3.",
          ["Confusing whole numbers with natural numbers (0 is whole but not natural)."],
          "Always check constraints in questions: if 'x is a positive integer', x cannot be 0.",
          {
            question: "Which of the following is not a rational number?",
            options: ["0", "-5", "sqrt(2)", "22/7"],
            answer: 2,
            explanation: "sqrt(2) cannot be written as a simple fraction, making it irrational."
          }
        ),
        createAptitudeLesson(
          "types-of-numbers",
          "Types of Numbers",
          "Prime, composite, even, and odd numbers.",
          "Numbers are classified by their divisibility properties.",
          "Direct questions on prime numbers are very common in TCS and Infosys exams.",
          "Even numbers are divisible by 2. Odd are not. Prime numbers have exactly two distinct factors (1 and itself). Composite numbers have more than two factors.",
          "To check if N is prime, you only need to check for divisibility by prime numbers up to sqrt(N).",
          "Is 91 a prime number? sqrt(91) is ~9.5. Primes to check: 2, 3, 5, 7. 91 is divisible by 7 (7*13=91). So, it's composite.",
          "1 is neither prime nor composite. 2 is the only even prime number.",
          ["Assuming 1 is a prime number.", "Assuming all odd numbers are prime (e.g., 9, 15)."],
          "Memorize prime numbers up to 100 to save crucial seconds.",
          {
            question: "How many prime numbers exist between 1 and 20?",
            options: ["7", "8", "9", "10"],
            answer: 1,
            explanation: "The 8 primes are: 2, 3, 5, 7, 11, 13, 17, 19."
          }
        ),
        createAptitudeLesson(
          "divisibility-rules",
          "Divisibility Rules",
          "Quick checks for divisibility without full division.",
          "Divisibility rules are shortcuts to determine if an integer is exactly divisible by another.",
          "These rules are essential for simplifying fractions and solving LCM/HCF questions rapidly.",
          "Rule of 3: Sum of digits is divisible by 3.\nRule of 4: Last 2 digits are divisible by 4.\nRule of 9: Sum of digits is divisible by 9.\nRule of 11: Difference between sum of odd-place digits and even-place digits is 0 or multiple of 11.",
          "Add the digits or check specific positions depending on the rule.",
          "Is 3456 divisible by 9? Sum = 3+4+5+6 = 18. Since 18 is divisible by 9, 3456 is too.",
          "Rule of 8: check if the last 3 digits are divisible by 8.",
          ["Adding digits for rule of 4 instead of looking at the last two digits."],
          "If a number is divisible by both 2 and 3, it is automatically divisible by 6.",
          {
            question: "Which of the following numbers is divisible by 11?",
            options: ["1331", "1234", "4567", "9876"],
            answer: 0,
            explanation: "For 1331: Sum of odd places (1+3=4). Sum of even places (3+1=4). 4 - 4 = 0."
          }
        ),
        createAptitudeLesson(
          "factors-multiples",
          "Factors and Multiples",
          "Understanding the building blocks of numbers.",
          "A factor divides a number exactly. A multiple is formed by multiplying the number by an integer.",
          "Forms the basis for LCM, HCF, and prime factorization questions.",
          "Every number is a factor and multiple of itself. Number of factors can be found using prime factorization: if N = p^a * q^b, total factors = (a+1)(b+1).",
          "To find total factors, prime factorize the number, add 1 to each exponent, and multiply them.",
          "Factors of 12: 1, 2, 3, 4, 6, 12 (6 factors).\nUsing formula: 12 = 2^2 * 3^1. Total = (2+1)*(1+1) = 3*2 = 6.",
          "If total factors is an odd number, the number is a perfect square.",
          ["Confusing factors with multiples (factors are smaller/equal, multiples are larger/equal)."],
          "Finding the number of factors is much faster using prime factorization than counting manually.",
          {
            question: "How many factors does the number 24 have?",
            options: ["6", "8", "10", "12"],
            answer: 1,
            explanation: "24 = 2^3 * 3^1. Total factors = (3+1)*(1+1) = 4*2 = 8."
          }
        ),
        createAptitudeLesson(
          "lcm-hcf",
          "LCM and HCF",
          "Least Common Multiple and Highest Common Factor.",
          "LCM is the smallest common multiple of two or more numbers. HCF is the largest common divisor.",
          "Almost guaranteed to appear in placement tests, especially in word problems involving cyclical events.",
          "LCM * HCF = Product of two numbers. For fractions, LCM = LCM of numerators / HCF of denominators.",
          "Use the prime factorization method or division method to find LCM/HCF.",
          "LCM of 12 and 15: 12=2^2*3, 15=3*5. LCM = 2^2*3*5 = 60.",
          "If a problem asks for the 'minimum' time they meet again, it's LCM. If it asks to divide into 'largest' equal segments, it's HCF.",
          ["Using LCM logic when the question implies HCF."],
          "For circular track problems where people run at different speeds, finding when they meet at the start is an LCM of time problem.",
          {
            question: "The HCF of two numbers is 8 and their product is 384. What is their LCM?",
            options: ["24", "36", "48", "64"],
            answer: 2,
            explanation: "LCM * HCF = Product. LCM * 8 = 384 -> LCM = 384/8 = 48."
          }
        )
      ]
    },
    {
      id: "quant-mod-2",
      slug: "arithmetic",
      title: "Arithmetic",
      description: "Percentages, profit/loss, and ratio concepts.",
      difficulty: "Intermediate",
      estimatedMinutes: 120,
      lessons: [
        createAptitudeLesson(
          "percentages",
          "Percentages",
          "Calculating parts per hundred.",
          "Percentage means 'out of 100'. It is a fraction with a denominator of 100.",
          "Percentages form the basis of Profit/Loss, SI/CI, and Data Interpretation.",
          "x% of y = (x/100) * y. Successive percentage change: A + B + (A*B/100).",
          "Always identify the 'base' value. 'A is what percent of B' = (A/B)*100.",
          "If salary increases by 20% then decreases by 20%: +20 - 20 - (20*20/100) = -4% (a 4% decrease).",
          "Learn standard fraction to percentage conversions: 1/3 = 33.33%, 1/6 = 16.66%, 1/8 = 12.5%.",
          ["Applying successive changes by simply adding them (20% up then 20% down is NOT 0%)."],
          "Whenever a value increases by x% and then decreases by x%, there is always a net decrease of (x^2/100)%.",
          {
            question: "A number is increased by 10% and then decreased by 10%. What is the net change?",
            options: ["0%", "1% increase", "1% decrease", "10% decrease"],
            answer: 2,
            explanation: "Successive change formula: +10 - 10 - (10*10)/100 = -1%. A 1% decrease."
          }
        ),
        createAptitudeLesson(
          "profit-and-loss",
          "Profit and Loss",
          "Calculating business transactions.",
          "Profit occurs when Selling Price (SP) > Cost Price (CP). Loss occurs when CP > SP.",
          "A fundamental concept tested heavily by TCS and Cognizant.",
          "Profit % = (Profit/CP) * 100. Loss % = (Loss/CP) * 100. Markup and Discount are calculated on CP and MRP respectively.",
          "Calculate everything relative to the Cost Price unless explicitly stated otherwise.",
          "CP = 100, SP = 120. Profit = 20. Profit % = (20/100)*100 = 20%.",
          "If an article is sold at a loss of 20%, SP = 0.8 * CP.",
          ["Calculating Profit/Loss percentage on Selling Price instead of Cost Price."],
          "Discount is ALWAYS calculated on the Marked Price (MRP), never on the Cost Price.",
          {
            question: "If an item is bought for $40 and sold for $50, what is the profit percentage?",
            options: ["20%", "25%", "10%", "50%"],
            answer: 1,
            explanation: "Profit = 50 - 40 = 10. Profit % = (10 / CP) * 100 = (10 / 40) * 100 = 25%."
          }
        ),
        createAptitudeLesson(
          "ratio-proportion",
          "Ratio and Proportion",
          "Comparing quantities and scaling.",
          "A ratio compares values. A proportion is an equation stating that two ratios are equal.",
          "Used in mixtures, partnership, and age-related problems.",
          "If A:B = c:d, then A/B = c/d. If a:b and b:c are given, multiply to find a:b:c.",
          "Use a common multiplier (x) for ratio problems.",
          "Divide 100 in ratio 2:3. Let parts be 2x and 3x. 5x = 100, x = 20. Parts are 40 and 60.",
          "To combine A:B = 2:3 and B:C = 4:5. Make B equal: A:B = 8:12, B:C = 12:15. So A:B:C = 8:12:15.",
          ["Adding ratios directly across different bases."],
          "In mixture problems, always track the quantity that remains constant.",
          {
            question: "If A:B = 3:4 and B:C = 8:9, what is A:C?",
            options: ["2:3", "3:9", "1:2", "4:5"],
            answer: 0,
            explanation: "(A/B) * (B/C) = A/C. (3/4) * (8/9) = 24/36 = 2/3."
          }
        ),
        createAptitudeLesson(
          "averages",
          "Averages",
          "Mean values and equal distribution.",
          "Average = Sum of all observations / Number of observations.",
          "Required for data interpretation and statistical word problems.",
          "If the average of N items is A, their total sum is N*A. If a new item is added, New Sum = N*A + New Item.",
          "Calculate total sums to solve complex average transitions.",
          "Average of 4 numbers is 10. Sum = 40. A 5th number (20) is added. New sum = 60. New average = 60/5 = 12.",
          "If all numbers in a set increase by X, the new average also increases by X.",
          ["Averaging two averages without weighting them by their group sizes."],
          "For weighted averages, use the formula: (N1*A1 + N2*A2) / (N1 + N2).",
          {
            question: "The average age of 10 students is 15. If the teacher's age is included, the average becomes 16. What is the teacher's age?",
            options: ["25", "26", "27", "28"],
            answer: 1,
            explanation: "Sum of 10 students = 150. Sum of 11 people = 11 * 16 = 176. Teacher = 176 - 150 = 26."
          }
        ),
        createAptitudeLesson(
          "simple-interest",
          "Simple Interest",
          "Linear interest calculation.",
          "Simple Interest is calculated only on the principal amount for the entire period.",
          "Direct formula application; frequently tested in banking and IT services exams.",
          "SI = (P * R * T) / 100, where P = Principal, R = Rate %, T = Time.",
          "Plug values into the formula. Ensure T is in years if R is per annum.",
          "P = 1000, R = 5%, T = 2 years. SI = (1000 * 5 * 2) / 100 = 100. Amount = 1100.",
          "If a sum doubles in T years, the interest earned equals the principal. So (P*R*T)/100 = P => R*T = 100.",
          ["Using months instead of years for T without dividing by 12."],
          "In SI, the interest earned each year is constant.",
          {
            question: "A sum of money doubles itself in 10 years at simple interest. What is the rate of interest?",
            options: ["5%", "8%", "10%", "12%"],
            answer: 2,
            explanation: "Interest = Principal. So P = P*R*10/100. 1 = R/10. R = 10%."
          }
        ),
        createAptitudeLesson(
          "compound-interest",
          "Compound Interest",
          "Interest on interest.",
          "Compound Interest is calculated on the principal and the accumulated interest of previous periods.",
          "Tests calculation speed and understanding of exponential growth.",
          "Amount = P(1 + R/100)^N. CI = Amount - Principal.",
          "Use the formula, or use successive percentage changes for 2 or 3 years.",
          "P=1000, R=10%, N=2. A = 1000*(1.1)^2 = 1000*1.21 = 1210. CI = 210.",
          "For 2 years, effective CI rate = 2R + (R^2)/100. (e.g., for 10%, 20 + 1 = 21%).",
          ["Applying SI formula multiple times instead of CI formula."],
          "Difference between CI and SI for 2 years = P * (R/100)^2.",
          {
            question: "What is the effective compound interest rate for 2 years at 10% per annum?",
            options: ["20%", "21%", "22%", "100%"],
            answer: 1,
            explanation: "Using successive change: 10 + 10 + (10*10)/100 = 21%."
          }
        )
      ]
    },
    {
      id: "quant-mod-3",
      slug: "time-based-problems",
      title: "Time Based Problems",
      description: "Work, speed, and relative motion.",
      difficulty: "Advanced",
      estimatedMinutes: 100,
      lessons: [
        createAptitudeLesson(
          "time-and-work",
          "Time and Work",
          "Rates of completing tasks.",
          "Time and Work deals with individuals completing a piece of work at different efficiencies.",
          "A classic placement topic (TCS Ninja, Wipro).",
          "If a person does a job in X days, their 1-day work is 1/X.",
          "Use the LCM method: assume Total Work = LCM of given days, then find daily efficiency.",
          "A takes 10 days. B takes 15 days. Total work = LCM(10,15) = 30 units. A's efficiency = 3 u/day. B's = 2 u/day. Together = 5 u/day. Time = 30/5 = 6 days.",
          "LCM method completely eliminates fractions and speeds up calculation by 3x.",
          ["Adding days instead of adding efficiencies."],
          "Efficiency is inversely proportional to time taken.",
          {
            question: "A can do a job in 20 days and B in 30 days. How long will they take working together?",
            options: ["10 days", "12 days", "25 days", "50 days"],
            answer: 1,
            explanation: "Work = LCM(20,30) = 60. A=3, B=2. Total efficiency = 5. Time = 60/5 = 12 days."
          }
        ),
        createAptitudeLesson(
          "pipes-and-cisterns",
          "Pipes and Cisterns",
          "Filling and emptying tanks.",
          "Similar to Time and Work, but introduces negative efficiency (emptying pipes).",
          "Direct extension of work concepts.",
          "Inlet pipe = positive work (+). Outlet pipe = negative work (-).",
          "Use the LCM method. Assign negative efficiency to the emptying pipe.",
          "Pipe A fills in 10h (+). Pipe B empties in 15h (-). LCM = 30 units. A = +3. B = -2. Net = +1 unit/hr. Time to fill = 30/1 = 30 hrs.",
          "The negative efficiency trick makes these problems identical to standard Time & Work.",
          ["Forgetting to subtract the efficiency of the outlet pipe."],
          "If net efficiency is negative, the tank will eventually empty, not fill.",
          {
            question: "Pipe A fills a tank in 4 hours. Pipe B empties it in 6 hours. If both are opened, how long to fill?",
            options: ["2.4 hours", "5 hours", "10 hours", "12 hours"],
            answer: 3,
            explanation: "LCM(4,6) = 12. A = +3, B = -2. Net = +1. Time = 12/1 = 12 hours."
          }
        ),
        createAptitudeLesson(
          "time-speed-distance",
          "Time, Speed and Distance",
          "Motion and kinematics.",
          "Deals with objects moving at constant speeds over distances.",
          "Core physics concept applied to aptitude.",
          "Distance = Speed * Time.",
          "Ensure all units match (km/h vs m/s) before applying the formula.",
          "Speed = 72 km/h. Distance = 200m. Convert speed: 72 * 5/18 = 20 m/s. Time = 200/20 = 10 seconds.",
          "To convert km/h to m/s, multiply by 5/18. From m/s to km/h, multiply by 18/5.",
          ["Mixing km/h with seconds in calculations."],
          "Average speed = Total Distance / Total Time. It is NOT the simple average of two speeds.",
          {
            question: "Convert 90 km/h into m/s.",
            options: ["15 m/s", "20 m/s", "25 m/s", "30 m/s"],
            answer: 2,
            explanation: "90 * (5/18) = 5 * 5 = 25 m/s."
          }
        ),
        createAptitudeLesson(
          "boats-and-streams",
          "Boats and Streams",
          "Relative speed in fluid.",
          "Calculates speed of objects moving with or against a flowing current.",
          "Requires understanding of relative motion.",
          "Downstream speed (D) = Boat Speed (B) + Stream Speed (S). Upstream (U) = B - S.",
          "Use the equations to solve for B or S: B = (D+U)/2, S = (D-U)/2.",
          "Boat speed = 10, Stream = 2. Downstream = 12. Upstream = 8.",
          "Always remember: B = (D+U)/2 and S = (D-U)/2.",
          ["Confusing downstream (faster) with upstream (slower)."],
          "The boat's speed in still water is always exactly halfway between upstream and downstream speeds.",
          {
            question: "A boat travels downstream at 14 km/h and upstream at 10 km/h. What is the speed of the stream?",
            options: ["2 km/h", "4 km/h", "12 km/h", "24 km/h"],
            answer: 0,
            explanation: "S = (D - U) / 2 = (14 - 10) / 2 = 4 / 2 = 2 km/h."
          }
        ),
        createAptitudeLesson(
          "trains",
          "Trains",
          "Moving bodies with significant length.",
          "Train problems require adding the length of the train to the distance covered.",
          "High frequency topic in TCS and Infosys.",
          "When a train passes a pole, Distance = Train Length. When it passes a platform, Distance = Train Length + Platform Length.",
          "Relative speed: Add speeds if moving opposite, subtract if moving same direction.",
          "Train (100m) passes platform (150m). Total distance = 250m. If speed is 25m/s, time = 250/25 = 10s.",
          "Always draw a quick mental picture to see if lengths should be added.",
          ["Forgetting to add the length of the platform to the distance."],
          "When two trains pass each other, you ALWAYS add their lengths, regardless of direction.",
          {
            question: "A 200m train running at 20 m/s passes a pole. How long does it take?",
            options: ["5s", "10s", "15s", "20s"],
            answer: 1,
            explanation: "Distance = Train length = 200m. Time = 200 / 20 = 10s."
          }
        )
      ]
    },
    {
      id: "quant-mod-4",
      slug: "algebra",
      title: "Algebra",
      description: "Equations and identities.",
      difficulty: "Intermediate",
      estimatedMinutes: 100,
      lessons: [
        createAptitudeLesson(
          "basic-algebra",
          "Basic Algebra",
          "Variables and expressions.",
          "Algebra involves solving for unknown variables using mathematical expressions.",
          "Foundational for solving word problems.",
          "Use BODMAS/PEMDAS. Group like terms.",
          "Translate word problems into equations (e.g. 'twice a number' -> 2x).",
          "If 3x + 5 = 20, then 3x = 15, so x = 5.",
          "Plug the answer options into the equation instead of solving it algebraically to save time.",
          ["Making sign errors when moving terms across the equals sign."],
          "Back-substitution from options is often faster than solving the equation.",
          {
            question: "If 4x - 7 = 13, what is x?",
            options: ["3", "4", "5", "6"],
            answer: 2,
            explanation: "4x = 13 + 7 = 20. x = 20/4 = 5."
          }
        ),
        createAptitudeLesson(
          "linear-equations",
          "Linear Equations",
          "Equations with degree 1.",
          "Simultaneous equations involving two or more variables.",
          "Used in age problems and mixing problems.",
          "Use substitution or elimination methods.",
          "Multiply one equation by a constant to eliminate a variable when added.",
          "x+y=10, x-y=4. Add them: 2x=14 -> x=7. y=3.",
          "Add or subtract the equations entirely to quickly find x+y or x-y if asked.",
          ["Solving for the wrong variable."],
          "In age problems, if a ratio is given for '5 years ago', apply the -5 to both ages.",
          {
            question: "If x + y = 12 and x - y = 4, what is x * y?",
            options: ["16", "32", "48", "64"],
            answer: 1,
            explanation: "Adding gives 2x = 16 -> x = 8. Subtracting gives 2y = 8 -> y = 4. 8 * 4 = 32."
          }
        ),
        createAptitudeLesson(
          "quadratic-equations",
          "Quadratic Equations",
          "Equations with degree 2.",
          "Equations in the form ax^2 + bx + c = 0.",
          "Commonly appears in advanced aptitude tests.",
          "Roots formula: x = [-b +/- sqrt(b^2 - 4ac)] / 2a. Sum of roots = -b/a. Product = c/a.",
          "Factorize by splitting the middle term.",
          "x^2 - 5x + 6 = 0. Factors of 6 that add to -5 are -2, -3. Roots are 2 and 3.",
          "Change the sign of the split terms to get the roots directly (if a=1).",
          ["Forgetting the +/- in the quadratic formula."],
          "If the discriminant (b^2 - 4ac) is negative, the roots are imaginary.",
          {
            question: "What is the sum of the roots of 2x^2 - 8x + 5 = 0?",
            options: ["-4", "4", "-8", "8"],
            answer: 1,
            explanation: "Sum of roots = -b/a = -(-8)/2 = 4."
          }
        ),
        createAptitudeLesson(
          "algebraic-identities",
          "Algebraic Identities",
          "Standard algebraic formulas.",
          "Identities are equations that hold true for all values of the variables.",
          "Crucial for simplifying complex polynomial expressions.",
          "(a+b)^2 = a^2 + b^2 + 2ab. (a-b)^2 = a^2 + b^2 - 2ab. a^2 - b^2 = (a-b)(a+b).",
          "Recognize the pattern in the question and apply the identity.",
          "Evaluate 101^2 - 99^2. Use a^2 - b^2: (101-99)(101+99) = 2 * 200 = 400.",
          "If x + 1/x = k, then x^2 + 1/x^2 = k^2 - 2.",
          ["Expanding binomials manually instead of using identities."],
          "Memorize the identity a^3 + b^3 = (a+b)(a^2 - ab + b^2).",
          {
            question: "If x + 1/x = 3, what is x^2 + 1/x^2?",
            options: ["7", "9", "11", "6"],
            answer: 0,
            explanation: "Formula: k^2 - 2. So 3^2 - 2 = 9 - 2 = 7."
          }
        ),
        createAptitudeLesson(
          "progressions",
          "Progressions",
          "Arithmetic and Geometric sequences.",
          "AP has a common difference. GP has a common ratio.",
          "Often asked in logical reasoning as well as quant.",
          "AP nth term: a + (n-1)d. AP Sum: n/2 * (2a + (n-1)d). GP nth term: a*r^(n-1).",
          "Identify 'a' (first term) and 'd' or 'r'. Plug into formula.",
          "Find 10th term of AP: 2, 5, 8... a=2, d=3. Term = 2 + 9*3 = 29.",
          "Sum of first N natural numbers = N(N+1)/2.",
          ["Using AP formulas on a GP sequence."],
          "If 3 terms are in AP, let them be a-d, a, a+d.",
          {
            question: "What is the sum of the first 100 natural numbers?",
            options: ["5000", "5050", "10000", "500"],
            answer: 1,
            explanation: "N(N+1)/2 = 100*101/2 = 50 * 101 = 5050."
          }
        )
      ]
    },
    {
      id: "quant-mod-5",
      slug: "advanced-aptitude",
      title: "Advanced Aptitude",
      description: "Combinatorics, probability, and geometry.",
      difficulty: "Advanced",
      estimatedMinutes: 120,
      lessons: [
        createAptitudeLesson(
          "permutations",
          "Permutations",
          "Arranging objects.",
          "Permutation is the number of ways to ARRANGE objects where order matters.",
          "Used in seating arrangement and word-building problems.",
          "nPr = n! / (n-r)!. Arrangement of n distinct objects = n!.",
          "Identify if order matters. If it does, use permutations.",
          "Ways to arrange A, B, C = 3! = 6.",
          "If some items are identical, divide by the factorial of their counts (e.g., APPLE = 5! / 2!).",
          ["Using permutation when order doesn't matter (combination)."],
          "Arranging n people in a circle = (n-1)! ways.",
          {
            question: "In how many ways can the letters of the word MATH be arranged?",
            options: ["12", "24", "48", "60"],
            answer: 1,
            explanation: "4 distinct letters. 4! = 4*3*2*1 = 24."
          }
        ),
        createAptitudeLesson(
          "combinations",
          "Combinations",
          "Selecting objects.",
          "Combination is the number of ways to SELECT objects where order does NOT matter.",
          "Used in forming committees, picking cards, or balls from a bag.",
          "nCr = n! / (r! * (n-r)!).",
          "Identify if it's purely a selection. Use nCr.",
          "Select 2 people from 5. 5C2 = (5*4)/(2*1) = 10.",
          "nCr = nC(n-r). E.g., 100C98 is just 100C2.",
          ["Multiplying instead of adding for 'OR' conditions."],
          "'AND' means multiply. 'OR' means add.",
          {
            question: "How many ways can you select a committee of 3 from 6 people?",
            options: ["10", "15", "20", "120"],
            answer: 2,
            explanation: "6C3 = (6*5*4) / (3*2*1) = 20."
          }
        ),
        createAptitudeLesson(
          "probability",
          "Probability",
          "Chances of an event occurring.",
          "Probability = Favorable Outcomes / Total Outcomes.",
          "Very common in product company interviews.",
          "P(E) = n(E) / n(S). Total probability = 1.",
          "Find total outcomes (sample space). Then find favorable outcomes using combinations.",
          "Roll a die. P(even) = 3/6 = 1/2.",
          "If events are independent, P(A and B) = P(A) * P(B).",
          ["Calculating combinations incorrectly when pulling multiple items."],
          "Probability can never be greater than 1.",
          {
            question: "A bag has 3 red and 2 blue balls. Probability of drawing a blue ball?",
            options: ["2/3", "2/5", "3/5", "1/2"],
            answer: 1,
            explanation: "Favorable = 2. Total = 5. P = 2/5."
          }
        ),
        createAptitudeLesson(
          "geometry",
          "Geometry",
          "Lines, angles, and shapes.",
          "Properties of 2D shapes, angles, and triangles.",
          "Required for spatial reasoning.",
          "Sum of angles in a triangle = 180. Pythagoras: a^2 + b^2 = c^2.",
          "Draw the figure. Apply basic properties.",
          "Triangle with sides 3, 4, 5 is a right triangle because 3^2 + 4^2 = 5^2.",
          "Recognize Pythagorean triplets (3-4-5, 5-12-13).",
          ["Assuming a triangle is right-angled without proof."],
          "The sum of any two sides of a triangle must be greater than the third side.",
          {
            question: "What is the hypotenuse of a right triangle with sides 6 and 8?",
            options: ["10", "12", "14", "100"],
            answer: 0,
            explanation: "sqrt(6^2 + 8^2) = sqrt(36 + 64) = sqrt(100) = 10."
          }
        ),
        createAptitudeLesson(
          "mensuration",
          "Mensuration",
          "Area and Volume.",
          "Calculation of area (2D) and volume (3D) of shapes.",
          "Direct formula application.",
          "Area of circle = pi*r^2. Volume of cylinder = pi*r^2*h.",
          "Memorize formulas and plug in values.",
          "Area of square with side 4 = 16.",
          "If radius of a circle doubles, area becomes 4 times.",
          ["Mixing up formulas for surface area and volume."],
          "Units matter. Area is square units, volume is cubic.",
          {
            question: "What is the area of a circle with radius 7? (Use pi=22/7)",
            options: ["44", "154", "314", "49"],
            answer: 1,
            explanation: "(22/7) * 7 * 7 = 22 * 7 = 154."
          }
        ),
        createAptitudeLesson(
          "data-interpretation",
          "Data Interpretation",
          "Extracting info from graphs.",
          "Analyzing bar charts, pie charts, and tables to answer questions.",
          "Core skill for consulting and data roles.",
          "Involves fast calculation of percentages and ratios from visual data.",
          "Do not calculate exact values if approximations suffice.",
          "If A is 480 and B is 950, A is roughly 50% of B.",
          "Read the axes and legends carefully before looking at the questions.",
          ["Calculating everything to 2 decimal places when options are far apart."],
          "DI tests calculation speed. Use fraction shortcuts.",
          {
            question: "If a pie chart segment is 90 degrees, what percentage of the total does it represent?",
            options: ["20%", "25%", "33.3%", "50%"],
            answer: 1,
            explanation: "(90 / 360) * 100 = 1/4 * 100 = 25%."
          }
        )
      ]
    }
  ]
};
