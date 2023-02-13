"use client";

import { createContext, Dispatch, useContext, useReducer } from "react";

type State = { dietary: string[]; neighborhoods: string[] };
type Action = { type: "dietary" | "neighborhoods"; value: string | null };

const FilterContext = createContext<[State, Dispatch<Action>]>([
  { dietary: [], neighborhoods: [] },
  () => null,
]);

export const useFilter = () => useContext(FilterContext);

const initialState = Object.freeze({ dietary: [], neighborhoods: [] });

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "dietary":
      if (action.value === null) {
        return { ...state, dietary: [] };
      } else if (state.dietary.includes(action.value)) {
        const dietary = state.dietary.filter(
          option => action.value?.toLowerCase() !== option.toLowerCase()
        );
        return { ...state, dietary: [...dietary] };
      } else {
        return {
          ...state,
          dietary: [...state.dietary, action.value.toLowerCase()],
        };
      }

    case "neighborhoods":
      if (action.value === null) {
        return { ...state, neighborhoods: [] };
      } else if (state.neighborhoods.includes(action.value)) {
        const neighborhoods = state.neighborhoods.filter(
          option => action.value?.toLowerCase() !== option.toLowerCase()
        );
        return { ...state, neighborhoods: [...neighborhoods] };
      } else {
        return {
          ...state,
          neighborhoods: [...state.neighborhoods, action.value.toLowerCase()],
        };
      }

    default:
      throw new Error();
  }
}

export default function FilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FilterContext.Provider value={[state, dispatch]}>
      {children}
    </FilterContext.Provider>
  );
}
