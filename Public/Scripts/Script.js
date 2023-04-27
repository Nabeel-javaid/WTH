document.addEventListener("DOMContentLoaded", function () {

    // Stop refreshing the page when the form is submitted
    if (document.getElementById("loginForm") != null) {
        document.getElementById("loginForm").addEventListener("submit", function (e) {
            e.preventDefault();
        });

        document.getElementById("btnLogin").addEventListener("click", Login);
        document.getElementById("btnForgot").addEventListener("click", ForgotPassword);
    }

    if (document.getElementById("regForm") != null) {
        document.getElementById("regForm").addEventListener("submit", function (e) {
            e.preventDefault();
        });

        document.getElementById("btnReg").addEventListener("click", Register);
    }

    if (document.getElementById("postJobForm") != null) {
        document.getElementById("postJobForm").addEventListener("submit", function (e) {
            e.preventDefault();
        });

        document.getElementById("btnJobPost").addEventListener("click", Post);
    }

    if (document.getElementById("SearchForm") != null) {
        document.getElementById("SearchForm").addEventListener("submit", function (e) {
            e.preventDefault();
        });

        document.getElementById("btnSearch").addEventListener("click", SearchKey);
    }

    if (document.getElementById("homeTable") != null || document.getElementById("studentTable") != null) {
        Table();
    }

    if (document.getElementById("employerTable") != null) {
        SelfPosted();
    }

    if (document.getElementById("applicantTable") != null) {
        View();
    }

});

function ForgotPassword() {
    if (document.getElementById("inputEmail4") == null) {
        alert("Please Enter Email");
    }
    if (document.getElementById("inputPassword4") == null) {
        alert("Please Enter New Password");
    }

    email = document.getElementById("inputEmail4").value;
    password = document.getElementById("inputPassword4").value;

    fetch("http://localhost:7021/user/forgot", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            {
                "email": email,
                "password": password
            }
        )
    })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
        });

}

function SearchKey() {
    key = document.getElementById("SearchKeyword").value;

    fetch("http://localhost:7021/user/jobs/search?keyword=" + key, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            var list = [];
            for (let i = 0; i < data.length; i++) {
                list.push(data[i].title);
            }
            alert("Title of relevant jobs include: " + list.join(","));
        });
}

function Table() {
    fetch("http://localhost:7021/user/alljobs", {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            JobList(data);
        });
}

const token = localStorage.getItem("token");


function SelfPosted() {
    fetch("http://localhost:7021/user/jobself", {
        headers: {
            "Authorization": token,
        }
    })
        .then(res => res.json())
        .then(data => {
            JobList(data);
        });
}

function JobList(data) {
    // Add each job in table
    for (let i = 0; i < data.length; i++) {
        var tbody = document.getElementById("job-list");
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");
        var td5 = document.createElement("td");

        td1.innerHTML = data[i].title;
        td2.innerHTML = data[i].description;
        td3.innerHTML = data[i].address;
        td4.innerHTML = data[i].salary;
        td5.innerHTML = data[i].skills;

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);

        if (document.getElementById("studentTable") != null) {
            var td6 = document.createElement("td");
            var btn = document.createElement("button");
            btn.innerHTML = "Apply";
            btn.id = data[i]._id;
            btn.className = "btn btn-primary";
            td6.appendChild(btn);
            tr.appendChild(td6);
            btn.addEventListener("click", Apply);
        }

        if (document.getElementById("employerTable") != null) {
            var td6 = document.createElement("td");
            var btn = document.createElement("button");
            btn.innerHTML = "Applications";
            btn.id = data[i]._id;
            btn.className = "btn btn-primary";
            td6.appendChild(btn);
            tr.appendChild(td6);
            btn.addEventListener("click", View);
        }

        tbody.appendChild(tr);
    }
}

function View() {
    var id = localStorage.getItem("reqID");

    url = window.location.href;

    if (!url.includes('JobApplications.html')) {
        localStorage.setItem("reqID", event.target.id);
        window.location.href = '../HTML/JobApplications.html';
    }

    fetch("http://localhost:7021/user/getjobs/" + id, {
        headers: {
            "Authorization": token,
        }
    })
        .then(res => res.json())
        .then(data => {
            ApplicantTable(data);
        })
}

function ApplicantTable(data) {
    for (var i = 0; i < data.length; i++) {
        student = data[i][0];
        details = student.split("}");

        resume = details[0] + "}";
        coverLetter = details[1] + "}";

        email = details[2].substring(4);

        console.log("Email" + email);

        var tbody = document.getElementById("job-list");
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");

        td1.innerHTML = email;
        td2.innerHTML = resume;
        td3.innerHTML = coverLetter;

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        tbody.appendChild(tr);
    }
}

function Apply() {
    if (document.getElementById("inputGroupFile01") == null) {
        alert("Please Upload Resume!");
    }

    if (document.getElementById("inputGroupFile02") == null) {
        alert("Please Upload Cover Letter!");
    }
    var id = event.target.id;
    var file00 = document.getElementById("inputGroupFile01");
    var file02 = document.getElementById("inputGroupFile02");
    var resume = file00.files[0];
    var coverLetter = file02.files[0];

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('coverLetter', coverLetter);

    fetch("http://localhost:7021/user/upload/" + id, {
        method: "POST",
        body: formData,
        headers: {
            "Authorization": token,
        }
    })
        .then(res => {
            if (res.status === 200) {
                alert("Applied Successfully");
            }
            if (res.status === 430) {
                alert("Already Applied");
            }
            if (res.status === 435) {
                alert("Application Unsuccessful");
            }
        })
}

function Login() {
    // Post data to the server
    if (document.getElementById("inputEmail4") == null) {
        alert("Please Enter Email");
    }

    if (document.getElementById("inputPassword4") == null) {
        alert("Please Enter Password");
    }

    var email = document.getElementById("inputEmail4").value;
    var password = document.getElementById("inputPassword4").value;

    fetch("http://localhost:7021/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            {
                "email": email,
                "password": password
            }
        )
    })
        .then(res => {
            if (res.status === 200) {
                res.json()
                    .then(data => {
                        console.log(data);
                        localStorage.setItem("token", data.token);
                        Dashboard(data);
                    });
            }
            if (res.status === 409) {
                alert("Invalid password");
            }
            if (res.status === 420) {
                alert("User not found");
            }
        })

}

function Register() {
    var name = document.getElementById("inputName4").value;
    var email = document.getElementById("inputEmail4").value;
    var contact = document.getElementById("inputContact4").value;
    var userType = document.getElementById("inputType4").value;
    var password = document.getElementById("inputPassword4").value;

    fetch("http://localhost:7021/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            {
                "name": name,
                "email": email,
                "contact": contact,
                "userType": userType,
                "password": password
            }
        )
    })
        .then(res => {
            if (res.status === 200) {
                alert("Registered Successfully");
                window.location.href = "../HTML/Login.html";
            }
            if (res.status === 450) {
                alert("Registration Failed");
            }
            if (res.status === 449) {
                alert("User already exists");
            }
        })
}

function Dashboard(data) {
    if (data.type == "employer") {
        window.location.href = "../HTML/Employer.html";
    }
    else if (data.type == "student") {
        window.location.href = "../HTML/Student.html";
    }
}

function Post() {
    title = document.getElementById("inputName2").value;
    description = document.getElementById("inputName3").value;
    address = document.getElementById("inputName5").value;
    salary = document.getElementById("inputName6").value;
    skills = document.getElementById("inputName7").value;

    fetch("http://localhost:7021/user/postjob", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify(
            {
                "title": title,
                "description": description,
                "address": address,
                "salary": salary,
                "skills": skills
            }
        )
    })
        .then(res => {
            if (res.status === 200) {
                alert("Posted Successfully");
                window.location.href = "../HTML/Employer.html";
            }
            if (res.status === 467) {
                alert("Post Failed");
            }
        })

    $(document).ready(function () {
        // Array to store quiz questions
        var questions = [];

        // Event listener for "Add Question" button
        $("#add-question").on("click", function () {
            // Prompt user to enter question and points
            var question = prompt("Enter the question:");
            var points = parseInt(prompt("Enter the points for this question:"));

            // Prompt user to enter 4 options for the question
            var options = [];
            for (var i = 0; i < 4; i++) {
                var option = prompt("Enter option " + (i + 1) + ":");
                options.push(option);
            }

            // Prompt user to choose correct option
            var correctOption = parseInt(prompt("Enter the number of the correct option (1-4):"));

            // Add question to array
            questions.push({ question: question, options: options, correctOption: correctOption, points: points });

            // Display questions in HTML
            var questionList = "";
            for (var i = 0; i < questions.length; i++) {
                questionList += "<div class='form-group'><label><strong>Question " + (i + 1) + ":</strong></label><input type='text' class='form-control' value='" + questions[i].question + "'><br><label><strong>Options:</strong></label><br>";
                for (var j = 0; j < 4; j++) {
                    questionList += "<input type='radio' name='q" + i + "' value='" + j + "'";
                    if (j == questions[i].correctOption) {
                        questionList += " checked";
                    }
                    questionList += "> " + questions[i].options[j] + "<br>";
                }
                questionList += "<label><strong>Points:</strong></label><input type='number' class='form-control' value='" + questions[i].points + "'></div>";
            }
            $("#quiz-questions").html(questionList);
        });

        // Event listener for "Submit Quiz" button
        $("#submit-quiz").on("click", function () {
            // Get quiz title from input field
            var quizTitle = $("#quiz-title").val();

            // Calculate user's score
            var score = 0;
            for (var i = 0; i < questions.length; i++) {
                var selectedOption = $("input[name='q" + i + "']:checked").val();
                if (selectedOption != null && parseInt(selectedOption) == questions[i].correctOption) {
                    score += questions[i].points;
                }
            }

            // Display user's score in alert box
            alert("Your score is " + score);

            // Reset form
            $("#quiz-title").val("");
            $("#quiz-questions").html("");
            questions = [];
        });
    });

}