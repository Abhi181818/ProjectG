import { doc, setDoc,getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const saveUserDetails = async (userId, userDetails) => {
  try {
    await setDoc(doc(db, "users", userId), userDetails);
    console.log("User details saved successfully!");
  } catch (error) {
    console.error("Error saving user details:", error);
  }
};
export const getUserDetails = async (userId) => {
    const userDoc = doc(db, "users", userId);
    const userSnap = await getDoc(userDoc);
    // console.log(userSnap);
  
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  };
  