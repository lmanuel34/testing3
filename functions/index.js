const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();


//const serviceAccount = require("./account_key.json");

/* admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cmsc4373-hongs-lmanuel.firebaseio.com"
}); */

exports.admin_deleteThread = functions.https.onCall(deleteThread)
exports.admin_deleteMessage = functions.https.onCall(deleteMessage)
exports.admin_addThread = functions.https.onCall(addThread)

function deleteThread(id, context) {

  try{
  console.log('hello world');
  return admin.firestore().collection('threads').doc(id)
  .delete()
  .then(response => {
  console.log('deleted');
  //return Promise.resolve();
  })
  .catch(err => {
  console.log('error',err);
  //return Promise.reject(err);
  });
  }
  catch(e){
  throw new functions.https.HttpsError('internal error', e);
  }
  }

  function deleteMessage(id, context) {

    try{
    return admin.firestore().collection('messages').doc(id)
    .delete()
    .then(response => {
    console.log('deleted');
    //return Promise.resolve();
    })
    .catch(err => {
    console.log('error',err);
    //return Promise.reject(err);
    });
    }
    catch(e){
    throw new functions.https.HttpsError('internal error', e);
    }
    }

    function addThread(thread, context) {

      try{
      return admin.firestore().collection('threads')
      .add(thread)

      }
      catch(e){
      throw new functions.https.HttpsError('internal error', e);
      }
      }

        
 /*   try{
     functions.firestore
    .collection('threads')
    .doc(id)
    .delete()
    .then(() => {
       
        console.log("thread successfully deleted!");
    
        }).catch((error) => {
            

        console.error("Error removing thread: ", error);
        });
    }
    catch (e){
        throw new functions.https.HttpsError('internal',e)
    }*/
    
