
const routesString = require('../../constants/routes');


$(document).ready(function () { $(`.modal-tigger`).leanModal() })
$(window).on("load", function () { console.log("window loaded") });

const arrayDomain = [
    { title: 'GET&trade; Roles List', link: routesString.findManyRole },
    { title: 'GET&trade; Genres List', link: routesString.findManyGenre },
    { title: 'GET&trade; Users List', link: routesString.findManyUser },
    { title: 'GET&trade; Authors List', link: routesString.findManyAuthor },
    { title: 'GET&trade; Manga List', link: '/api/ebooks-management/findManyManga?page=1&sort=0' },
    { title: 'GET&trade; Chapters List', link: routesString.findManyChapter },
    { title: 'GET&trade; Reviews List', link: routesString.findManyReveiw },
    { title: 'GET&trade; Comments List', link: routesString.findManyList },
    { title: 'GET&trade; Manga Get', link: routesString.findOneManga },
    { title: 'POST&trade; Sample Post', link: '/api/data-management/create-sample-data' },
]

const contentOpsion = arrayDomain.reduce((content, item) => {
    return content += `<li><a id="aaa" onclick="clickOptions('${item.title}','${item.link}')">${item.title}</a></li>`
}, "")
document.querySelector('.doamin').innerHTML = contentOpsion

let numParams = 0
document.getElementById('addParam').onclick = () => {
    numParams++
    const listParameter = Array.from({ length: numParams }).reduce((content, item) => {
        return content += `
          <div class="parameter">
            <div class="input" style="width: 24%;"><input id="keyParam" type="text" placeholder="key" value=""></div>
            <div class="input" style="width: 74%;">
              <input id="parameter" type="text" placeholder="value" value="">
            </div>
          </div>
        `
    }, "")
    document.querySelector('.renderParamter').innerHTML = listParameter
}

window.clickOptions = (title, link) => {
    document.getElementById('select-domain').innerHTML = title
    document.getElementById('url').value = window.location.origin + link
}


document.getElementById('execute').onclick = () => {
    const valueUrl = document.getElementById('url').value
    const keyParams = document.getElementById('keyParam')?.value
    const valueParams = document.getElementById('parameter')?.value


    const urlOpen = keyParams === '' && valueParams === '' ? valueUrl : `${valueUrl}?${keyParams}=${valueParams}`

    // console.log(urlOpen)
    if (keyParams === 'token') {
        fetch(urlOpen, { method: 'GET', }).then((data) => {
            if (data.status === 200) {
                showSuccessToast(data.status, 'success')
            } else {
                showSuccessToast(data.status, 'error')
            }
        }).catch((error) => { showSuccessToast(error, 'error') })
    } else {
        window.open(urlOpen, "_blank");
    }
}




// Background squares
const ulSquares = document.querySelector("ul.squares")

for (let i = 0; i < 11; i++) {
    const li = document.createElement("li");

    const random = (min, max) => Math.random() * (max - min) + min

    const size = Math.floor(random(10, 120));
    const position = random(1, 99);
    const delay = random(5, 0.1);
    const duration = random(24, 12);

    li.style.width = `${size}px`
    li.style.height = `${size}px`
    li.style.bottom = `-${size}px`

    li.style.left = `${position}%`;

    li.style.animationDelay = `${delay}s`
    li.style.animationDuration = `${duration}s`

    opacity: 0;
    li.style.animationTimingFunction = `cubic-bezier(${Math.random()}, ${Math.random()}, ${Math.random()}, ${Math.random()}, ${Math.random()}, )`

    ulSquares.appendChild(li);

}


function addData() {

}

// Toast function
function showSuccessToast(message, type) {
    toast({
        title: "Success !",
        message: message,
        type: type,
        duration: 5000
    });
}


function toast({ title = "", message = "", type = "info", duration = 3000 }) {
    const main = document.getElementById("toast");
    if (main) {
        const toast = document.createElement("div");

        // Auto remove toast
        const autoRemoveId = setTimeout(function () {
            main.removeChild(toast);
        }, duration + 1000);

        // Remove toast when clicked
        toast.onclick = function (e) {
            if (e.target.closest(".toast__close")) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };

        const icons = {
            success: "fas fa-check-circle",
            info: "fas fa-info-circle",
            warning: "fas fa-exclamation-circle",
            error: "fas fa-exclamation-circle"
        };
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add("toast", `toast--${type}`);
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

        toast.innerHTML = `
                    <div class="toast__icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="toast__body">
                        <h3 class="toast__title">${title}</h3>
                        <p class="toast__msg">${message}</p>
                    </div>
                    <div class="toast__close">
                        <i class="fas fa-times"></i>
                    </div>
                `;
        main.appendChild(toast);
    }
}
