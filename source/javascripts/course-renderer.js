/**
 * Renders a list of courses by placing a div container for each course into their respective 
 * semester columns.
 * 
 * @param {Array} courses - An array of course objects.
 * @param {number} courses[].semester - The semester number where the course should be placed.
 * @param {string} courses[].course_id - The unique identifier for the course.
 * @param {number} courses[].credits - The number of credits for the course.
 * @param {string} [courses[].name] - The name of the course (optional).
 * @param {string} [courses[].url] - The URL for the course details (optional).
 */
export function renderCourses(courses) {
    courses.forEach(course => {
        // Determine which column the course belongs to
        const column = document.getElementById(`semester-${course.semester}`);

        // Create course container
        const courseContainer = document.createElement('div');
        courseContainer.classList.add('course');
        courseContainer.id = course.course_id

        // Create and append course ID and credits text
        const courseIdText = document.createElement('strong');
        courseIdText.innerText = `${course.course_id} (${course.credits})`
        courseContainer.appendChild(courseIdText);
        courseContainer.appendChild(document.createElement('br'));

        // Add hyperlinked course name if the course name is present
        // Course name is not present for certain elective courses i.e. "Tech Electives"
        if ('name' in course) {
            const courseNameText = document.createElement('a');
            courseNameText.href = course.url;

            const name = document.createElement('em');
            name.innerText = course.name;

            courseNameText.appendChild(name);
            courseContainer.appendChild(courseNameText);
        }
        
        // Append the course container to the appropriate column
        column.appendChild(courseContainer);
    }); 
}
