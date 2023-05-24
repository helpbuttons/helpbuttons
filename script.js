document.addEventListener("DOMContentLoaded", function() {

    let currentSection = 0;
    const sections = document.querySelectorAll("section");
    const scrollButtons = document.querySelector('.scroll-down');

    function changeSection(index) {
        sections.forEach(section => {
            section.style.transform = `translateY(-${index * 100}vh)`;
            section.style.transition = 'transform 0.5s ease-in-out';
        });

        if (index === sections.length - 1) {
            scrollButtons.classList.add('hide');
        } else {
            scrollButtons.classList.remove('hide');
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.code === 'ArrowUp' && currentSection > 0) {
            currentSection--;
            changeSection(currentSection);
        } else if (event.code === 'ArrowDown' && currentSection < sections.length - 1) {
            currentSection++;
            changeSection(currentSection);
        }
    });

    // Mouse wheel event
    let lastScrollTime = new Date().getTime();

    document.addEventListener('wheel', function(event) {
        let currentTime = new Date().getTime();
        let waitTime = 1000;
        if (currentTime - lastScrollTime > waitTime) {
            lastScrollTime = currentTime;
            if (event.deltaY < 0 && currentSection > 0) {
                currentSection--;
                changeSection(currentSection);
            } else if (event.deltaY > 0 && currentSection < sections.length - 1) {
                currentSection++;
                changeSection(currentSection);
            }
        }
    });

    // Scroll-down arrow click event
    scrollButtons.addEventListener('click', function() {
        if (currentSection < sections.length - 1) {
            currentSection++;
            changeSection(currentSection);
        }
    });
    
});
