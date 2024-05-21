#!/bin/bash

# List of files to combine
filesToCombine=(
  "app.js" 
  "index.html" 
  "login.js" 
  "main.html"
  "manifest.json" 
  "service-worker.js"
)

# Output file
outputFile="combine.md"

# Start the markdown content
echo "# Combined Files" > "$outputFile"
echo "" >> "$outputFile"

# Create the index at the top of the document
echo "## Index" >> "$outputFile"
counter=1
for file in "${filesToCombine[@]}"; do
  fileName=$(basename "$file")
  echo "$counter. [$fileName](\"#$fileName\")" >> "$outputFile"
  counter=$((counter + 1))
done
echo "" >> "$outputFile"

# Loop through each file and append its content to the output file
for file in "${filesToCombine[@]}"; do
  fileName=$(basename "$file")
  fileExtension="${file##*.}"
  echo "## $fileName" >> "$outputFile"
  echo "\`\`\`$fileExtension" >> "$outputFile"
  
  # Check if the first line contains the file name
  firstLine=$(head -n 1 "$file")
  if [[ "$firstLine" != *"$fileName"* ]]; then
    echo "// $fileName" >> "$outputFile"
  fi
  
  cat "$file" >> "$outputFile"
  echo "" >> "$outputFile"
  echo "\`\`\`" >> "$outputFile"
  echo "" >> "$outputFile"
done

echo "Files have been combined into $outputFile"
