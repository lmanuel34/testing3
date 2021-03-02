import * as Element from '../viewpage/element.js'
import * as FirebaseController from './firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from '../viewpage/util.js' 
import * as Routes from '../controller/routes.js'

export let currentUser

export function addEventListeners(){
    Element.formSignin.addEventListener('submit', async e =>{
        e.preventDefault()
        const email = Element.formSignin.email.value;
        const password = Element.formSignin.password.value;

        const button = Element.formSignin.getElementsByTagName('button')[0]
        const orignalLabel = Util.disableButton(button)

        try{
            await FirebaseController.signIn(email, password)
            //dismiss sign in modal
            $('#'+Constant.iDmodalSigninForm).modal('hide')
        } catch(e)
        {
            if(Constant.DEV()) console.log(e)
            Util.popupInfo('Sign in Error', JSON.stringify(e), Constant.iDmodalSigninForm)
        }
        Util.enableButton(button, orignalLabel)
    });

    Element.menuSignout.addEventListener('click', async () =>{
        try{
            await FirebaseController.signOut()
        }
        catch(e)
        {
         if(Constant.DEV)  console.log(e)
         Util.popupInfo('Sign our error', JSON.stringify(e))
        }
    })

    firebase.auth().onAuthStateChanged(user =>{
        if(user) {
            currentUser = user
            let elements = document.getElementsByClassName('modal-menus-pre-auth')
            for(let i = 0; i <elements.length; i++) elements[i].style.display = 'none'
            elements = document.getElementsByClassName('modal-menus-post-auth')
            for(let i = 0; i <elements.length; i++) elements[i].style.display = 'block'

            //routing for page reloading
            const pathname = window.location.pathname
            const href = window.location.href
            Routes.routing(pathname, href)
        }
        else{
            currentUser = null
            let elements = document.getElementsByClassName('modal-menus-pre-auth')
            for(let i = 0; i <elements.length; i++) elements[i].style.display = 'block'
            elements = document.getElementsByClassName('modal-menus-post-auth')
            for(let i = 0; i <elements.length; i++) elements[i].style.display = 'none'

            history.pushState(null, null, Routes.routePath.HOME)
            Element.mainContent.innerHTML = '<h1>Signed Out</h1>'
        }
    })

    Element.formSignUp.addEventListener('submit', async e=> {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value
        const passworConfirm = e.target.passwordConfirm.value

        //reset error messages on create new account
        const errorTags = document.getElementsByClassName('error-signup')
        for(let i = 0; i <errorTags.length; i++)
        {
            errorTags[i].innerHTML = ''
        }

        let valid = true //input validation
        if(password.length < 6){
            document.getElementById('signup-error-password')
                .innerHTML = 'password must be at least 6 characters'
            valid = false
        }
        if(passworConfirm != password){
            document.getElementById('signup-error-passwordConfirm')
                .innerHTML = 'confirm password does not match'
                valid = false
        }
        if(!valid) return

        try{    
            await FirebaseController.signUp(email, password)
            Util.popupInfo('Account Created', 'You are signed in now', 'modal-create-new-account')
        }catch(e){
            if(Constant.DEV) console.log(e)
            Util.popupInfo('Failed to create an account', JSON.stringify(e), 'modal-create-new-account')
        }
    })
}