export type ElementState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'found';

export interface DsaElement {
  value: number;
  id: string;
  state: ElementState;
}

export interface DsaStep {
  elements: DsaElement[];
  description: string;
  activePointers: { label: string; index: number; color?: string }[];
  lineIndex?: number;
}

export interface DsaAlgorithm {
  id: string;
  name: string;
  category: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  run: (initialArray: number[]) => DsaStep[];
  pseudoCode: string[];
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const createInitialElements = (arr: number[]): DsaElement[] => 
  arr.map(val => ({ value: val, id: generateId(), state: 'default' }));

const bubbleSort = (arr: number[]): DsaStep[] => {
  const steps: DsaStep[] = [];
  const elements = createInitialElements(arr);
  const n = elements.length;
  let currentElements = [...elements];

  steps.push({
    elements: [...currentElements],
    description: "Start Bubble Sort",
    activePointers: [],
    lineIndex: 0
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      currentElements = currentElements.map(e => ({ ...e, state: e.state === 'sorted' ? 'sorted' : 'default' }));
      currentElements[j] = { ...currentElements[j], state: 'comparing' };
      currentElements[j + 1] = { ...currentElements[j + 1], state: 'comparing' };

      steps.push({
        elements: [...currentElements],
        description: `Comparing ${currentElements[j].value} and ${currentElements[j + 1].value}`,
        activePointers: [{ label: 'j', index: j }, { label: 'j+1', index: j + 1 }],
        lineIndex: 2
      });

      if (currentElements[j].value > currentElements[j + 1].value) {
        currentElements = [...currentElements];
        currentElements[j] = { ...currentElements[j], state: 'swapping' };
        currentElements[j + 1] = { ...currentElements[j + 1], state: 'swapping' };
        
        steps.push({
          elements: [...currentElements],
          description: `${currentElements[j].value} > ${currentElements[j+1].value}, so swap them`,
          activePointers: [{ label: 'j', index: j }, { label: 'j+1', index: j + 1 }],
          lineIndex: 3
        });

        // Swap
        const temp = currentElements[j];
        currentElements[j] = currentElements[j + 1];
        currentElements[j + 1] = temp;

        steps.push({
          elements: [...currentElements],
          description: `Swapped.`,
          activePointers: [{ label: 'j', index: j }, { label: 'j+1', index: j + 1 }],
          lineIndex: 4
        });
      }
    }
    currentElements[n - i - 1] = { ...currentElements[n - i - 1], state: 'sorted' };
    steps.push({
      elements: [...currentElements],
      description: `${currentElements[n - i - 1].value} is now in its final sorted position.`,
      activePointers: [],
      lineIndex: 5
    });
  }
  currentElements[0] = { ...currentElements[0], state: 'sorted' };
  steps.push({
    elements: [...currentElements],
    description: `Array is sorted!`,
    activePointers: [],
    lineIndex: 6
  });

  return steps;
};

const linearSearch = (arr: number[]): DsaStep[] => {
  const steps: DsaStep[] = [];
  const target = arr[Math.floor(Math.random() * arr.length)]; // Pick a random target for demo
  const elements = createInitialElements(arr);
  let currentElements = [...elements];

  steps.push({
    elements: [...currentElements],
    description: `Start Linear Search for target = ${target}`,
    activePointers: [],
    lineIndex: 0
  });

  for (let i = 0; i < arr.length; i++) {
    currentElements = currentElements.map(e => ({ ...e, state: 'default' }));
    currentElements[i] = { ...currentElements[i], state: 'comparing' };

    steps.push({
      elements: [...currentElements],
      description: `Checking index ${i}: is ${currentElements[i].value} == ${target}?`,
      activePointers: [{ label: 'i', index: i }],
      lineIndex: 2
    });

    if (currentElements[i].value === target) {
      currentElements[i] = { ...currentElements[i], state: 'found' };
      steps.push({
        elements: [...currentElements],
        description: `Found ${target} at index ${i}!`,
        activePointers: [{ label: 'i', index: i }],
        lineIndex: 3
      });
      return steps;
    }
  }

  return steps;
};

// Each pass finds the smallest unsorted value and swaps it to the front of the unsorted part.
const selectionSort = (arr: number[]): DsaStep[] => {
  const steps: DsaStep[] = [];
  let cur = createInitialElements(arr);
  const n = cur.length;
  const reset = () => (cur = cur.map((e) => ({ ...e, state: e.state === "sorted" ? "sorted" : "default" })));
  steps.push({ elements: [...cur], description: "Start Selection Sort", activePointers: [], lineIndex: 0 });

  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      reset();
      cur[min] = { ...cur[min], state: "found" };
      cur[j] = { ...cur[j], state: "comparing" };
      steps.push({
        elements: [...cur],
        description: `Is ${cur[j].value} smaller than the current minimum ${cur[min].value}?`,
        activePointers: [{ label: "min", index: min }, { label: "j", index: j }],
        lineIndex: 3,
      });
      if (cur[j].value < cur[min].value) {
        min = j;
        steps.push({ elements: [...cur], description: `Yes: ${cur[j].value} is the new minimum.`, activePointers: [{ label: "min", index: min }], lineIndex: 4 });
      }
    }
    if (min !== i) {
      reset();
      cur[i] = { ...cur[i], state: "swapping" };
      cur[min] = { ...cur[min], state: "swapping" };
      steps.push({ elements: [...cur], description: `Swap ${cur[min].value} into position ${i}.`, activePointers: [{ label: "i", index: i }, { label: "min", index: min }], lineIndex: 5 });
      [cur[i], cur[min]] = [cur[min], cur[i]];
    }
    reset();
    cur[i] = { ...cur[i], state: "sorted" };
    steps.push({ elements: [...cur], description: `${cur[i].value} is in its final position.`, activePointers: [], lineIndex: 6 });
  }
  cur[n - 1] = { ...cur[n - 1], state: "sorted" };
  steps.push({ elements: [...cur], description: "Array is sorted!", activePointers: [], lineIndex: 7 });
  return steps;
};

// Grows a sorted prefix: each new value shifts left past larger values until it fits.
const insertionSort = (arr: number[]): DsaStep[] => {
  const steps: DsaStep[] = [];
  let cur = createInitialElements(arr);
  const n = cur.length;
  cur[0] = { ...cur[0], state: "sorted" };
  steps.push({ elements: [...cur], description: "Start Insertion Sort: the first value alone is a sorted prefix.", activePointers: [], lineIndex: 0 });

  for (let i = 1; i < n; i++) {
    let j = i;
    cur = cur.map((e, k) => ({ ...e, state: k < i ? "sorted" : "default" }));
    cur[j] = { ...cur[j], state: "comparing" };
    steps.push({ elements: [...cur], description: `Insert ${cur[j].value} into the sorted prefix.`, activePointers: [{ label: "i", index: i }], lineIndex: 1 });
    while (j > 0 && cur[j - 1].value > cur[j].value) {
      cur[j] = { ...cur[j], state: "swapping" };
      cur[j - 1] = { ...cur[j - 1], state: "swapping" };
      steps.push({ elements: [...cur], description: `${cur[j - 1].value} > ${cur[j].value}, so shift ${cur[j - 1].value} right.`, activePointers: [{ label: "j", index: j }], lineIndex: 3 });
      [cur[j - 1], cur[j]] = [cur[j], cur[j - 1]];
      cur[j] = { ...cur[j], state: "sorted" };
      cur[j - 1] = { ...cur[j - 1], state: "comparing" };
      j--;
    }
    cur = cur.map((e, k) => ({ ...e, state: k <= i ? "sorted" : "default" }));
    steps.push({ elements: [...cur], description: `${cur[j].value} is in place; the first ${i + 1} values are sorted.`, activePointers: [], lineIndex: 5 });
  }
  steps.push({ elements: [...cur], description: "Array is sorted!", activePointers: [], lineIndex: 6 });
  return steps;
};

// Needs sorted input: the visualizer sorts a copy first, then halves the search range each step.
const binarySearch = (input: number[]): DsaStep[] => {
  const arr = [...input].sort((a, b) => a - b);
  const steps: DsaStep[] = [];
  const target = arr[Math.floor(Math.random() * arr.length)];
  let cur = createInitialElements(arr);
  steps.push({ elements: [...cur], description: `Binary search needs sorted input, so the values are sorted first. Searching for ${target}.`, activePointers: [], lineIndex: 0 });

  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    cur = cur.map((e, k) => ({ ...e, state: k < lo || k > hi ? "sorted" : "default" }));
    cur[mid] = { ...cur[mid], state: "comparing" };
    steps.push({
      elements: [...cur],
      description: `Check the middle of [${lo}..${hi}]: index ${mid} holds ${cur[mid].value}.`,
      activePointers: [{ label: "lo", index: lo }, { label: "mid", index: mid }, { label: "hi", index: hi }],
      lineIndex: 2,
    });
    if (cur[mid].value === target) {
      cur[mid] = { ...cur[mid], state: "found" };
      steps.push({ elements: [...cur], description: `Found ${target} at index ${mid}.`, activePointers: [{ label: "mid", index: mid }], lineIndex: 3 });
      return steps;
    }
    if (cur[mid].value < target) {
      steps.push({ elements: [...cur], description: `${cur[mid].value} < ${target}: the target must be to the right.`, activePointers: [{ label: "mid", index: mid }], lineIndex: 4 });
      lo = mid + 1;
    } else {
      steps.push({ elements: [...cur], description: `${cur[mid].value} > ${target}: the target must be to the left.`, activePointers: [{ label: "mid", index: mid }], lineIndex: 5 });
      hi = mid - 1;
    }
  }
  return steps;
};

export const DSA_ALGORITHMS: DsaAlgorithm[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'Sorting',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    run: bubbleSort,
    pseudoCode: [
      'for i = 0 to n-1',
      '  for j = 0 to n-i-1',
      '    if arr[j] > arr[j+1]',
      '      swap(arr[j], arr[j+1])',
      '    end if',
      '  end for',
      'end for'
    ]
  },
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'Searching',
    description: 'Finds an element within a list by sequentially checking each element of the list for the target value until a match is found.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    run: linearSearch,
    pseudoCode: [
      'for each item in array',
      '  if item == target',
      '    return match',
      '  end if',
      'end for',
      'return null'
    ]
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'Sorting',
    description: 'Repeatedly selects the smallest value from the unsorted part and swaps it to the front. Always O(n²) comparisons, but at most n − 1 swaps.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    run: selectionSort,
    pseudoCode: [
      'for i = 0 to n-2',
      '  min = i',
      '  for j = i+1 to n-1',
      '    if arr[j] < arr[min]',
      '      min = j',
      '  swap(arr[i], arr[min])',
      '  arr[i] is now final',
      'end for'
    ]
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'Sorting',
    description: 'Builds a sorted prefix one value at a time, shifting larger values right to make room. O(n) on nearly sorted input, O(n²) in the worst case.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    run: insertionSort,
    pseudoCode: [
      'for i = 1 to n-1',
      '  j = i',
      '  while j > 0 and arr[j-1] > arr[j]',
      '    swap(arr[j-1], arr[j])',
      '    j = j - 1',
      '  arr[0..i] is sorted',
      'end for'
    ]
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'Searching',
    description: 'Finds a value in sorted data by comparing with the middle element and discarding the half that cannot contain it.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    run: binarySearch,
    pseudoCode: [
      'lo = 0, hi = n-1',
      'while lo <= hi',
      '  mid = lo + (hi - lo) / 2',
      '  if arr[mid] == target: return mid',
      '  if arr[mid] < target: lo = mid + 1',
      '  else: hi = mid - 1',
      'return -1'
    ]
  }
];

export const generateRandomArray = (size: number, min = 10, max = 100) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};
