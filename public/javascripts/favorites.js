const generateImage = async function (query) {
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

for (let i = 0; i < localStorage.length; i++) {
    generateImage(localStorage.key(i)).then((data) => {
    
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
                        <a href="/${data.date}"><iframe width="560" height="315" src="${data.url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></a>
                        <figcaption>
                            <h2>${data.title}</h2>
                            <h3>${getDate()}</h3>
                            <p>${data.explanation}</p>
                            <div class="like-grid">
                            <button style="grid-row: 1/3; height: 50px;" data-id="${data.date}" class="share-btn" tabindex="0">share</button>
                            </div>
                        </figcaption>
    
                        
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
                        <button style="grid-row: 1/3; height: 50px;" data-id="${data.date}" class="share-btn" tabindex="0">share</button>
                        </div>
                    </figcaption>
    
                    
                </figure>
                `
        }
        container.appendChild(card)

    }).then(() => {

        // share a picture
        const sharePicture = (() => {
            let sharebtns = document.querySelectorAll('.share-btn')

            sharebtns.forEach(btn => {
                btn.addEventListener('click', () => {
        
                    // get URL of card
                    let url = window.location.origin + '/' + btn.getAttribute('data-id')
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
    
}    




    