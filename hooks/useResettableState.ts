import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function useResettableState<S>(
  initialState: S,
  resetVariable: any
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    setState(initialState);
  }, [initialState, resetVariable]);

  return [state, setState];
}
