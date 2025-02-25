export const getLocalStorage = (name: 'exercises' | 'categories') => {
  const localData = localStorage.getItem(name === 'exercises' ? 'listExercises' : 'listCategories');
  return JSON.parse(localData as string);
};

// An unused function due to the switch to the IndexedDB
export const setLocalStorage = (name: 'exercises' | 'categories', data: Record<string, any>[]) => {
  const stringifyData = JSON.stringify(data);
  const currentList = name === 'exercises' ? 'listExercises' : 'listCategories';

  localStorage.setItem(currentList, stringifyData);
};
