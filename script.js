let input = document.getElementById('input');
let previewContainer = document.getElementById('previewContainer');
const themeButton = document.getElementById('themeBtn');
const copyButton = document.getElementById('copyBtn');
const clearButton = document.getElementById('clearBtn');
const formatButtons = document.querySelectorAll('.format-btn');

// Configure Marked options for GitHub Flavored Markdown
marked.setOptions({
  breaks: true,      
  gfm: true,         
  headerIds: true,   
  smartLists: true   
});

// Function to render markdown
function renderMarkdown() {
  const html = marked.parse(input.value);
  previewContainer.innerHTML = html;
  
  // Save to local storage
  localStorage.setItem('markdownContent', input.value);
}

// Function to copy markdown content
function copyMarkdown() {
  input.select();
  document.execCommand('copy');
  
  // Visual feedback
  copyButton.textContent = 'Copied!';
  setTimeout(() => {
    copyButton.textContent = 'Copy';
  }, 2000);
}

// Function to clear markdown content
function clearMarkdown() {
  if (confirm('Are you sure you want to clear all content?')) {
    input.value = '';
    renderMarkdown();
  }
}

// Function to load content from local storage
function loadSavedContent() {
  const savedContent = localStorage.getItem('markdownContent');
  
  if (savedContent) {
    input.value = savedContent;
    renderMarkdown();
  } else {
    loadDefaultContent();
  }
}

// Add some default content when page loads
function loadDefaultContent() {
  // Only load default if textarea is empty
  if (!input.value) {
    input.value = `# H1

## H2
### H3
#### H4
##### H5
###### H6
## Basic Formatting
**Bold text** is created with double asterisks or double underscores.
Italic text is created with single asterisks or single underscores.
***Bold and italic*** can be combined.
~~Strikethrough~~ text uses two tildes.
## Lists
### Unordered Lists
* Item 1
* Item 2
  * Nested item 2.1
  * Nested item 2.2
* Item 3
### Ordered Lists
1. First item
2. Second item
   1. Nested item 2.1
   2. Nested item 2.2
3. Third item
### Task Lists
- [x] Completed task
- [ ] Incomplete task
- [ ] Check out more Markdown options`;
    renderMarkdown();
  }
}

// Function to handle formatting
function formatText(format) {
  // Save current selection position
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const selectedText = input.value.substring(start, end);
  const beforeText = input.value.substring(0, start);
  const afterText = input.value.substring(end);
  
  let formattedText;
  let cursorPosition;
  
  switch(format) {
    case 'h1':
      formattedText = `# ${selectedText || 'Heading 1'}`;
      cursorPosition = selectedText ? start + formattedText.length : start + 2;
      break;
    case 'h2':
      formattedText = `## ${selectedText || 'Heading 2'}`;
      cursorPosition = selectedText ? start + formattedText.length : start + 3;
      break;
    case 'h3':
      formattedText = `### ${selectedText || 'Heading 3'}`;
      cursorPosition = selectedText ? start + formattedText.length : start + 4;
      break;
    case 'bold':
      formattedText = `**${selectedText || 'bold text'}**`;
      cursorPosition = selectedText ? start + formattedText.length : start + 2;
      break;
    case 'italic':
      formattedText = `*${selectedText || 'italic text'}*`;
      cursorPosition = selectedText ? start + formattedText.length : start + 1;
      break;
    case 'strike':
      formattedText = `~~${selectedText || 'strikethrough text'}~~`;
      cursorPosition = selectedText ? start + formattedText.length : start + 2;
      break;
    case 'ul':
      if (selectedText) {
        // Format each line with a bullet
        formattedText = selectedText
          .split('\n')
          .map(line => line ? `* ${line}` : line)
          .join('\n');
      } else {
        formattedText = '* List item';
      }
      cursorPosition = selectedText ? start + formattedText.length : start + formattedText.length;
      break;
    case 'ol':
      if (selectedText) {
        // Format each line with a number
        formattedText = selectedText
          .split('\n')
          .map((line, index) => line ? `${index + 1}. ${line}` : line)
          .join('\n');
      } else {
        formattedText = '1. List item';
      }
      cursorPosition = selectedText ? start + formattedText.length : start + formattedText.length;
      break;
    case 'task':
      if (selectedText) {
        // Format each line as a task
        formattedText = selectedText
          .split('\n')
          .map(line => line ? `- [ ] ${line}` : line)
          .join('\n');
      } else {
        formattedText = '- [ ] Task item';
      }
      cursorPosition = selectedText ? start + formattedText.length : start + formattedText.length;
      break;
    case 'link':
      if (selectedText) {
        formattedText = `[${selectedText}](url)`;
        cursorPosition = start + selectedText.length + 3; 
      } else {
        formattedText = '[link text](url)';
        cursorPosition = start + 1; 
      }
      break;
    case 'image':
      formattedText = `![${selectedText || 'alt text'}](image-url)`;
      cursorPosition = selectedText ? start + selectedText.length + 4 : start + 2;
      break;
    case 'code':
      if (selectedText.includes('\n')) {
        // Multi-line code block
        formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
        cursorPosition = start + formattedText.length;
      } else {
        // Inline code
        formattedText = `\`${selectedText || 'code'}\``;
        cursorPosition = selectedText ? start + formattedText.length : start + 1;
      }
      break;
    case 'quote':
      if (selectedText) {
        // Format each line as a blockquote
        formattedText = selectedText
          .split('\n')
          .map(line => line ? `> ${line}` : line)
          .join('\n');
      } else {
        formattedText = '> Blockquote';
      }
      cursorPosition = selectedText ? start + formattedText.length : start + formattedText.length;
      break;
    case 'hr':
      formattedText = `\n---\n`;
      cursorPosition = start + formattedText.length;
      break;
    default:
      formattedText = selectedText;
      cursorPosition = end;
  }
  
  // Insert formatted text
  input.value = beforeText + formattedText + afterText;
  
  // Set cursor position
  input.focus();
  input.setSelectionRange(selectedText ? start : cursorPosition, selectedText ? start + formattedText.length : cursorPosition);
  
  // Update preview
  renderMarkdown();
}

// Event listeners
input.addEventListener('input', renderMarkdown);

themeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  // Save theme preference
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
});

copyButton.addEventListener('click', copyMarkdown);
clearButton.addEventListener('click', clearMarkdown);

// Add event listeners for all formatting buttons
formatButtons.forEach(button => {
  button.addEventListener('click', () => {
    formatText(button.getAttribute('data-format'));
  });
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  // Load saved theme
  const savedTheme = localStorage.getItem('darkMode');
  if (savedTheme === 'false') {
    document.body.classList.remove('dark-mode');
  }
  
  // Load saved content or default
  loadSavedContent();
});