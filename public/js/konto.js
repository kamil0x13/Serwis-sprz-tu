
//Logout
$logoutBtn = document.getElementById('logout-btn')
$logoutBtn.addEventListener('click', () => {
    fetch('http://localhost:3000/users/logout', {
        method: "post",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        }
    }).then(() => {
        localStorage.removeItem('jwt')
        window.location.replace('index.html')
    }).catch(() => {
        localStorage.removeItem('jwt')
        window.location.replace('index.html')
    })
})

$categoriesOwn = document.getElementById('categories-own')
$categoriesOwn.addEventListener("click", () => {
    fetch('http://localhost:3000/categories/me', {
        method: "get",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        }
    }).then((res) => {
        if (!res) {
            const div = document.createElement('div')
            const h44 = document.createElement('h4')
            const textToH4 = document.createTextNode('Brak kategorji')
            $categoriesOwn.appendChild(div, h44, textToH4)
            return false
        }
        return res.json()
    }).then((text) => {
        const container = document.createElement('div')
        text.forEach(element => {
            const h4 = document.createElement('h4')
            const p = document.createElement('p')
            const name = document.createTextNode(element.name)
            const description = document.createTextNode(element.description)
            h4.appendChild(name)
            p.appendChild(description)
            container.appendChild(h4)
            container.appendChild(description)
        });
        $categoriesOwn.appendChild(container)
    }).catch((e) => {
        console.log(e)
    })
})