function getUsers() {

    return JSON.parse(
        localStorage.getItem("users")
    ) || [];

}


const ADMIN_EMAIL =
    "admin@foodrecipe.com";

const ADMIN_PASSWORD =
    "admin123";


function signup() {

    let name =
        document.getElementById("signupName")
        .value
        .trim();

    let email =
        document.getElementById("signupEmail")
        .value
        .trim()
        .toLowerCase();

    let password =
        document.getElementById("signupPassword")
        .value;

    let confirmPassword =
        document.getElementById("confirmPassword")
        .value;


    if (name.length < 3) {

        alert(
            "Name must contain at least 3 characters."
        );

        return;

    }


    if (email === "") {

        alert(
            "Please enter your email."
        );

        return;

    }


    if (password.length < 6) {

        alert(
            "Password must contain at least 6 characters."
        );

        return;

    }


    if (password !== confirmPassword) {

        alert(
            "Passwords do not match."
        );

        return;

    }


    if (email === ADMIN_EMAIL) {

        alert(
            "This email is reserved for the administrator."
        );

        return;

    }


    let users = getUsers();


    let existingUser =
        users.find(function(user) {

            return (
                user.email &&
                user.email.toLowerCase() === email
            );

        });


    if (existingUser) {

        alert(
            "An account with this email already exists."
        );

        return;

    }


    let newUser = {

        name: name,
        email: email,
        password: password,
        role: "user"

    };


    users.push(newUser);


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    alert(
        "Account created successfully!"
    );


    window.location.href =
        "signin.html";

}



function signin() {

    let email =
        document.getElementById("signinEmail")
        .value
        .trim()
        .toLowerCase();

    let password =
        document.getElementById("signinPassword")
        .value;


    if (email === "") {

        alert(
            "Please enter your email."
        );

        return;

    }


    if (password === "") {

        alert(
            "Please enter your password."
        );

        return;

    }


    if (
        email === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
    ) {

        let admin = {

            name: "Administrator",
            email: ADMIN_EMAIL,
            role: "admin"

        };


        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(admin)
        );


        alert(
            "Admin login successful!"
        );


        window.location.href =
            "admin.html";


        return;

    }


    let users = getUsers();


    let user =
        users.find(function(user) {

            return (
                user.email &&
                user.email.toLowerCase() === email &&
                user.password === password
            );

        });


    if (!user) {

        alert(
            "Invalid email or password."
        );

        return;

    }


    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
    );


    alert(
        "Login successful!"
    );


    window.location.href =
        "index.html";

}



function logout() {

    localStorage.removeItem(
        "loggedInUser"
    );


    window.location.href =
        "index.html";

}



function togglePassword(
    id,
    button
) {

    let password =
        document.getElementById(id);


    if (
        password.type === "password"
    ) {

        password.type = "text";

        button.textContent = "🙈";

    } else {

        password.type = "password";

        button.textContent = "👁";

    }

}



function updateUserArea() {

    let userArea =
        document.getElementById(
            "userArea"
        );


    if (!userArea) {

        return;

    }


    let loggedInUser =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    if (!loggedInUser) {

        return;

    }


    if (
        loggedInUser.role === "admin"
    ) {

        userArea.innerHTML = `

            <span class="welcome-user">
                👑 Admin
            </span>

            <a
                href="admin.html"
                class="admin-button"
            >
                Dashboard
            </a>

            <button
                class="logout-button"
                onclick="logout()"
            >
                Logout
            </button>

        `;

    } else {

        userArea.innerHTML = `

            <span class="welcome-user">
                👤 ${loggedInUser.name}
            </span>

            <button
                class="logout-button"
                onclick="logout()"
            >
                Logout
            </button>

        `;

    }

}



function protectAuthPages() {

    let loggedInUser =
        localStorage.getItem(
            "loggedInUser"
        );


    let currentPage =
        window.location.pathname;


    if (
        loggedInUser &&
        (
            currentPage.includes(
                "signin.html"
            ) ||
            currentPage.includes(
                "signup.html"
            )
        )
    ) {

        let user =
            JSON.parse(
                loggedInUser
            );


        if (
            user.role === "admin"
        ) {

            window.location.href =
                "admin.html";

        } else {

            window.location.href =
                "index.html";

        }

    }

}



document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateUserArea();

        protectAuthPages();

    }
);