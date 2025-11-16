export const downloadToFile = (filename: string, content: string) => {
  const fileContent = content || '';
  const blob = new Blob([fileContent], { type: 'file' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename || 'note'}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
