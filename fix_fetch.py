import os
import glob

files = glob.glob('app/tools/*/page.tsx')

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Fix the fetch syntax - add opening parenthesis
    content = content.replace(
        'await fetch`${BACKEND_URL}/api/chat`, {',
        'await fetch(`${BACKEND_URL}/api/chat`, {'
    )
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Fixed: {filepath}")

print("\nAll files fixed!")
