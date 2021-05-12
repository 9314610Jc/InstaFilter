import { firebase, FieldValue } from '../lib/firebase';

export async function doesUsernameExist(username) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .get();

  return result.docs.length > 0;
}


// get user from the firestore where userId === userId (passed from the auth)
export async function getUserByUserId(userId) {
    const result = await firebase.firestore().collection('users').where('userId', '==', userId).get();
    const user = result.docs.map((item) => ({
      ...item.data(),
      docId: item.id
    }));
  
    return user;
  }


  export async function getUserByUsername(username) {
    const result = await firebase
      .firestore()
      .collection('users')
      .where('username', '==', username)
      .get();
  
    return result.docs.map((item) => ({
      ...item.data(),
      docId: item.id
    }));
  }

  export async function getSuggestedProfiles(userId, following) {
    let query = firebase.firestore().collection('users');
  
    if (following.length > 0) {
      query = query.where('userId', 'not-in', [...following, userId]);
    } else {
      query = query.where('userId', '!=', userId);
    }
    const result = await query.limit(10).get();
  
    const profiles = result.docs.map((user) => ({
      ...user.data(),
      docId: user.id
    }));
  
    return profiles;
  }

  export async function updateLoggedInUserFollowing(
    loggedInUserDocId, // currently logged in user document id 
    profileId, // the user that loggedin requests to follow
    isFollowingProfile // true/false (am i currently following this person?)
  ) {
    return firebase
      .firestore()
      .collection('users')
      .doc(loggedInUserDocId)
      .update({
        following: isFollowingProfile
          ? FieldValue.arrayRemove(profileId)
          : FieldValue.arrayUnion(profileId)
      });
  }
  
  export async function updateFollowedUserFollowers(
    profileDocId, // currently logged in user document id 
    loggedInUserDocId, // the user that loggedin requests to follow
    isFollowingProfile // true/false (am i currently following this person?)
  ) {
    return firebase
      .firestore()
      .collection('users')
      .doc(profileDocId)
      .update({
        followers: isFollowingProfile
          ? FieldValue.arrayRemove(loggedInUserDocId)
          : FieldValue.arrayUnion(loggedInUserDocId)
      });
  }

  export async function getPhotos(userId, following) {
    // [5,4,2] => following
    const result = await firebase
      .firestore()
      .collection('photos')
      .where('userId', 'in', following)
      .get();
  
    const userFollowedPhotos = result.docs.map((photo) => ({
      ...photo.data(),
      docId: photo.id
    }));
  
    const photosWithUserDetails = await Promise.all(
      userFollowedPhotos.map(async (photo) => {
        let userLikedPhoto = false;
        if (photo.likes.includes(userId)) {
          userLikedPhoto = true;
        }
        // photo.userId = 2
        const user = await getUserByUserId(photo.userId);
      
        const { username } = user[0];
        return { username, ...photo, userLikedPhoto };
      })
    );
  
    return photosWithUserDetails;
  }

  export async function getUserPhotosByUserId(userId) {
    const result = await firebase
      .firestore()
      .collection('photos')
      .where('userId', '==', userId)
      .get();
  
    const photos = result.docs.map((photo) => ({
      ...photo.data(),
      docId: photo.id
    }));
    return photos;
  }

  export async function isUserFollowingProfile(loggedInUserUsername, profileUserId) {
    const result = await firebase
      .firestore()
      .collection('users')
      .where('username', '==', loggedInUserUsername) // user1 (active logged in user)
      .where('following', 'array-contains', profileUserId)
      .get();
  
    const [response = {}] = result.docs.map((item) => ({
      ...item.data(),
      docId: item.id
    }));
  
    return response.userId;
  }
  
  export async function toggleFollow(
    isFollowingProfile,
    activeUserDocId,
    profileDocId,
    profileUserId,
    followingUserId
  ) {
    // 1st param: user 1's doc id
    // 2nd param: user 2's user id
    // 3rd param: is the user following this profile? e.g. does user1 follow user2? (true/false)
    await updateLoggedInUserFollowing(activeUserDocId, profileUserId, isFollowingProfile);
  
    // 1st param: user1's user id
    // 2nd param: user2's doc id
    // 3rd param: is the user following this profile? e.g. does user1 follow user2? (true/false)
    await updateFollowedUserFollowers(profileDocId, followingUserId, isFollowingProfile);
  }