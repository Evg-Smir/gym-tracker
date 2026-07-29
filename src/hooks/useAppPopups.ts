import { useReducer } from 'react';

interface AppPopupsState {
  menuIsOpen: boolean;
  statIsOpen: boolean;
  profileIsOpen: boolean;
  actionSetId: number | null;
}

type AppPopupsAction =
  | { type: 'TOGGLE_MENU' }
  | { type: 'TOGGLE_STATS' }
  | { type: 'TOGGLE_PROFILE' }
  | { type: 'SET_ACTION_SET'; payload: number }
  | { type: 'UNSET_ACTION_SET' };

const initialState: AppPopupsState = {
  menuIsOpen: false,
  statIsOpen: false,
  profileIsOpen: false,
  actionSetId: null,
};

const reducer = (state: AppPopupsState, action: AppPopupsAction): AppPopupsState => {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return { ...state, menuIsOpen: !state.menuIsOpen };
    case 'TOGGLE_STATS':
      return { ...state, statIsOpen: !state.statIsOpen };
    case 'TOGGLE_PROFILE':
      return { ...state, profileIsOpen: !state.profileIsOpen };
    case 'SET_ACTION_SET':
      return { ...state, actionSetId: action.payload };
    case 'UNSET_ACTION_SET':
      return { ...state, actionSetId: null };
    default:
      return state;
  }
};

export const useAppPopups = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    state,
    toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
    toggleStats: () => dispatch({ type: 'TOGGLE_STATS' }),
    toggleProfile: () => dispatch({ type: 'TOGGLE_PROFILE' }),
    setActionSetId: (id: number) => dispatch({ type: 'SET_ACTION_SET', payload: id }),
    unsetActionSet: () => dispatch({ type: 'UNSET_ACTION_SET' }),
  };
};
