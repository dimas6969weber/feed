const postContainer = document.querySelector("#postsContainer")
const loadMoreBtn = document.querySelector("#loadMoreBtn")
const search = document.querySelector("#search")
const message = document.querySelector("#message")
let page = 1
let limit = 10
let searchInput = ""
let timer

async function loadPosts() {
    message.textContent = "Загрузка..."

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}&q=${searchInput}`)
        const posts = await response.json()

        if (posts.length === 0 && page === 1) {
            message.textContent = "Ничего не найдено"
            loadMoreBtn.classList.add("hidden")
            return
        }

        if (posts.length < limit) {
            loadMoreBtn.classList.add("hidden")
        }

        posts.forEach(post => {
            const div = document.createElement("div")
            div.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>`

            postContainer.appendChild(div)
        });

        message.textContent = ""
 

    } catch(error) {
        message.textContent = "Что-то пошло не так..."
        loadMoreBtn.classList.add("hidden")
    }
}

loadPosts()

loadMoreBtn.addEventListener("click", ()=>{
    page++
    loadPosts()
})

search.addEventListener("input", function(text){
    clearTimeout(timer)
    
    timer = setTimeout(() =>{
        searchInput = text.target.value
        page = 1
        postContainer.innerHTML = ""
        loadMoreBtn.classList.remove("hidden") 

        loadPosts()
    }, 300)
})

const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            page ++
            loadPosts();
        }
    });
}, {root: null});

observer.observe(loadMoreBtn);