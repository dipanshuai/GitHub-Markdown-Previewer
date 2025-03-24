let input = document.getElementById('input');
let previewContainer = document.getElementById('previewContainer');
const themeButton = document.querySelector('button');
// Configure Marked options for GitHub Flavored Markdown
marked.setOptions({
    breaks: true,      // Add <br> on single line breaks
    gfm: true,         // GitHub Flavored Markdown
    headerIds: true,   // Add IDs to headers
    smartLists: true   // Use smarter list behavior
  });
  
  // Function to render markdown
  function renderMarkdown() {
    const html = marked.parse(input.value);
    previewContainer.innerHTML = html;
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
\`Strikethrough\` text uses two tildes.
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
  // Event listeners
input.addEventListener('input', renderMarkdown);
themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Initialize
window.addEventListener('DOMContentLoaded', loadDefaultContent);


