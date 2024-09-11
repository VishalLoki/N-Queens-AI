import csv

# Function to check if a queen can be placed on the board without conflicts
def is_safe(board, row, col):
    # Check this column on the upper side
    for i in range(row):
        if board[i] == col or abs(board[i] - col) == abs(i - row):
            return False
    return True

# Backtracking function to find all solutions
def solve_n_queens(n, row, board, solutions):
    if row == n:  # Found a valid solution
        solutions.append(board[:])
        return

    for col in range(n):
        if is_safe(board, row, col):
            board[row] = col  # Place queen at (row, col)
            solve_n_queens(n, row + 1, board, solutions)
            board[row] = -1  # Backtrack

# Generate all solutions for the 8-Queens problem
def generate_8_queen_solutions():
    n = 8
    board = [-1] * n  # Initialize the board
    solutions = []
    solve_n_queens(n, 0, board, solutions)
    return solutions

# Save solutions to a CSV file
def save_solutions_to_csv(solutions, filename):
    with open(filename, 'w', newline='') as file:
        writer = csv.writer(file)
        # Write each solution to the CSV file
        for solution in solutions:
            writer.writerow(solution)

if __name__ == "__main__":
    solutions = generate_8_queen_solutions()
    print(f"Total solutions found: {len(solutions)}")  # Should print 92
    save_solutions_to_csv(solutions, '8_queens_solutions.csv')
    print("Solutions saved to '8_queens_solutions.csv'.")
