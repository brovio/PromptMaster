interface PreviewSection {
  title: string;
  content: string;
}

export function parsePreviewSections(content: string): PreviewSection[] {
  const sections: PreviewSection[] = [];
  const lines = content.split('\n');
  
  let currentTitle = '';
  let currentContent = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for section titles (ends with colon)
    if (line.endsWith(':') && !line.includes(' ')) {
      // Save previous section if exists
      if (currentTitle && currentContent.trim()) {
        sections.push({
          title: currentTitle,
          content: currentContent.trim()
        });
      }
      
      // Start new section
      currentTitle = line.slice(0, -1); // Remove colon
      currentContent = '';
    } else if (line.match(/^[A-Za-z\s]+:$/)) {
      // Handle titles with spaces (e.g., "Improved Prompt:")
      if (currentTitle && currentContent.trim()) {
        sections.push({
          title: currentTitle,
          content: currentContent.trim()
        });
      }
      currentTitle = line.slice(0, -1);
      currentContent = '';
    } else {
      currentContent += line + '\n';
    }
  }
  
  // Add final section
  if (currentTitle && currentContent.trim()) {
    sections.push({
      title: currentTitle,
      content: currentContent.trim()
    });
  }
  
  return sections;
}