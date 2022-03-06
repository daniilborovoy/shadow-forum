export default (title: string | void): void => {
  if (!title) {
    document.title = 'Shadow Forum';
    return;
  }
  document.title = `${title} | Shadow Forum`;
}
