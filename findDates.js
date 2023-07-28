/*
    Finds dates in string. Returns string with dates
 */
export function findDates(str) {
    const dateRegex =
        /\d{1,2}-\d{1,2}-\d{2,4}|\d{4}-\d{1,2}-\d{1,2}|\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}\/\d{1,2}\/\d{1,2}|\d{4}.\d{1,2}.\d{1,2}|\d{1,2}.\d{1,2}.\d{2,4}|\d{1,2}\\\d{1,2}\\\d{2,4}|\d{4}\\\d{1,2}\\\d{1,2}/g;
    // get array of results
    const dates = str.match(dateRegex);
    let datesStr = "";
    // convert array to string
    if (dates !== null) {
        for (let i = 0; i < dates.length; i++) {
            datesStr += dates[i];
            if (i !== dates.length - 1) {
                datesStr += ", "
            }
        }
    }
    return datesStr;
}
