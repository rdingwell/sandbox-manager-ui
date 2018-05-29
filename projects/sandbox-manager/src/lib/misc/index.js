import getMuiTheme from "material-ui/styles/getMuiTheme";

export function customizeTheme(theme) {
    const newTheme = Object.assign({}, theme);

    newTheme.palette.primary1Color = "#009590";
    newTheme.palette.canvasColor = "#fff";
    newTheme.palette.accent1Color = "rgb(210, 76, 126)";

    const recalculatedTheme = getMuiTheme({
        borderRadius: newTheme.borderRadius,
        fontFamily:   newTheme.fontFamily,
        spacing:      newTheme.spacing,
        palette:      newTheme.palette,
    });

    return recalculatedTheme;
}

export function getPatientAnswer(index) {
    switch (index) {
    case 1: return "estimator.survey.q.agree_plus";
    case 2: return "estimator.survey.q.agree";
    case 3: return "estimator.survey.q.agree_minus";
    case 4: return "estimator.survey.q.disagree_minus";
    case 5: return "estimator.survey.q.disagree";
    case 6:
    default: return "estimator.survey.q.disagree_plus";
    }
}
