

// ============================================================
// === Hämtar in element ===
// ============================================================

const newBlogInput = document.getElementById('new-blog-input')
const title = document.getElementById('title')
const writer = document.getElementById('writer')
const content = document.getElementById('content')
const postContainer = document.getElementById('post-container')


// ============================================================
// === Funktioner ===
// ============================================================

//Skapa ett nytt inlägg
function createNewPost(event) {
    event.preventDefault()  //stoppar sidan från att laddas (som är default för submit)

    //gör ett objekt för nya inlägg
    const newPost = {            
        id: Date.now(),        //Skapar ett unikt id
        rubrik: title.value,    //Alla "nycklar" i objektet får ett värde och tilldelas en egenskap
        forfattare: writer.value,
        text: content.value,
        tid: new Date().toLocaleString('sv-SE', { hour12: false }), //lägger till tidsstämpel (hour12: false = 24h-format)
        likes: 0,   //likes får startvärde 0
        dislikes: 0,
        comments: []
    }

    savePost(newPost)     //anropar funktionen savePost som sparar inlägget
    renderPost(newPost)   //anropar funktionen renderPost som visar inlägget på sidan

    //Tömmer formuläret
    title.value = ''
    content.value = ''
    writer.value = ''
}


//Hämta sparade inlägg
function getPosts() { //inga parametrar behövs då allt hämtas från localStorage
    const savedPosts = localStorage.getItem("posts") //Hämtar inlägg från localStorage
    return savedPosts ? JSON.parse(savedPosts) : []  //Om det finns sparade inlägg görs de om till en array, annars returneras en tom array
}


//Spara nya inlägg
function savePost(post) {
    let posts = getPosts() //Hämtar in redan sparade inlägg - returnerar en array med inläggsobjekt
    const index = posts.findIndex(p => p.id === post.id) //letar i arrayen efter inlägg med samma id som det inlägg som skickades in
    if (index !== -1) { //om inlägget inte har index -1 betyder det att inlägget finns i localStorage - då vill vi uppdatera det i arrayen
        posts[index] = post //genom att skriva över det gamla inlägget på den platsen i arrayen
    } else {
        posts.push(post)      //Lägger till det som ett nytt inlägg
    }
    localStorage.setItem('posts', JSON.stringify(posts)) //Sparar tillbaka i localStorage  
}

// ============================================================
// === Spara kommentarer ===
// ============================================================

//Hämta alla kommentarer från localStorage
    function getComments() {
        const savedComments = localStorage.getItem('comments')
        return savedComments ? JSON.parse(savedComments) : []
    }

//Spara kommentarer
    function saveComments(comment) {
        const comments = getComments() //Hämtar tidigare sparade kommentarer
        comments.push(comment)         //och lägger till den nya kommentaren
        localStorage.setItem('comments', JSON.stringify(comments)) //som sen sparas i localStorage
    }

// ============================================================
// === Funktion för att visa inlägg ===
// ============================================================


function renderPost(post) {
    const newPostElement = document.createElement('article') //skapar en 'container' för varje blogginlägg
    newPostElement.classList.add('blog-post')
    newPostElement.dataset.id = post.id   //och sparar ett id till varje inlägg

    const commentsContainer = document.createElement('div') //skapar en 'container' för varje kommentar
    commentsContainer.classList.add('comments-container')

    //skapar rubriken för kommentarer
    const titleAllComments = document.createElement('h4')
    titleAllComments.textContent = 'Kommentarer'
    titleAllComments.classList.add('hidden')
    titleAllComments.id = 'title-all-comments'
    titleAllComments.for = 'title-all-comments'
    commentsContainer.appendChild(titleAllComments)
    


    const allComments = getComments() //anropar funktionen getComments för att hämta alla sparade kommentarer
    const postComments = allComments.filter(c => c.postId === post.id) //Använder .filter som går igenom alla element - returnerar ny array med de som uppfyller ett visst villkor)
                                            //c = varje kommentar i allComments 
                                            // c.postId = inläggets Id som kommentaren sparats med 
                 //villkoret betyder - behåll bara de kommentarer som hör till det här inläggets id
         //så när raden körts innehåller postComments bara de kommentarer som hör till det specifika inlägget
    
         //Om det finns kommentarer -  visas kommentarsrubriken
    if (postComments.length > 0) {
        titleAllComments.classList.remove('hidden')
    }
    
    //skickar varje kommentar till renderComments som visar dom på sidan
    postComments.forEach(comment => renderComments(comment, commentsContainer))
        

    //resten av funktionen skapar inläggets element, knappar och händelser

    // ============================================================
    // === Skapar inläggselement ===
    // ============================================================


    const titleElement = document.createElement('h3')
    titleElement.textContent = post.rubrik
    titleElement.style.marginBottom = '0'

    const contentElement = document.createElement('p')
    contentElement.textContent = post.text

    const writerElement = document.createElement('small')
    writerElement.textContent = 'Av: ' + post.forfattare

    const timeElement = document.createElement('small')
    timeElement.textContent = post.tid
    timeElement.classList.add('tid')


    // ============================================================
    // === Skapar knappar ===
    // ============================================================


    const buttonBox = document.createElement('div')
    buttonBox.classList.add('button-box')

    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Radera'
    deleteButton.classList.add('delete-btn') 
    deleteButton.classList.add('button-form')

    const commentButton = document.createElement('button')
    commentButton.textContent = 'Kommentera'
    commentButton.classList.add('comment-btn') 
    commentButton.classList.add('button-form') 

    const likeButton = document.createElement('button') 
    const likeIcon = document.createElement('i')        
    likeIcon.classList.add('fa', 'fa-thumbs-up', 'fa-lg')
    likeButton.classList.add('like-btn')
    likeButton.appendChild(likeIcon)                  

    const likeCount = document.createElement('span')
    likeCount.textContent = post.likes
    likeCount.style.marginLeft = '0.3rem'
    likeButton.appendChild(likeCount)

    const dislikeButton = document.createElement('button')
    const dislikeIcon = document.createElement('i')         
    dislikeIcon.classList.add('fa', 'fa-thumbs-down', 'fa-lg')
    dislikeButton.classList.add('dislike-btn')
    dislikeButton.appendChild(dislikeIcon)                  


    const dislikeCount = document.createElement('span')
    dislikeCount.textContent = post.dislikes
    dislikeCount.style.marginLeft = '0.5rem'
    dislikeButton.appendChild(dislikeCount)

    buttonBox.appendChild(commentButton)
    buttonBox.appendChild(likeButton)
    buttonBox.appendChild(dislikeButton)
    buttonBox.appendChild(deleteButton)

    

    // ============================================================
    // === Skapar element till kommentarsfunktionen ===
    // ============================================================

    commentButton.addEventListener('click', function() {
        if (commentsContainer.querySelector('form'))
            return

        const commentSection = document.createElement('h4')
        commentSection.textContent = 'Fyll i fälten för att lämna en kommentar'

        const nameLabel = document.createElement('label')
        nameLabel.for = 'name-input'
        nameLabel.textContent = 'Namn: '
        nameLabel.id = 'name-label'

        const nameInput = document.createElement('input')
        nameInput.placeholder = 'Namn'   
        nameInput.required = true
        nameInput.style.marginRight = '1rem'
        nameInput.id = 'name-input'

        const commentLabel = document.createElement('label')
        commentLabel.for = 'comment-input'
        commentLabel.textContent = 'Kommentar: '
        commentLabel.id = 'comment-label'

        const commentInput = document.createElement('textarea')
        commentInput.placeholder = 'Kommentar'
        commentInput.required = true
        commentInput.rows = '4'
        commentInput.id = 'comment-input'
        
        const sendButton = document.createElement('button')
        sendButton.textContent = 'Skicka'
        sendButton.type = 'submit'
        sendButton.classList.add('send-comment', 'button-form')

        const resetButton = document.createElement('button')
        resetButton.textContent = 'Ångra'
        resetButton.type = 'reset'
        resetButton.classList.add('reset-comment', ('button-form'))
        resetButton.id = 'resetComment'
        
        const commentForm = document.createElement('form')
        commentForm.id = 'comment-form'
        commentForm.classList.add('comment-form')
        
        commentForm.appendChild(commentSection)
        commentForm.appendChild(nameLabel)
        commentForm.appendChild(nameInput)
        commentForm.appendChild(commentLabel)
        commentForm.appendChild(commentInput)
        commentForm.appendChild(sendButton)
        commentForm.appendChild(resetButton)
        commentsContainer.appendChild(commentForm)
      
        commentForm.addEventListener('submit', function(event) {
            event.preventDefault() //stoppar sidan från att ladda

            titleAllComments.classList.remove('hidden')

            //Skapar ett objekt för nya kommentarer
            const newComment = {            
                id: Date.now(),        //Skapar ett unikt id
                postId: post.id,    //kopplar kommentaren till rätt inlägg 
                text: commentInput.value,
                name: nameInput.value,
                tid: new Date().toLocaleString('sv-SE', { hour12: false })
            }

            saveComments(newComment)
            renderComments(newComment, commentsContainer)

            //Tömmer kommentarsformuläret så att bara kommentaren syns
            commentForm.remove()

        }) 
    })

    // ============================================================
    // === Lägger till allt i newPostElement ===
    // ============================================================

    newPostElement.appendChild(titleElement) 
    newPostElement.appendChild(writerElement)
    newPostElement.appendChild(timeElement)
    newPostElement.appendChild(contentElement)
    newPostElement.appendChild(buttonBox)
    newPostElement.appendChild(commentsContainer)
    
    //Lägger NewPostElement i postContainer = skapar ett nytt blogginlägg
    postContainer.appendChild(newPostElement) 

    // ============================================================
    // === Händelser för knappar ===
    // ============================================================

    deleteButton.addEventListener('click', function() {
        deletePost(post.id, newPostElement)
    })

    let likeOrDislike = null //skapar en variabel för att man inte ska kunna gilla/ogilla flera gånger

    likeButton.addEventListener('click', function() {
        if (likeOrDislike === 'like') 
            return  //return om redan gillat

        if (likeOrDislike === 'dislike') {
            post.dislikes--  //ta bort ogilla om tidigare ogillat
            dislikeCount.textContent = post.dislikes //uppdaterar visning
            //nollställer dislikeknappens 'style'
        dislikeButton.style.color = '';
        dislikeButton.style.border = '';
        dislikeButton.style.boxShadow = '';
        }

        post.likes++  
        likeCount.textContent = post.likes  //uppdaterar visning

        likeButton.style.color = 'green'
        likeButton.style.border = 'solid lightgreen'
        likeButton.style.boxShadow = '0 0.6rem 1.2rem 0 rgba(95, 89, 89, 0.2)'

        likeOrDislike = 'like'
        savePost(post)
    })

    dislikeButton.addEventListener('click', function() {
        if (likeOrDislike === 'dislike') return //redan ogillat -> gör inget 

        if (likeOrDislike === 'like') {
            post.likes-- //ta bort like om tidigare gillat
            likeCount.textContent = post.likes

            likeButton.style.color = '';
            likeButton.style.border = '';
            likeButton.style.boxShadow = '';
        }

        post.dislikes++           //ökar dislike
        dislikeCount.textContent = post.dislikes //uppdaterar visning
        
        dislikeButton.style.color = 'darkred'
        dislikeButton.style.border = 'solid red'
        dislikeButton.style.boxShadow = '0 0.6rem 1.2rem 0 rgba(97, 90, 90, 0.2)'

        likeOrDislike = 'dislike'
        savePost(post)
})
}

// ============================================================
// === Radera inlägg ===
// ============================================================

function deletePost(id, element) {
    let posts = getPosts()
    posts = posts.filter(post => post.id !== id)  //Tar bort det inlägg som matchar id
    localStorage.setItem('posts', JSON.stringify(posts)) //Sparar nya listan utan inlägget
    element.remove() //ta bort DOM-elementet direkt från sidan
}

function deleteComment(id, element) {
    let comments = getComments()
    comments = comments.filter(comment => comment.id !== id) //“Behåll alla inlägg där id inte är lika med det id vi vill ta bort.”
    localStorage.setItem('comments', JSON.stringify(comments)) //sparar tillbaka nya listan utan det raderade inlägget
    element.remove()
}

// ============================================================
// === Visa kommentarer ===
// ============================================================

function renderComments(comment, commentsContainer) {

    const newCommentElement = document.createElement('article')
    newCommentElement.classList.add('comment-post')
    
    const commentText = document.createElement('p')
    commentText.textContent = comment.text

    const commentWriter = document.createElement('small')
    commentWriter.textContent = 'Av: ' + comment.name
    commentWriter.style.marginRight = '1rem'
    commentWriter.classList.add('comment-writer')

    const timeElement = document.createElement('small')
    timeElement.textContent = 'Kommentar skickad: ' + comment.tid

    const deleteCommentButton = document.createElement('button')
    deleteCommentButton.textContent = 'Radera'
    deleteCommentButton.classList.add('delete-btn')
    deleteCommentButton.classList.add('button-form')

    deleteCommentButton.addEventListener('click', function() {
        deleteComment(comment.id, newCommentElement)
    })

    newCommentElement.appendChild(commentText)
    newCommentElement.appendChild(commentWriter)
    newCommentElement.appendChild(timeElement)
    newCommentElement.appendChild(deleteCommentButton)
    commentsContainer.appendChild(newCommentElement)
}

// ============================================================
// === Event Listeners ===
// ============================================================

newBlogInput.addEventListener('submit', createNewPost) //när användaren klickar på submit körs createNewPost

//När sidan laddat klart, hämtas och visas sparade inlägg
window.addEventListener('DOMContentLoaded', function() {  
    const posts = getPosts() //hämta alla sparade inlägg från localStorage
    posts.forEach(post => renderPost(post)) //visa varje inlägg på sidan
})

