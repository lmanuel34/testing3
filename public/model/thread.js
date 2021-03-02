export class Thread {
    constructor(data)
    {
        this.uid = data.uid
        this.email = data.email
        this.title = data.title
        this.timestamp = data.timestamp
        this.content = data.content
        this.keywordsArray = data.keywordsArray
    }

    //store objects of thread into firebase store, but they need to be converted to plain js object
    serialize(){//translates objects to js plain
        return {
            uid: this.uid,
            email: this.email,
            title: this.title,
            timestamp: this.timestamp,
            content: this.content,
            keywordsArray: this.keywordsArray
        }
    }
}