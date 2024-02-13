document.addEventListener('DOMContentLoaded', function () {
    var typedText = document.getElementById('typed-text').firstElementChild;
    var textArray = ['Computer Science Major', 'Programmer', 'Gamer','Tech Enthusiast','Creative Thinker','Problem Solver','Team Player','AI Scholar'];
    var index = 0;
    var text = '';
    var typingSpeed = 150; // milliseconds per character

    function type() {
        if (index < textArray.length) {
            if (text.length < textArray[index].length) {
                text += textArray[index].charAt(text.length);
                typedText.textContent = text;
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(erase, 1000);
            }
        }
    }

    function erase() {
        if (text.length > 0) {
            text = text.slice(0, -1);
            typedText.textContent = text;
            setTimeout(erase, typingSpeed / 2);
        } else {
            index = (index + 1) % textArray.length;
            setTimeout(type, typingSpeed);
        }
    }

    setTimeout(type, typingSpeed);
});
