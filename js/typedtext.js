document.addEventListener('DOMContentLoaded', function () {
    var typedText = document.getElementById('typed-text').firstElementChild;
    // var textArray = ['Computer Science Major', 'Programmer', 'Gamer', 'Tech Enthusiast', 'Creative Thinker', 'Problem Solver', 'Team Player', 'AI Scholar','Web Developer'];
    var textArray = [
        'Computer Science Major',
        'Programmer',
        'Gamer',
        'Tech Enthusiast',
        'Innovative Thinker',
        'Problem Solver',
        'Team Player',
        'Artificial Intelligence Scholar',
        'Blockchain Contributor',
        'Web Developer',
        'Data Science Learner',
        'Robotics Enjoyer',
        'Game Developer',
        'Graphic Designer',
        'Google Suite Expert',
        'Microsoft Office Specialist',
        'Adobe Creative Cloud User',
        'Machine Learning Practitioner',
        'C++ Programmer',
        'Java Developer',
    ];
    
    var textIndexes = [];
    var index = 0;
    var text = '';
    var typingSpeed = 150; // milliseconds per character

    // Create an array of indexes for randomizing the text order
    for (var i = 0; i < textArray.length; i++) {
        textIndexes.push(i);
    }
    shuffleArray(textIndexes);

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function type() {
        if (index < textIndexes.length) {
            var arrayIndex = textIndexes[index];
            var currentText = textArray[arrayIndex];
            if (text.length < currentText.length) {
                text += currentText.charAt(text.length);
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
            index = (index + 1) % textIndexes.length;
            setTimeout(type, typingSpeed);
        }
    }

    setTimeout(type, typingSpeed);
});
