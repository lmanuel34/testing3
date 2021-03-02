import * as Element from './element.js'
import * as Util from './util.js'
import * as Auth from '../controller/auth.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Home from './home_page.js'
import * as Routes from '../controller/routes.js'

export function addEventListeners(){
    Element.formSearch.addEventListener('submit', async e => {
        e.preventDefault()
        const button = Element.formSearch.getElementsByTagName('button')[0]
        const label = Util.disableButton(button)
        const keywords = e.target.searchKeywords.value.trim()
        if(keywords.length == 0){
            Util.popupInfo('No search keywords', 'Enter search keywords separated by a space')
            return 
        }
        const keywordsArray = keywords.toLowerCase().match(/\S+/g)
        search_page(keywordsArray)
        //await Util.sleep(1000) //testing code for search button
        Util.enableButton(button, label)
    })
}

export async function search_page(keywordsArray){
    if(!Auth.currentUser)
    {
        Element.mainContent.innerHTML = '<h1>Protected Page<h1>'
        return
    }
    let threadList //not showing what I need vid 28-29
    try{
        //search from firestore
        threadList = await FirebaseController.searchThreads(keywordsArray)
    } catch(e){
        if(Constant.DEV) console.log(e) 
        return 
    }

    Home.buildHomeScreen(threadList)
    if(threadList.length > 0){
        const joinedSearchKeys = keywordsArray.join('+')
        history.pushState(null, null, Routes.routePath.SEARCH + '#' + joinedSearchKeys)
    }
}