export const getLocalStorage = (name: 'exercises' | 'categories') => {
  const localData = localStorage.getItem(name === 'exercises' ? 'listExercises' : 'listCategories');
  return JSON.parse(localData as string);
};
