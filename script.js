// Game state variables
let currentQuestion = 0;
let score = 0;
let userAnswers = new Array(80).fill(null);
let answeredCorrectly = new Array(80).fill(false);
let hasAnsweredCurrent = false;

// DOM elements
const gameStart = document.getElementById('game-start');
const quizContainer = document.getElementById('quiz-container');
const quizControls = document.getElementById('quiz-controls');
const finalScore = document.getElementById('final-score');
const currentScore = document.getElementById('current-score');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const finalScoreCircle = document.getElementById('final-score-circle');
const scoreMessage = document.getElementById('score-message');
// Question data (first 5 questions as example - full set has 80)
const questions = [
    {
        chapter: "Chapter 1: Computer Systems",
        question: "What is the binary representation of the decimal number -43 using 8-bit two's complement notation?",
        options: ["10101011", "11010101", "11010101", "11101011"],
        correct: 3
    },
    {
        chapter: "Chapter 1: Computer Systems",
        question: "Which of the following binary numbers corresponds to the hexadecimal number 3FA7?",
        options: ["0011 1111 1010 0111", "1100 0011 1101 1000", "1011 1100 0011 0111", "0111 1011 1011 1100"],
        correct: 0
    },
    {
        chapter: "Chapter 1: Computer Systems",
        question: "How does the ASCII code for the character 'Z' (90 in decimal) look in binary?",
        options: ["01011010", "01001110", "01011000", "01101001"],
        correct: 0
    },
    {
        chapter: "Chapter 1: Computer Systems",
        question: "In an 8-bit signed integer representation, what is the range of values that can be represented?",
        options: ["-127 to 128", "-128 to 127", "0 to 255", "-256 to 255"],
        correct: 1
    },
    {
        chapter: "Chapter 1: Computer Systems",
        question: "How many different values can be represented with a 10-bit binary number?",
        options: ["256", "1024", "512", "2048"],
        correct: 1
    }
    // Add remaining 75 questions here following the same pattern
];
// Create question HTML
function createQuestionElement(index) {
    const question = questions[index];
    const container = document.createElement('div');
    container.className = 'question-container';
    container.id = `question-${index}`;
    
    if (index > 0) {
        container.style.display = 'none';
    }
    
    container.innerHTML = `
        <div class="question-number">${question.chapter}</div>
        <div class="question-text">${index + 1}. ${question.question}</div>
        <div class="options" id="options-${index}">
            ${question.options.map((option, i) => `
                <div class="option" data-option="${i}">
                    <strong>${String.fromCharCode(65 + i)}.</strong> ${option}
                </div>
            `).join('')}
        </div>
        <div class="feedback" id="feedback-${index}"></div>
        <div class="error-message" id="error-${index}" style="display: none;">
            Please select an answer before proceeding.
        </div>
    `;
    
    return container;
}

// Initialize the quiz
function initializeQuiz() {
    quizContainer.innerHTML = '';
    
    // Create all questions
    for (let i = 0; i < questions.length; i++) {
        quizContainer.appendChild(createQuestionElement(i));
    }
    
    // Reset game state
    currentQuestion = 0;
    score = 0;
    userAnswers = new Array(questions.length).fill(null);
    answeredCorrectly = new Array(questions.length).fill(false);
    hasAnsweredCurrent = false;
    
    // Reset UI
    currentScore.textContent = score;
    nextBtn.disabled = true;
    submitBtn.classList.add('hidden');
    
    // Show first question
    showQuestion(0);
}
// Check answer and provide feedback
function checkAnswer(questionIndex, selectedOption) {
    if (hasAnsweredCurrent && questionIndex === currentQuestion) {
        return; // Prevent changing answers
    }
    
    const correctAnswer = questions[questionIndex].correct;
    const options = document.querySelectorAll(`#options-${questionIndex} .option`);
    const feedback = document.getElementById(`feedback-${questionIndex}`);
    const errorElement = document.getElementById(`error-${questionIndex}`);
    
    // Reset UI
    errorElement.style.display = 'none';
    hasAnsweredCurrent = true;
    
    // Clear previous selections
    options.forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Mark selected option
    options[selectedOption].classList.add('selected');
    
    // Check answer
    if (selectedOption === correctAnswer) {
        options[selectedOption].classList.add('correct');
        feedback.textContent = "✅ Correct!";
        feedback.className = "feedback correct";
        if (!answeredCorrectly[questionIndex]) {
            score++;
            answeredCorrectly[questionIndex] = true;
        }
    } else {
        options[selectedOption].classList.add('incorrect');
        options[correctAnswer].classList.add('correct');
        feedback.textContent = `❌ Incorrect! Correct answer: ${String.fromCharCode(65 + correctAnswer)}`;
        feedback.className = "feedback incorrect";
        if (answeredCorrectly[questionIndex]) {
            score--;
            answeredCorrectly[questionIndex] = false;
        }
    }
    
    userAnswers[questionIndex] = selectedOption;
    currentScore.textContent = score;
    
    // Enable next button
    nextBtn.disabled = false;
    
    // Show submit button on last question
    if (questionIndex === questions.length - 1) {
        submitBtn.classList.remove('hidden');
        nextBtn.classList.add('hidden');
    }
}

// Show specific question
function showQuestion(index) {
    // Hide all questions
    document.querySelectorAll('.question-container').forEach(q => {
        q.style.display = 'none';
    });
    
    // Show current question
    document.getElementById(`question-${index}`).style.display = 'block';
    currentQuestion = index;
    
    // Update answered state
    hasAnsweredCurrent = userAnswers[index] !== null;
    
    // Update button states
    if (hasAnsweredCurrent) {
        nextBtn.disabled = false;
        if (index === questions.length - 1) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    } else {
        nextBtn.disabled = true;
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
    
    currentScore.textContent = score;
}
// Show final score screen
function showFinalScore() {
    quizContainer.classList.add('hidden');
    quizControls.classList.add('hidden');
    finalScore.classList.remove('hidden');
    
    finalScoreCircle.textContent = `${score}/80`;
    
    const percentage = (score / questions.length) * 100;
    let message = '';
    
    if (percentage >= 90) {
        message = "🏆 Champion! You've mastered Computer Science! 🎉";
    } else if (percentage >= 80) {
        message = "🎯 Excellent! You're a Computer Science expert! 👍";
    } else if (percentage >= 70) {
        message = "💪 Great job! You know your stuff! Keep it up!";
    } else if (percentage >= 60) {
        message = "📚 Good effort! You're on the right track! Study more!";
    } else {
        message = "🎯 Keep practicing! Every expert was once a beginner! 🎯";
    }
    
    scoreMessage.textContent = message;
}

// Start the game
function startGame() {
    gameStart.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    quizControls.classList.remove('hidden');
    finalScore.classList.add('hidden');
    initializeQuiz();
}

// Restart the game
function restartGame() {
    startGame();
}
// Handle option selection
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('option')) {
        const questionIndex = parseInt(e.target.closest('.question-container').id.split('-')[1]);
        if (questionIndex === currentQuestion && !hasAnsweredCurrent) {
            const selectedOption = parseInt(e.target.dataset.option);
            checkAnswer(questionIndex, selectedOption);
        }
    }
});

// Next button
nextBtn.addEventListener('click', () => {
    if (!hasAnsweredCurrent) {
        document.getElementById(`error-${currentQuestion}`).style.display = 'block';
        return;
    }
    
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
    }
});

// Submit button
submitBtn.addEventListener('click', () => {
    if (!hasAnsweredCurrent) {
        document.getElementById(`error-${currentQuestion}`).style.display = 'block';
        return;
    }
    showFinalScore();
});

// Restart button
document.getElementById('restart-btn').addEventListener('click', () => {
    restartGame();
});

// Start button
document.getElementById('start-btn').addEventListener('click', () => {
    startGame();
});