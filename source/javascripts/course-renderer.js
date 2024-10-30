/**
 * Renders the courses into their respective semester columns.
 * @param {Array} courses - An array of course objects.
 * @param {string} courses[].course_id - The ID of the course.
 * @param {number} courses[].credits - The number of credits for the course.
 * @param {string} courses[].semester - The semester ID the course belongs to.
 * @param {string} [courses[].name] - The name of the course (optional).
 * @param {string} [courses[].url] - The URL for the course details (optional).
 */
function renderCourses(courses) {
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

        // Create and append hyperlinked course name if the course name is present
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

/**
 * Renders the general education courses into their respective semester columns.
 * @param {Object} geneds - An object containing general education courses.
 * @param {Object[]} semesters - An array of semester objects.
 * @param {string} semesters[].id - The ID of the semester.
 * @param {Object} semesters[].geneds - An object containing general education courses for the semester.
 */
function renderGeneds(geneds, semesters) {
    semesters.forEach(semester => {
        // Determine which column the course belongs to
        const column = document.getElementById(`semester-${semester.id}`);

        Object.entries(semester.geneds).forEach(([name, count]) => {
            // Create course container
            const courseContainer = document.createElement('div');
            courseContainer.classList.add('course');

            // Create and append course name
            const courseNameText = document.createElement('em');
            if (name in geneds) {
                courseNameText.innerText = `${name} (${geneds[name].credits})`
            } else {
                courseNameText.innerText = name;
            }
            courseContainer.appendChild(courseNameText);
            
            // Append the course container to the appropriate column however many times the gened occurs
            for (let i = 0; i < count; i++) {
                column.appendChild(courseContainer.cloneNode(true));
            }
        });
    });
}

/**
 * Renders the courses and general education courses into their respective semester columns.
 * @param {Array} courses - An array of course objects.
 * @param {Object} geneds - An object containing general education courses.
 * @param {Object[]} semesters - An array of semester objects.
 */
export default function renderTable(courses, geneds, semesters) {
    renderCourses(courses);
    renderGeneds(geneds, semesters);
}
