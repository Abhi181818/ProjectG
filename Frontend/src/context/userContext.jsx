import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { auth } from '../firebase'; // Adjust the path as necessary
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc ,setDoc} from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firestore instance

const UserContext = createContext();

const initialState = {
  user: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'CLEAR_USER':
      return { ...state, user: null };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          dispatch({ type: 'SET_USER', payload: { ...userDoc.data(), uid: user.uid } });
        } else {
          dispatch({ type: 'CLEAR_USER' });
        }
      } else {
        dispatch({ type: 'CLEAR_USER' });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
