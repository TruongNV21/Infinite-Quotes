const quotesList = document.querySelector('.quotes'),
    loader = document.querySelector('.loader'),
    body = document.querySelector('body');

let currentPage = 1;
let limit = 10;
let total = 0;

const getQuotes = async (page, limit)=>{
    const api = `https://api.javascripttutorial.net/v1/quotes/?page=${page}&limit=${limit}`;
    const res = await fetch(api)

    if(!res){
        throw new Error(`An error occurred: ${response.status}`);
    }
    return await res.json();
}

const hasMoreQuotes = (page, limit, total)=>{
    const startIndex = (page -1) * limit + 1;
    return total === 0 || startIndex < total;
}

const showLoader = ()=>{
    loader.classList.add('show')
}

const hideLoader = ()=>{
    loader.classList.remove('show')
}

const showQuotes = (quotes)=>{
    quotes.forEach((quote)=>{
        const quoteItem = document.createElement('blockquote')
        quoteItem.classList.add('.quote');

        quoteItem.innerHTML = `
        <span>${quote.id}. </span>
        ${quote.quote}
        <footer>${quote.author}</footer>
        `
        quotesList.appendChild(quoteItem)
    }
)}

const loadQuotes = async (page, limit)=>{
    showLoader();

    setTimeout(async ()=>{
        try {
            if(hasMoreQuotes(page,limit,total)){
                const res = await getQuotes(page, limit);
                showQuotes(res.data);
                total = res.total;
            }
        }
    
        catch(error){
            console.log(error)
        }
        finally{
            hideLoader();
        }
    },500)
}
const debounce = (fn, delay=1000) => {
    let timeoutId;

    return (...args) => {
        // cancel the previous timer
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // Nếu tồn đang trong thời gian delay thì sẽ clear hàm setTimeOut()
        timeoutId = setTimeout(() => {
            fn.apply(null, args);///đây là chỗ callback function này
        }, delay);
    };
};

const handleLoad = debounce((loadAble)=>{
    if(loadAble){
        currentPage++;
        loadQuotes(currentPage,limit);
        console.log('Loading')
    }
})

window.addEventListener('scroll',(event)=>{
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        scrolled = window.scrollY;
    let loadAble = Math.ceil(scrolled) > scrollable - 5  && hasMoreQuotes(currentPage, limit, total);
    handleLoad(loadAble);
},{
    passive: true
})

loadQuotes();
