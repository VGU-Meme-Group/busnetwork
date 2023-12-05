jsonRawPath = 'data/raw_training_data.json'
jsonNewPath = 'data/new_training_data.json'

# Read the file
with open(jsonRawPath, 'r') as f:
    lines = f.readlines()
    
# Add commas and wrap with square brackets
with open(jsonNewPath, 'w') as f:
    f.write('[\n')
    for i, line in enumerate(lines):
        line = line.rstrip('\n')    # Remove the newline character
        if i != len(lines) - 1:     # If not the last line
            f.write(line + ',\n')
        else:  # If the last line
            f.write(line + '\n')
    f.write(']\n')

