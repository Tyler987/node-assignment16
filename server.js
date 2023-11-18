const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let workouts = [
    {
        _id: 1,
        name: "Chest",
        description: "Exercises to work out the chest",
        rating: 8,
        exercises: [
            "Bench Press",
            "Cable Flys",
            "Dumbbell Shoulder Press",
            "Incline Bench Press",
        ],
    },
    {
        _id: 2,
        name: "Legs",
        description: "Exercises to strengthen and tone the legs",
        rating: 9,
        exercises: [
            "Squats",
            "Lunges",
            "Leg Press",
            "Deadlifts",
        ],
    },
    {
        _id: 3,
        name: "Back",
        description: "Workouts targeting the back muscles",
        rating: 7,
        exercises: [
            "Lat Pulldowns",
            "Barbell Rows",
            "Deadlifts",
            "Face Pulls",
        ],
    },
    {
        _id: 4,
        name: "Shoulders",
        description: "Exercises to build strong shoulders",
        rating: 8,
        exercises: [
            "Military Press",
            "Lateral Raises",
            "Front Raises",
            "Shrugs",
        ],
    },
    {
        _id: 5,
        name: "Biceps",
        description: "Workouts focusing on bicep muscles",
        rating: 7,
        exercises: [
            "Bicep Curls",
            "Hammer Curls",
            "Preacher Curls",
            "Concentration Curls",
        ],
    },
    {
        _id: 6,
        name: "Triceps",
        description: "Exercises to target tricep muscles",
        rating: 7,
        exercises: [
            "Tricep Dips",
            "Tricep Kickbacks",
            "Skull Crushers",
            "Close Grip Bench Press",
        ],
    },
];

app.get("/api/workouts", (req, res) => {
    res.send(workouts);
});

app.post("/api/workouts", upload.single("img"), (req, res) => {
    const result = validateWorkout(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const workout = {
        _id: workouts.length + 1,
        name: req.body.name,
        description: req.body.description,
        exercises: req.body.exercises.split(","),
    };
    workouts.push(workout);
    res.send(workout);
});

const validateWorkout = (workout) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        description: Joi.string().min(3).required(),
        exercises: Joi.allow(""),
    });

    return schema.validate(workout);
};

app.listen(3000, () => {
    console.log("I'm listening");
});