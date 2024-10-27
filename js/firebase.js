// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
// import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  //   onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { startSpinner, stopSpinner } from "./spinner.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqFIztllCywtyayvkJ3TRk3x-V-9sOFRY",
  authDomain: "registartion-b7c54.firebaseapp.com",
  projectId: "registartion-b7c54",
  storageBucket: "registartion-b7c54.appspot.com",
  messagingSenderId: "536397444673",
  appId: "1:536397444673:web:78a9f1759a6737e5ad38c0",
  measurementId: "G-13HSV95KR3",
};
Object.freeze(firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const form = document.querySelector(".form-signin");
const newUser = document.querySelector(".sign");
const user = document.querySelector(".login");
const logOut = document.querySelector(".logout");
const errorMessage = document.querySelector(".errorMessage");
const googleRegistration = document.querySelector(".googleAuth");
const facebookRegistration = document.querySelector(".facebookAuth");

let userID = "";

const showLoginError = (error) => {
  if (error.code == "auth/wrong-password") {
    errorMessage.innerHTML = "Wrong password. Try again.";
  } else if (error.code == "auth/invalid-email") {
    errorMessage.innerHTML = "Wrong email. Try again.";
  } else {
    errorMessage.innerHTML = `Error: ${error.message}`;
  }
};

const createNewUser = async () => {
  const loginEmail = document.querySelector(".form-control-mail").value;
  const loginPassword = document.querySelector(".form-control-password").value;
  try {
    startSpinner();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword
    );
    console.log("userCredential", userCredential.user.uid);
    userID = userCredential.user.uid;
    localStorage.setItem("userID", userID);
    localStorage.setItem("statusUser", "identificationUser");
  } catch (error) {
    showLoginError(error);
  } finally {
    form.reset();
    stopSpinner();
  }
};
if (newUser) {
  const registreteNewUser = newUser.addEventListener("click", (e) => {
    e.preventDefault();
    createNewUser();
  });
}

const loginEmailPassword = async () => {
  const loginEmail = document.querySelector(".form-control-mail").value;
  const loginPassword = document.querySelector(".form-control-password").value;
  try {
    startSpinner();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword
    );
    userID = userCredential.user.uid;
    localStorage.setItem("userID", userID);
    localStorage.setItem("statusUser", "identificationUser");
  } catch (error) {
    showLoginError(error);
  } finally {
    form.reset();
    stopSpinner();
  }
};

if (user) {
  const loginUser = user.addEventListener("click", (e) => {
    e.preventDefault();
    loginEmailPassword();
  });
}

const logout = async () => {
  userID = "";
  localStorage.setItem("userID", "");
  localStorage.setItem("statusUser", "anonym");
  await signOut(auth);
};
if (logOut) {
  const logOutUser = logOut.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });
}

const provider = new GoogleAuthProvider();
const googleAuth = async () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result);
      userID = user.uid;
      localStorage.setItem("userID", userID);
      localStorage.setItem("statusUser", "identificationUser");
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
};
if (googleRegistration) {
  const googleRegistrationUser = googleRegistration.addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      googleAuth();
    }
  );
}

const providerF = new FacebookAuthProvider();
const faceBookAuth = async () => {
  signInWithPopup(auth, providerF)
    .then((result) => {
      // The signed-in user info.
      const user = result.user;
      console.log("user", user);
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      console.log("accessToken", accessToken);

      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);

      // ...
    });
};
if (facebookRegistration) {
  const facebookRegistrationUser = facebookRegistration.addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      faceBookAuth();
    }
  );
}
