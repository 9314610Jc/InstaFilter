import { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import FirebaseContext from '../context/firebase';
import * as ROUTES from '../constants/routes';
import { doesUsernameExist } from '../services/firebase';

export default function SignUp() {
    const history = useHistory();
    const { firebase } = useContext(FirebaseContext);
  
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
  
    const [error, setError] = useState('');
    const isInvalid = password === '' || emailAddress === '';
  
    const handleSignUp = async (event) => {
        event.preventDefault();
    
        const usernameExists = await doesUsernameExist(username);
        if (!usernameExists) {
          try {
            const createdUserResult = await firebase
              .auth()
              .createUserWithEmailAndPassword(emailAddress, password);
    
            // authentication
            // -> emailAddress & password & username (displayName)
            await createdUserResult.user.updateProfile({
              displayName: username
            });
    
            // firebase user collection (create a document)
            await firebase
              .firestore()
              .collection('users')
              .add({
                userId: createdUserResult.user.uid,
                username: username.toLowerCase(),
                fullName,
                emailAddress: emailAddress.toLowerCase(),
                following: ['2'],
                followers: [],
                dateCreated: Date.now()
              });
    
            history.push(ROUTES.DASHBOARD);
          } catch (error) {
            setFullName('');
            setEmailAddress('');
            setPassword('');
            setError(error.message);
          }
        } else {
          setUsername('');
          setError('That username is already taken, please try another.');
        }
      };