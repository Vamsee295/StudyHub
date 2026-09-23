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
  }
];

export const generateRandomArray = (size: number, min = 10, max = 100) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};
