import os
import yaml
import subprocess
from pathlib import Path

def get_previous_yaml_title(file_path):
    """Gets the title from YAML frontmatter in the previous commit"""
    cmd = f'git log -p --format= {file_path} | grep "^+title:"'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.stdout:
        # Extract first title from git history
        title_line = result.stdout.split('\n')[0]
        # Remove the +title: and any quotes
        title = title_line.replace('+title:', '').strip().strip('"\'')
        return title
    return None

def update_post_title(file_path):
    """Updates a post's title from git history if missing"""
    with open(file_path) as f:
        content = f.read()
        
    # Parse YAML frontmatter
    if content.startswith('---'):
        _, frontmatter, *rest = content.split('---', 2)
        try:
            meta = yaml.safe_load(frontmatter)
            
            # Check if title is missing
            if not meta.get('title'):
                # Get title from previous commit's YAML
                title = get_previous_yaml_title(file_path)
                if title:
                    meta['title'] = title
                    
                    # Update the file
                    new_content = '---\n' + yaml.dump(meta) + '---\n' + ''.join(rest)
                    with open(file_path, 'w') as f:
                        f.write(new_content)
                    print(f"Updated title for {file_path}")
            
        except yaml.YAMLError as e:
            print(f"YAML parsing error in {file_path}: {e}")

# Find all markdown files in content directory
content_dir = Path('content')
for post in content_dir.rglob('*.md'):
    update_post_title(post)