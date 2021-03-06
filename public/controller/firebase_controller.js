import * as Constant from '../model/constant.js'
import { Thread } from '../model/thread.js'
import { Message } from '../model/message.js'

export async function signIn(email, password){
    await firebase.auth().signInWithEmailAndPassword(email, password)
}

export async function signOut(){
    await firebase.auth().signOut()
}
/*
export async function addThread(thread){ //for storing documents into firestore
    const ref = await firebase.firestore()
        .collection(Constant.collectionName.THREADS)
        .add(thread.serialize())
    return ref.id //unique doc id generated by Firestor database 
}*/

export async function getThreadlist(){
    let threadList = []
    const snapShot = await firebase.firestore()
        .collection(Constant.collectionName.THREADS)
        .orderBy('timestamp', 'desc')
        .get()
    snapShot.forEach(doc => {
        const t = new Thread(doc.data())
        t.docId = doc.id
        threadList.push(t)
    })
    return threadList
}

export async function getOneThread(threadId){
    const ref = await firebase.firestore().collection(Constant.collectionName.THREADS)
                        .doc(threadId).get()
    if(!ref.exists){
        return null
    }
    const t = new Thread(ref.data())
    t.docId = threadId
    return t
}

export async function addMessage(message){
    const ref = await firebase.firestore().collection(Constant.collectionName.MESSAGES)
                .add(message.serialize())
    return ref.id
}

export async function getMessageList(threadId){
    const snapShot = await firebase.firestore().collection(Constant.collectionName.MESSAGES)
                    .where('threadId', '==', threadId)
                    .orderBy('timestamp')
                    .get()
    const message = []
    snapShot.forEach(doc => {
        const m = new Message(doc.data())
        m.docId = doc.id
        message.push(m)
    })
    return message
}

export async function searchThreads(keywordsArray){
    const threadList = []
    const snapShot = await firebase.firestore().collection(Constant.collectionName.THREADS)
                            .where('keywordsArray', 'array-contains-any', keywordsArray)
                            .orderBy('timestamp', 'desc')
                            .get()
    snapShot.forEach(doc => {
        const t = new Thread(doc.data())
        t.docId = doc.id
        threadList.push(t)
    })
    return threadList
}


export async function signUp(email, password)
{
    await firebase.auth().createUserWithEmailAndPassword(email, password)
}

const cf_deleteThread = firebase.functions().httpsCallable('admin_deleteThread')
export async function deleteThread(id) {
	await cf_deleteThread(id)
}

const cf_deleteMessage = firebase.functions().httpsCallable('admin_deleteMessage')
export async function deleteMessage(id) {
	await cf_deleteMessage(id)
}

const cf_addThread = firebase.functions().httpsCallable('admin_addThread')
export async function addNewThread(thread) {
	return await cf_addThread(thread.serialize())
}