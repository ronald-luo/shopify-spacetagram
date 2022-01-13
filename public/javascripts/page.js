const generateImage = async function () {
    let query = document.querySelector(".container").getAttribute('date')
    let data;

    try {
        let url = `https://api.nasa.gov/planetary/apod?api_key=zaW2O0naX5zkmwqnAWlAG0akApbQgSZk3ad6anOn&date=${query}`
        let response = await fetch(url, { mode: 'cors' })
        data = await response.json()
    } catch (error) {
        console.log(error)
    }
    return data
}

generateImage()
.then((data) => {
    // Set DOM title to image title
    document.title = data.title

    // render a card
    const container = document.querySelector('.container')
    let card = document.createElement('article')
    card.setAttribute("class", "image-card")

    // Restore abbreviated date for better accessibility
    const getDate = function () {
        let months = {
            'Jan': 'January',
            'Feb': 'February',
            'Mar': 'March',
            'Apr': 'April',
            'May': 'May',
            'Jun': 'June',
            'Jul': 'July',
            'Aug': 'August',
            'Sep': 'September',
            'Oct': 'October',
            'Nov': 'November',
            'Dec': 'December',
        }

        let temp = new Date(data.date).toString().split(' ').slice(1,4)
        temp[0] = months[temp[0]]
        return temp.join(' ')
    }

    if (data.hdurl === undefined) {
        card.innerHTML = 
            `
                <figure>
                    <iframe width="560" height="315" src="${data.url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <figcaption>
                        <h2>${data.title}</h2>
                        <h3>${getDate()}</h3>
                        <p>${data.explanation}</p>
                    </figcaption>
                    <div class="like-grid">
                        <button data-id="${data.date}" liked="0" class="like-btn" tabindex="0">like</button>
                        <button data-id="${data.date}" class="share-btn" tabindex="0">share</button>
                    </div>

                    
                </figure>

            `
    } else {
        card.innerHTML = 
            `
            <figure>
                <a href="/${data.date}"><img src="${data.hdurl}" alt="${data.title}"></a>
                <figcaption>
                    <h2>${data.title}</h2>
                    <h3>${getDate()}</h3>
                    <p>${data.explanation}</p>
                    <div class="like-grid">
                    <button data-id="${data.date}" liked="0" class="like-btn" tabindex="0">like</button>
                    <button data-id="${data.date}" class="share-btn" tabindex="0">share</button>
                    </div>
                </figcaption>

                
            </figure>
            `
    }
    container.appendChild(card)
})
.then(() => {

    // like a picture
    const likePicture = (() => {
        let likebtns = document.querySelectorAll('.like-btn')


        likebtns.forEach(btn => {

            const date = btn.getAttribute('data-id')

            // update state according to localstorage
            if (date in localStorage) {
                btn.classList.add('liked-btn')
                btn.setAttribute('liked', 1)
            } else {
                btn.classList.remove('liked-btn')
                btn.setAttribute('liked', 0)
            }

            btn.addEventListener('click', () => {
                // set liked attribute to 1
                if (btn.getAttribute('liked') == 0) {
                    btn.setAttribute('liked', 1)

                    // add item to localStorage
                    localStorage.setItem(date, date)
                    // console.log(localStorage.getItem(date));

                    btn.classList.add('liked-btn')
                } else {
                    btn.setAttribute('liked', 0)

                    // remove item from localStorage
                    localStorage.removeItem(date)
                    // console.log(localStorage.getItem(date));

                    btn.classList.remove('liked-btn')
                }
    
            })
        })
    })()

    // share a picture
    const sharePicture = (() => {
        let sharebtns = document.querySelectorAll('.share-btn')

        sharebtns.forEach(btn => {
            btn.addEventListener('click', () => {

                // console.log('sharing')
    
                // get URL of card
                let url = window.location.href
                navigator.clipboard.writeText(url);
    
                
                // alert("Copied the text: " + url);
    
                const alertCopied = document.createElement('div')
                alertCopied.classList.add('alert')
                alertCopied.textContent = "Copied to clipboard: " + url
                document.body.appendChild(alertCopied)
    
                setTimeout(() => {
                    document.body.removeChild(alertCopied)
                }, 5000)
    
            })
        })
    })()

})