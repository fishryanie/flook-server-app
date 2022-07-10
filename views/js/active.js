
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
      li.style.animationTimingFunction = `cubic-bezier(${Math.random()}, ${Math.random()}, ${Math.random()}, ${Math.random()}, ${Math.random()}, )`
      ulSquares.appendChild(li);
    }


    
    // Toast
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
