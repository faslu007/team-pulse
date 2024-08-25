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
