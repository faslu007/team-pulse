export function getNextTimeWithOffset(offsetMinutes: number) {
    // Get the current date and time
    const now = new Date();

    // Calculate rounded minutes to the nearest 15-minute increment
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;

    // Create a new Date object for the rounded time
    const roundedDate = new Date(now);

    // Handle case where rounding might exceed 60 minutes
    if (roundedMinutes === 60) {
        roundedDate.setHours(now.getHours() + 1); // Increment hour if minutes are rounded to 60
        roundedDate.setMinutes(0);
    } else {
        roundedDate.setMinutes(roundedMinutes);
    }
    roundedDate.setSeconds(0); // Set seconds to 0
    roundedDate.setMilliseconds(0); // Set milliseconds to 0

    // Add the offset (e.g., 30 minutes) to the rounded time
    roundedDate.setMinutes(roundedDate.getMinutes() + offsetMinutes);

    return roundedDate;
}


const colors = [
    "#F44336", // Red
    "#E91E63", // Pink
    "#9C27B0", // Purple
    "#673AB7", // Deep Purple
    "#3F51B5", // Indigo
    "#2196F3", // Blue
    "#03A9F4", // Light Blue
    "#00BCD4", // Cyan
    "#009688", // Teal
    "#4CAF50", // Green
    "#8BC34A", // Light Green
    "#CDDC39", // Lime
    "#FFEB3B", // Yellow
    "#FFC107", // Amber
    "#FF9800", // Orange
    "#FF5722", // Deep Orange
];

export const stringToColor = (inputString) => {
    // Convert the input string to a numerical value
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
        hash = inputString.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Get the index of the color to use
    const index = Math.abs(hash) % colors.length;

    // Return the color
    return colors[index];
};