document.addEventListener('DOMContentLoaded', () => { // Aguarda o carregamento completo do DOM antes de executar o código
    const startButton = document.getElementById('start-quiz'); // Seleciona o botão de iniciar quiz
    const nextButton = document.getElementById('next-question'); // Seleciona o botão de próxima pergunta
    const restartButton = document.getElementById('restart-quiz'); // Seleciona o botão de reiniciar quiz
    const backToHomeButton = document.getElementById('back-to-home'); // Seleciona o botão de voltar para o início
    const stopQuizButton = document.getElementById('stop-quiz'); // Seleciona o botão de parar quiz
    const subjectSelect = document.getElementById('subject-select'); // Seleciona o menu de seleção de assunto
    const quizContainer = document.getElementById('quiz-container'); // Seleciona o contêiner do quiz
    const quizElement = document.getElementById('quiz'); // Seleciona o elemento do quiz onde as perguntas serão exibidas
    const resultContainer = document.getElementById('result'); // Seleciona o contêiner de resultados
    const scoreElement = document.getElementById('score'); // Seleciona o elemento que exibirá a pontuação
    const correctSound = document.getElementById('correct-sound'); // Seleciona o áudio de resposta correta
    const wrongSound = document.getElementById('wrong-sound'); // Seleciona o áudio de resposta incorreta

    let questions = []; // Array que armazenará as perguntas
    let currentQuestionIndex = 0; // Índice da pergunta atual
    let score = 0; // Pontuação do usuário

    startButton.addEventListener('click', () => { // Adiciona um evento de clique ao botão de iniciar quiz
        const subject = subjectSelect.value; // Obtém o valor do assunto selecionado
        console.log('Fetching data for subject:', subject); // Loga no console o assunto selecionado
        fetch(`data/${subject}.json`) // Faz uma requisição para o arquivo JSON correspondente ao assunto
            .then(response => { // Recebe a resposta da requisição
                console.log('Response received:', response); // Loga a resposta no console
                if (!response.ok) { // Verifica se a resposta não está OK
                    throw new Error('Network response was not ok'); // Lança um erro se a resposta não está OK
                }
                return response.json(); // Converte a resposta em JSON
            })
            .then(data => { // Recebe os dados do JSON
                console.log('Data loaded:', data); // Loga os dados no console
                questions = data.map(question => { // Mapeia as perguntas recebidas
                    console.log('Options for question:', question.options); // Loga as opções de cada pergunta no console
                    return {
                        ...question, // Retorna a pergunta com suas propriedades
                        options: Array.isArray(question.options) ? shuffleArray(question.options) : ["Nenhuma opção disponível"] // Embaralha as opções se forem um array, senão retorna uma opção padrão
                    };
                });
                currentQuestionIndex = 0; // Reinicia o índice da pergunta atual
                score = 0; // Reinicia a pontuação
                document.getElementById('subject-selection').classList.add('hidden'); // Esconde a seção de seleção de assunto
                quizContainer.classList.remove('hidden'); // Mostra o contêiner do quiz
                showQuestion(); // Chama a função para mostrar a pergunta
            })
            .catch(error => { // Captura qualquer erro ocorrido durante a requisição
                console.error('Error fetching questions:', error); // Loga o erro no console
                alert('Erro ao carregar as perguntas. Verifique o console para mais detalhes.'); // Mostra um alerta de erro ao usuário
            });
    });

    nextButton.addEventListener('click', () => { // Adiciona um evento de clique ao botão de próxima pergunta
        const selectedOption = document.querySelector('input[name="option"]:checked'); // Seleciona a opção marcada pelo usuário
        if (selectedOption) { // Verifica se uma opção foi selecionada
            const answer = selectedOption.value; // Obtém o valor da resposta selecionada
            if (answer === questions[currentQuestionIndex].answer) { // Verifica se a resposta está correta
                score++; // Incrementa a pontuação
                correctSound.play(); // Toca o som de resposta correta
            } else { // Se a resposta estiver errada
                wrongSound.play(); // Toca o som de resposta incorreta
            }
            currentQuestionIndex++; // Incrementa o índice da pergunta atual
            if (currentQuestionIndex < questions.length) { // Verifica se ainda há perguntas
                showQuestion(); // Chama a função para mostrar a próxima pergunta
            } else { // Se não houver mais perguntas
                showResult(); // Mostra o resultado
            }
        } else { // Se nenhuma opção foi selecionada
            alert('Por favor, selecione uma opção antes de prosseguir.'); // Mostra um alerta para o usuário
        }
    });

    restartButton.addEventListener('click', () => { // Adiciona um evento de clique ao botão de reiniciar quiz
        resultContainer.classList.add('hidden'); // Esconde o contêiner de resultados
        document.getElementById('subject-selection').classList.remove('hidden'); // Mostra a seção de seleção de assunto
    });

    backToHomeButton.addEventListener('click', () => { // Adiciona um evento de clique ao botão de voltar para o início
        resultContainer.classList.add('hidden'); // Esconde o contêiner de resultados
        document.getElementById('subject-selection').classList.remove('hidden'); // Mostra a seção de seleção de assunto
    });

    stopQuizButton.addEventListener('click', () => { // Adiciona um evento de clique ao botão de parar quiz
        showResult(); // Chama a função para mostrar o resultado
    });

    function showQuestion() { // Função para mostrar a pergunta atual
        const question = questions[currentQuestionIndex]; // Obtém a pergunta atual
        quizElement.innerHTML = `
            <h2>${question.question}</h2>
            ${question.options.map((option) => `
                <label>
                    <input type="radio" name="option" value="${option}" />
                    ${option}
                </label>
            `).join('<br/>')}
        `; // Insere a pergunta e as opções no elemento do quiz
    }

    function showResult() { // Função para mostrar o resultado
        quizContainer.classList.add('hidden'); // Esconde o contêiner do quiz
        resultContainer.classList.remove('hidden'); // Mostra o contêiner de resultados
        scoreElement.textContent = `Você acertou ${score} de ${questions.length} perguntas.`; // Exibe a pontuação do usuário
    }

    // Função para embaralhar um array
    function shuffleArray(array) { 
        for (let i = array.length - 1; i > 0; i--) { // Percorre o array de trás para frente
            const j = Math.floor(Math.random() * (i + 1)); // Seleciona um índice aleatório
            [array[i], array[j]] = [array[j], array[i]]; // Troca os elementos de lugar
        }
        return array; // Retorna o array embaralhado
    }
});
