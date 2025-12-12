# Mathematical Problem Step-by-Step Grading Model

A comprehensive grading system that evaluates student solutions step-by-step against gold standard solutions for mathematical problems.

## Features

- **Step-by-step evaluation**: Grades each step individually with correctness labels (Correct/Partially correct/Incorrect)
- **Flexible matching**: Supports exact matches, mathematical equivalence, and intermediate derivations
- **Configurable scoring**: Each step can have custom point values
- **Required step handling**: Tracks whether steps are required and adjusts scoring accordingly
- **Detailed feedback**: Provides per-step feedback and scoring breakdown

## Installation

```bash
pip install -r requirements.txt
```

## Quick Start

```python
from math_grader import MathGrader, Step

# Define gold standard solution
gold_steps = [
    Step("x^2 - 5x + 6 = 0", points=1.0, required=True),
    Step("(x - 2)(x - 3) = 0", points=1.0, required=True),
    Step("x = 2 or x = 3", points=2.0, required=True),
]

# Create grader
grader = MathGrader(gold_steps)

# Grade student solution
student_solution = [
    "x^2 - 5x + 6 = 0",
    "(x - 2)(x - 3) = 0",
    "x = 2 or x = 3"
]

result = grader.grade(student_solution)
print(f"Score: {result['total_score']}/{result['max_score']}")
print(f"Percentage: {result['percentage']:.1f}%")
```

## Usage

### Basic Usage

```python
from math_grader import MathGrader, Step

# Create gold standard steps
gold_steps = [
    Step("2x + 3 = 11", points=1.0, required=True),
    Step("2x = 8", points=1.0, required=True),
    Step("x = 4", points=2.0, required=True),
]

grader = MathGrader(gold_steps)
result = grader.grade(["2x + 3 = 11", "2x = 8", "x = 4"])
```

### Using Helper Function

```python
from math_grader import create_grader_from_rubric

grader = create_grader_from_rubric([
    ("2x + 3 = 11", 1.0, True),
    ("2x = 8", 1.0, True),
    ("x = 4", 2.0, True),
])
```

### Understanding Results

The `grade()` method returns a dictionary with:

- `evaluations`: List of `StepEvaluation` objects, one per student step
- `total_score`: Total points earned
- `max_score`: Maximum possible points
- `percentage`: Score as percentage

Each `StepEvaluation` contains:

- `status`: `StepStatus.CORRECT`, `PARTIALLY_CORRECT`, or `INCORRECT`
- `points_earned`: Points awarded for this step
- `feedback`: Explanation of the evaluation
- `matched_gold_step`: Index of the matched gold step (if any)

## Scoring Logic

The grader awards points for a student step if it:

1. **Matches exactly**: Same text as gold step
2. **Is mathematically equivalent**: Different notation but same mathematical meaning
3. **Is a valid intermediate derivation**: Shows work leading to a gold step

### Handling Omitted Steps

- If a student skips required steps, later steps may receive reduced credit
- The system checks if earlier required steps were completed before awarding full points

## Examples

See `example_usage.py` for comprehensive examples including:

- Quadratic equations
- Linear equations
- Calculus problems
- Interactive grading mode

Run examples:

```bash
python example_usage.py
```

## API Reference

### `Step(content, points=1.0, required=True)`

Represents a single step in a solution.

- `content`: The mathematical expression or explanation
- `points`: Points awarded for this step
- `required`: Whether this step is required for later steps to be valid

### `MathGrader(gold_steps, tolerance=1e-6)`

Main grading class.

- `gold_steps`: List of `Step` objects representing the gold standard
- `tolerance`: Numerical tolerance for floating point comparisons

### `grade(student_steps)`

Grades a student solution.

- `student_steps`: List of strings representing student steps
- Returns: Dictionary with evaluation results

## Mathematical Expression Support

The grader uses SymPy for mathematical expression parsing and comparison. It supports:

- Equations (e.g., `x + 2 = 5`)
- Expressions (e.g., `x^2 + 3x`)
- Various notations (e.g., `x^2` or `x**2`)
- Symbolic math operations

## License

This project is provided as-is for educational and research purposes.

