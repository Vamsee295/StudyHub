HIDDEN_TESTS = {
    "1": [
        {
            "id": "hidden-1",
            "input": {"nums": [1, 5, 8, 3], "target": 8},
            "expectedOutput": [1, 3]
        },
        {
            "id": "hidden-2",
            "input": {"nums": [3, 2, 3], "target": 6},
            "expectedOutput": [0, 2]
        }
    ],
    "2": [
        {
            "id": "hidden-1",
            "input": {"l1": [2, 4, 9], "l2": [5, 6, 4]},
            "expectedOutput": [7, 0, 4, 1]
        }
    ],
    "3": [
        {
            "id": "hidden-1",
            "input": {"s": ""},
            "expectedOutput": 0
        },
        {
            "id": "hidden-2",
            "input": {"s": "au"},
            "expectedOutput": 2
        }
    ],
    "4": [
        {
            "id": "hidden-1",
            "input": {"nums1": [0, 0], "nums2": [0, 0]},
            "expectedOutput": 0.0
        },
        {
            "id": "hidden-2",
            "input": {"nums1": [], "nums2": [1]},
            "expectedOutput": 1.0
        }
    ],
    "15": [
        {
            "id": "hidden-1",
            "input": {"nums": [-2, 0, 1, 1, 2]},
            "expectedOutput": [[-2, 0, 2], [-2, 1, 1]]
        }
    ],
    "20": [
        {
            "id": "hidden-1",
            "input": {"s": "([])"},
            "expectedOutput": True
        },
        {
            "id": "hidden-2",
            "input": {"s": "([)]"},
            "expectedOutput": False
        }
    ],
    "21": [
        {
            "id": "hidden-1",
            "input": {"list1": [2], "list2": [1]},
            "expectedOutput": [1, 2]
        }
    ],
    "26": [
        {
            "id": "hidden-1",
            "input": {"nums": [1]},
            "expectedOutput": 1
        },
        {
            "id": "hidden-2",
            "input": {"nums": [1, 2, 3]},
            "expectedOutput": 3
        }
    ],
    "33": [
        {
            "id": "hidden-1",
            "input": {"nums": [1, 3], "target": 3},
            "expectedOutput": 1
        },
        {
            "id": "hidden-2",
            "input": {"nums": [5, 1, 3], "target": 5},
            "expectedOutput": 0
        }
    ],
    "53": [
        {
            "id": "hidden-1",
            "input": {"nums": [-1, -2, -3]},
            "expectedOutput": -1
        }
    ],
    "121": [
        {
            "id": "hidden-1",
            "input": {"prices": [2, 4, 1]},
            "expectedOutput": 2
        },
        {
            "id": "hidden-2",
            "input": {"prices": [1, 2]},
            "expectedOutput": 1
        }
    ],
    "704": [
        {
            "id": "hidden-1",
            "input": {"nums": [5], "target": 5},
            "expectedOutput": 0
        },
        {
            "id": "hidden-2",
            "input": {"nums": [2, 5], "target": 5},
            "expectedOutput": 1
        }
    ]
}

def get_hidden_tests(problem_id: str):
    return HIDDEN_TESTS.get(problem_id, [])
