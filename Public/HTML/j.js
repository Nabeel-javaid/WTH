

document.addEventListener("DOMContentLoaded", () => {
    fetch('https://the-trivia-api.com/api/questions?limit=20&categories=science,history', {
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => response.json())
        .then(data => {
            console.log(data)
            DisplayQuestions(data)
            document.getElementById("btn").addEventListener("click", () => {
                calculatescore(data)
            })
        })
        .catch(error => console.log(error));
});

function displayQ(data, i) {
    let form = document.getElementById("quiz");
    let cardiv = document.createElement("div");
    cardiv.classList.add("card");
    h3 = document.createElement("h3");
    h3.innerText = "Question " + (i + 1);
    p = document.createElement("p");
    p.innerText = data.question;
    cardiv.appendChild(h3);
    cardiv.appendChild(p);


    optdiv = document.createElement("div");
    optdiv.classList.add("options");
    answers = data.incorrectAnswers;
    answers.push(data.correctAnswer);
    answers.sort(() => Math.random() - 0.5);

    for (let j = 0; j < answers.length; j++) {
        div = document.createElement("div");
        label = document.createElement("label");
        inp = document.createElement("input");
        label.innerText = answers[j];
        inp.type = "radio";
        inp.name = "q" + i;
        inp.id = "q" + i + "o" + j;
        inp.value = answers[j];
        div.appendChild(inp);
        div.appendChild(label);
        optdiv.appendChild(div);
    }

    cardiv.appendChild(optdiv);
    form.appendChild(cardiv);
}


function DisplayQuestions(data) {
    for (let i = 0; i < data.length; i++) {
        displayQ(data[i], i)
    };
}

function calculatescore(data) {
    let totalScore = 0;
    for (let i = 0; i < data.length; i++) {
        let selectedOption = document.querySelector(`input[name=q${i}]:checked`);
        if (selectedOption) {
            let selectedAnswer = selectedOption.value;
            let correctAnswer = data[i].correctAnswer;
            if (selectedAnswer === correctAnswer) {
                totalScore++;
            }
        }
    }
    alert("Your score is " + totalScore + "/" + data.length);
}
