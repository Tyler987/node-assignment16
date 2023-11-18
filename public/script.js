const getWorkouts = async() => {
    try {
        return (await fetch("api/workouts/")).json();
    } catch (error) {
        console.log(error);
    }
};

const showWorkouts = async() => {
    let workouts = await getWorkouts();
    let workoutsDiv = document.getElementById("workout-list");
    workoutsDiv.innerHTML = "";
    workouts.forEach((workout) => {
        const section = document.createElement("section");
        section.classList.add("workout");
        workoutsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = workout.name;
        a.append(h3);

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(workout);
        };
    });
};

const displayDetails = (workout) => {
    const workoutDetails = document.getElementById("workout-details");
    workoutDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = workout.name;
    workoutDetails.append(h3);

    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#x2715;";
    workoutDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    workoutDetails.append(eLink);
    eLink.id = "edit-link";

    const p = document.createElement("p");
    workoutDetails.append(p);
    p.innerHTML = workout.description;

    const ul = document.createElement("ul");
    workoutDetails.append(ul);
    console.log(workout.exercises);
    workout.exercises.forEach((exercise) => {
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = exercise;
    });

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-edit-title").innerHTML = "Edit workout";
    };

    dLink.onclick = (e) => {
        e.preventDefault();
    };

    populateEditForm(workout);
};

const populateEditForm = (workout) => {};

const addEditWorkout = async(e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-workout-form");
    const formData = new FormData(form);
    formData.append("exercises", getExercises());
    let response;
    if (form._id.value == -1) {
        formData.delete("_id");
        formData.delete("img");
        console.log(...formData);
        response = await fetch("/api/workouts", {
            method: "POST",
            body: formData,
        });

    }
    if(response.status != 200) {
        console.log("error contacting server");
        return;
    }
    if (response.status === 200) {
        const successMessage = document.createElement("div");
        successMessage.textContent = "SUCCESSFUL!";
        successMessage.style.color = "green";
        document.querySelector("header").appendChild(successMessage);

        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    } else {
        console.log("error contacting server");
    }

    document.querySelector(".dialog").classList.add("transparent");
    resetForm();
    showWorkouts();


};

const getExercises = () => {
    const inputs = document.querySelectorAll("#exercise-boxes input");
    let exercises = [];

    inputs.forEach((input) => {
        exercises.push(input.value);
    });

    return exercises;
};

const resetForm = () => {
    const form = document.getElementById("add-edit-workout-form");
    form.reset();
    form._id = "-1";
    document.getElementById("exercise-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Add Workout";
    resetForm();
};

const addExercise = (e) => {
    e.preventDefault();
    const exerciseBoxes = document.getElementById("exercise-boxes");
    const input = document.createElement("input");
    input.type = "text";
    exerciseBoxes.append(input);
};

window.onload = () => {
    showWorkouts();
    document.getElementById("add-edit-workout-form").onsubmit = addEditWorkout;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-exercise").onclick = addExercise;
};