/*
  # Update prompts table schema

  1. Changes
    - Make title column nullable
    - Add default title generation
    - Add trigger to auto-generate titles
*/

-- Make title column nullable
ALTER TABLE prompts ALTER COLUMN title DROP NOT NULL;

-- Create function to generate prompt title
CREATE OR REPLACE FUNCTION generate_prompt_title()
RETURNS TRIGGER AS $$
BEGIN
  -- If no title is provided, generate one from content
  IF NEW.title IS NULL THEN
    NEW.title = SUBSTRING(
      REGEXP_REPLACE(NEW.content, E'[\\n\\r]+', ' ', 'g'),  -- Replace newlines with spaces
      1, 50  -- Take first 50 characters
    ) || '...';  -- Add ellipsis
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate titles
DROP TRIGGER IF EXISTS set_prompt_title ON prompts;
CREATE TRIGGER set_prompt_title
  BEFORE INSERT ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION generate_prompt_title();