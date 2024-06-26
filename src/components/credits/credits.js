// info.js file that handles functionality for the components that use info data
// import html from info.hbs to display custom data in using innerHTML
import template from "./credits.hbs";
// import info scss file to style and display the info on the dashboard
import "./credits.scss";
// import studentsService that retrieves students data
import studentsService from "services/studentsService";
// import coursesService that retrieves courses data
import coursesService from "services/coursesService";

const credits = {
    // asynchronous initialization function for the info object
    async init() {
        // select the DOM element with the class item info
        this.element = document.querySelector(".item.credits");
        // render the layout of the info component
        this._renderLayout();
        // load data async
        await this._loadData();
    },

    // private method to render the layout of the info component
    async _renderLayout() {
        let courses = await this._getCourses('courses');
        for (let course of courses) {
            let courseId = course.id.split("-")[0];
            course.courseId = courseId;
        }
        let finishedcourses = await this._getCourses('finishedcourses');
        for (let course of finishedcourses) {
            let courseId = course.id.split("-")[0];
            course.courseId = courseId;
        }
        let futurecourses = await this._getCourses('futurecourses');
        for (let course of futurecourses) {
            let courseId = course.id.split("-")[0];
            course.courseId = courseId;
        }

        let mainHtml = template({
            main: true,
            courses,
            finishedcourses,
            futurecourses
        });

        // set the inner HTML of the selected element to the generated HTML
        this.element.querySelector(".item-body").innerHTML = mainHtml;
        this.element.querySelector('.course').insertAdjacentHTML("beforeend", pillHtml);
    },

    // private method to load data asynchronously for the courses component
    async _getCourses(courseType) {
        // fetch the list of all courses
        this.coursesData = await coursesService.get();
        // fetch information about the current student
        let studentInfo = await studentsService.getMe();
        // initialize an array to store matched courses
        let matchedCourses = [];
        // loop through the courses of the current student
        studentInfo[courseType].forEach((courseId) => {
            // filter the courses to find a match based on the course ID
            let match = this.coursesData.filter((course) => {
                return course.id === courseId;
            });

            // add the matched courses to the array
            matchedCourses.push(...match);
        });

        return matchedCourses;
    },
};
// export info object to make it available for other modules to use
export default credits;
