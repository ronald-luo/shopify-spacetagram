// Uses current date to create start_date and end_date.
// return an array date_range, in the following format: [start_date, end_date]; date = YYYY-MM-DD.

const getDateRange = function () {
    let monthsNums = {
        'Jan': '01',
        'Feb': '02',
        'Mar': '03',
        'Apr': '04',
        'May': '05',
        'Jun': '06',
        'Jul': '07',
        'Aug': '08',
        'Sep': '09',
        'Oct': '10',
        'Nov': '11',
        'Dec': '12',
    }

    let start_date = (new Date(new Date() - 1728000000).toString().split(' '))
    let end_date = (new Date().toString().split(' '))

    return [String(([start_date[3], monthsNums[start_date[1]], start_date[2]].join('-'))), String(([end_date[3], monthsNums[end_date[1]], end_date[2]].join('-')))]
}

//
const generateImage = async function () {
    let data;
    try {
        let url = `https://api.nasa.gov/planetary/apod?api_key=zaW2O0naX5zkmwqnAWlAG0akApbQgSZk3ad6anOn&start_date=${getDateRange()[0]}&end_date=${getDateRange()[1]}`
        let response = await fetch(url, { mode: 'cors' })
        data = await response.json()
    } catch (error) {
        console.log(error)
    }
    return data
}

generateImage()
.then((data) => {

    // render a card
    // 
    const container = document.querySelector('.container')

    data.reverse().forEach((obj) => {

        let card = document.createElement('article')
        card.setAttribute("class", "image-card")

        const getDate = function () {
            let monthsAbbr = {
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
    
            let temp = new Date(obj.date).toString().split(' ').slice(1,4)
            temp[0] = monthsAbbr[temp[0]]

            return temp.join(' ')
        }

        if (obj.hdurl === undefined) {
            card.innerHTML = 
            `
                <figure>
                    <figcaption>
                        <h2>${obj.title}</h2>
                        <h3>${getDate()}</h3>
                    </figcaption>
                    <iframe src="${obj.url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <div class="like-grid">
                        <button data-id="${obj.date}" liked="0" class="like-btn" tabindex="0">like</button>
                        <button data-id="${obj.date}" class="share-btn" tabindex="0">share</button>
                    </div>
                </figure>

            `
        } else {
            
            card.innerHTML = 
            `
                <figure>
                    <figcaption>
                    <h2>${obj.title}</h2>
                    <h3>${getDate()}</h3>
                    </figcaption>

                    <a href="/${obj.date}"><img src="${obj.hdurl}" alt="${obj.title}"></a>

                    <div class="like-grid">
                    <button data-id="${obj.date}" liked="0" class="like-btn" tabindex="0">like</button>
                    <button data-id="${obj.date}" class="share-btn" tabindex="0">share</button>
                    </div>
                </figure>

            `
        }
        
        container.appendChild(card)
    })

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

    const sharePicture = (() => {
        let sharebtns = document.querySelectorAll('.share-btn')

        sharebtns.forEach(btn => {
            btn.addEventListener('click', () => {
    
                // get URL of card
                let url = window.location.href + btn.getAttribute('data-id')
                navigator.clipboard.writeText(url);
    
                
                // alert("Copied the text: " + url);
    
                const alertCopied = document.createElement('div')
                alertCopied.classList.add('alert')
                alertCopied.textContent = "Copied to clipboard: " + url
                document.body.appendChild(alertCopied)
    
                setTimeout(() => {
                    document.body.removeChild(alertCopied)
                },3000)
    
            })
        })
    })()


})