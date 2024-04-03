// app.js components initialization file
// import layout component to render main app
import layout from "components/layout/layout";
// import user component to render data for in layout
import user from "components/user/user";
// import courses component to render data for in layout
import courses from "components/courses/courses";
// import info component to render data for in layout
import info from "components/info/info";
// import future component to render data for in layout
import future from "components/future/future";
// import credits component to render data for in layout
import credits from "components/credits/credits";
// import map component to render data for in layout
import map from "components/map/map";
const app = {
    // initialize function for index module
    async init() {
        //initialize the layout component
        layout.init();
        // initialize the user component to load data
        await user.init();
        // initialize the courses component to load data
        await courses.init();
        // initialize the info component to load data
        await info.init();
        // initialize the future component to load data
        await future.init();
        // initialize the credits component to load data
        await credits.init();
        // initialize the map component to load data
        await map.init();
    },
};

export default app;
