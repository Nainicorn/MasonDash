// courses.js file that handles functionality for the components that use future data
// import html from future.hbs to display custom data in using innerHTML
import template from "./future.hbs";
// import future scss file to style and display the future on the dashboard
import "./future.scss";
// import coursesService that retrieves courses data
import coursesService from "services/coursesService";
// import studentsService that retrieves students data
import studentsService from "services/studentsService";

const future = {
    // asynchronous initialization function for the future object
    async init() {
        // select the DOM element with the class item future
        this.element = document.querySelector(".item.future");
        // render the layout of the future component
        this._renderLayout();
        // load data async
        await this._loadData();

        this._loadCourses();

        // call method that binds event listeners
        this._bindListeners();
    },

    // private method to render the layout of the future component
    _renderLayout() {
        // generate the HTML using the Handlebars template with main as true
        let mainHtml = template({
            main: true,
        });
        // set the inner HTML of the selected element to the generated HTML
        this.element.querySelector(".item-body").innerHTML = mainHtml;

        // generate the HTML using the Handlebars template with dialog as true
        let dialogHtml = template({
            dialog: true,
        });
        // set the inner HTML of the selected element to the generated HTML
        this.element.insertAdjacentHTML("beforeend", dialogHtml);
        this.dialog = this.element.querySelector('#future-dialog');
    },

    // private method to load data asynchronously for the future component
    async _loadData() {
        // fetch the list of all courses
        let coursesData = await coursesService.get();
        // fetch information about the current student
        let studentInfo = await studentsService.getMe();
        // loop through the future courses of the current student

        this.matchedCourses = [];
        // loop through the courses of the current student
        studentInfo.futurecourses.forEach((courseId) => {
            // filter the courses to find a match based on the course ID
            let match = coursesData.filter((course) => {
                return course.id === courseId;
            });

            // add the matched courses to the array
            this.matchedCourses.push(...match);
        });
    },

    _loadCourses() {
        let selectControl = this.element.querySelector(".item-controls select");
        selectControl.insertAdjacentHTML(
            "beforeend",
            `<option value=''>Add Course</option>`
        );
        this.matchedCourses.forEach((course) => {
            let courseId = course.id.split("-")[0];
            selectControl.insertAdjacentHTML(
                "beforeend",
                `<option value='${courseId}'>${courseId}</option>`
            );
        });
    },

    _renderCourse(courseId) {
        let matchedCourses = this.matchedCourses.filter((course) => {
            let id = course.id.split("-")[0];
            return id === courseId;
        });
        let course = matchedCourses[0];
        let days = course.days;
        days.forEach((day) => {
            for (const [key, value] of Object.entries(day)) {
                let start = value[0];
                let end = value[1];
                let startPos = this._timeDiff(start) / 1.5; //1.5 because of 60px height
                let endPos = this._timeDiff(end) / 1.5; //1.5 because of 60px height
                let height = endPos - startPos;
                let dayElement = this.element.querySelector(
                    `.day.${key.toLowerCase()}`
                );
                let html = `<div
                            class='day-event ${course.id}'
                            style='top: ${startPos}px;height: ${height}px;'
                            start='${start}' end='${end}'
                            courseid='${course.id}'
                            >${courseId}</div>`;
                dayElement
                    .querySelector(`.day-events`)
                    .insertAdjacentHTML("beforeend", html);
            }
        });
    },

    // private method to bind event listeners for the layout
    _bindListeners() {
        // select all elements with the class 'header-link' in the layout
        let selectControl = this.element.querySelector(".item-controls select");

        selectControl.addEventListener("change", (e) => {
            let selectedIndex = selectControl.selectedIndex;
            let courseId = selectControl.options[selectedIndex].value;
            if (courseId) {
                this._renderCourse(courseId);
            }
        });

        // select all elements with the class 'header-link' in the layout
        let events = this.element.querySelectorAll('.day-event');

        // add a click event for elements with day-event class
        this.element.addEventListener("click", (e) => {
            let target = e.target;
            if (target.classList.contains("day-event")) {
                // get the dialogtarget attribute value from the clicked link
                let courseId = e.target.getAttribute('courseid');
                let courseData = this.matchedCourses.filter((row) => {
                    return row.id.includes(courseId);
                })[0];
                //inject data into dialog 
                let dialogHtml = template({
                    dialogcontent: true,
                    data: courseData,
                });
                this.dialog.querySelector(".dialog-body").innerHTML = dialogHtml;
                this.dialog.querySelector(".dialog-header").innerHTML = courseData.id;
                this.dialog.showModal();

                const closeButton = this.dialog.querySelector(".dialog-footer button");
                closeButton.addEventListener("click", () => {
                    this.dialog.close();
                });
            }
        });
    },

    _timeDiff(start) {
        const startTimeString = "8:00 AM";
        const endTimeString = start;

        // Convert time strings to milliseconds
        const startMinutes = this._timeStringToMinutes(startTimeString);
        const endMinutes = this._timeStringToMinutes(endTimeString);

        // Calculate the time difference in milliseconds
        const minutes = endMinutes - startMinutes;
        return minutes;
    },

    _timeStringToMinutes(timeString) {
        const [time, period] = timeString.split(" ");
        const [hours, minutes] = time.split(":").map(Number);

        let totalMilliseconds =
            (hours % 12) * 60 * 60 * 1000 + minutes * 60 * 1000;

        if (period.toUpperCase() === "PM") {
            totalMilliseconds += 12 * 60 * 60 * 1000;
        }

        return totalMilliseconds / (1000 * 60);
    },
};
// export future courses object to make it available for other modules to use
export default future;
