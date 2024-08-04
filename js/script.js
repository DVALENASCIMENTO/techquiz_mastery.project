document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-quiz');
    const nextButton = document.getElementById('next-question');
    const restartButton = document.getElementById('restart-quiz');
    const backToHomeButton = document.getElementById('back-to-home');
    const stopQuizButton = document.getElementById('stop-quiz');
    const subjectSelect = document.getElementById('subject-select');
    const quizContainer = document.getElementById('quiz-container');
    const quizElement = document.getElementById('quiz');
    const resultContainer = document.getElementById('result');
    const scoreElement = document.getElementById('score');
    const correctSound = document.getElementById('correct-sound');
    const wrongSound = document.getElementById('wrong-sound');

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    startButton.addEventListener('click', () => {
        const subject = subjectSelect.value;
        fetch(`data/${subject}.json`)
            .then(response => response.json())
            .then(data => {
                questions = data.map(question => ({
                    ...question,
                    options: Array.isArray(question.options) ? shuffleArray(question.options) : ["Nenhuma opção disponível"]
                }));
                currentQuestionIndex = 0;
                score = 0;
                document.getElementById('subject-selection').classList.add('hidden');
                quizContainer.classList.remove('hidden');
                showQuestion();
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
                alert('Erro ao carregar as perguntas. Verifique o console para mais detalhes.');
            });
    });

    nextButton.addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="option"]:checked');
        if (selectedOption) {
            const answer = selectedOption.value;
            if (answer === questions[currentQuestionIndex].answer) {
                score++;
                correctSound.play();
            } else {
                wrongSound.play();
            }
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                showQuestion();
            } else {
                showResult();
            }
        } else {
            alert('Por favor, selecione uma opção antes de prosseguir.');
        }
    });

    restartButton.addEventListener('click', () => {
        resultContainer.classList.add('hidden');
        document.getElementById('subject-selection').classList.remove('hidden');
    });

    backToHomeButton.addEventListener('click', () => {
        resultContainer.classList.add('hidden');
        document.getElementById('subject-selection').classList.remove('hidden');
    });

    stopQuizButton.addEventListener('click', () => {
        showResult();
    });

    function showQuestion() {
        const question = questions[currentQuestionIndex];
        quizElement.innerHTML = `<h2>${question.question}</h2>`;
        
        question.options.forEach(option => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'option';
            input.value = option;

            // Adicionando o input antes do texto da opção
            label.appendChild(input); // Primeiro, adiciona o input
            label.appendChild(document.createTextNode(option)); // Depois, adiciona o texto da opção

            quizElement.appendChild(label);
            quizElement.appendChild(document.createElement('br'));
        });
    }

    function showResult() {
        quizContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        scoreElement.innerText = `Você acertou ${score} de ${questions.length} perguntas.`;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
