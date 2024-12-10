import os
import re
import json
from markdown import markdown
import google.generativeai as genai
import yaml

# Set your Gemini API key
genai.configure(api_key= os.environ.get("GEMINI_API_KEY"))

def generate_tags_and_summary_with_gemini(markdown_content):
  """
  Generates tags and a summary from the given markdown content using Gemini.

  Args:
    markdown_content: The markdown content as a string.

  Returns:
    A tuple containing a list of tags and a summary string.
  """

  # Use Gemini for text generation
  model = genai.GenerativeModel("gemini-1.5-pro") 
  response = model.generate_content(
      f"""
      You are a content creator working on a blog post. Analyze the following content: {markdown_content}

      Provide your response in JSON format with the following structure:
      {{
        "summary": "A concise summary of the article as if you were the author of the post",
        "tags": ["list", "of", "relevant", "tags"]
      }}
      """
      , generation_config=genai.GenerationConfig(
        response_mime_type="application/json"
    ),
  )

  # Extract tags and summary from Gemini's response
  # (This will depend on the format of Gemini's output. 
  # You may need to adjust the parsing accordingly.)
  try:
    response_json = json.loads(response.text)

    tags = response_json["tags"]
    summary = response_json["summary"]
  except Exception as e:
    print(f"Error extracting tags and summary: {e}")
    tags = []
    summary = ""

  return tags, summary

def update_frontmatter(filepath, tags, summary):
  """
  Updates the frontmatter of the given markdown file with the given tags and summary.

  Args:
    filepath: The path to the markdown file.
    tags: A list of tags.
    summary: The summary string.
  """

  with open(filepath, 'r') as f:
    content = f.read()

  # Extract frontmatter and content
  frontmatter_match = re.match(r'---\n(.*?)\n---\n(.*)', content, re.DOTALL)
  if not frontmatter_match:
    raise ValueError("Invalid frontmatter format.")
  

  frontmatter = frontmatter_match.group(1)
  content = frontmatter_match.group(2)

  frontmatter_yaml = yaml.safe_load(frontmatter)
  # Remove existing tags and summary (if any)

  summary = summary.replace('\"', '\\\"')

  frontmatter_yaml["summary"] = summary
  frontmatter_yaml["tags"] = tags

  # Write back to file
  with open(filepath, 'w') as f:
    f.write(f"---\n{yaml.dump(frontmatter_yaml)}\n---\n{content}")

def main():
  """
  Main function to process all markdown files in the content directory.
  """

  for root, _, files in os.walk('content'):
    for file in files:
      if file.endswith('.md') or file.endswith('.markdown'):
        filepath = os.path.join(root, file)
        with open(filepath, 'r') as f:
          markdown_content = f.read()

        print(f"Processing {filepath}...")
        tags, summary = generate_tags_and_summary_with_gemini(markdown_content)
        print(f"\tGenerated tags: {tags}")
        print(f"\tGenerated summary: {summary}")
        update_frontmatter(filepath, tags, summary)

if __name__ == "__main__":
  main()