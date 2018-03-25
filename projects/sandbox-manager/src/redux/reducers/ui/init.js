import lightBaseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";

export default {
    clientWidth: null,
    footerHeight: null,
    initialized: false,
    retina: false,
    theme: getMuiTheme(lightBaseTheme),
};
