const COURSE_CONTAINER_CLASS = 'course';
const SEMESTER_PREFIX = 'semester-';
const SEMESTERS = 8;

/**
 * Renders the courses into their respective semester columns.
 * @param {Array} courses - An array of course objects.
 * @param {string} courses[].id - The ID of the course.
 * @param {number} courses[].credits - The number of credits for the course.
 * @param {string} courses[].semester - The semester ID the course belongs to.
 * @param {string} [courses[].name] - The name of the course (optional).
 * @param {string} [courses[].url] - The URL for the course details (optional).
 */
function renderCourses(courses) {
    courses.forEach(course => {
        // Determine which column the course belongs to
        const column = document.querySelector(`#${SEMESTER_PREFIX}${course.semester}`);

        // Create course container
        const courseContainer = document.createElement('div');
        courseContainer.classList.add(COURSE_CONTAINER_CLASS);
        courseContainer.id = course.id

        // Create and append course ID and credits text
        const courseIdText = document.createElement('strong');
        courseIdText.innerText = `${course.id} (${course.credits})`
        courseContainer.appendChild(courseIdText);
        courseContainer.appendChild(document.createElement('br'));

        // Create and append hyperlinked course name if the course name is present
        const courseNameText = document.createElement('em');
        const names = course.name.split(' or ');
        
        // Courses names which have multiple options (or) have multiple URLS to hyperlink
        (course.urls).forEach((url, index) => {
            const name = document.createElement('a');
            name.href = url;
            name.innerText = names[index];

            courseNameText.appendChild(name);

            if (index < (course.urls).length - 1) {
                courseNameText.appendChild(document.createTextNode(' or '));
            }
        });

        courseContainer.appendChild(courseNameText);

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
        const column = document.querySelector(`#${SEMESTER_PREFIX}${semester.id}`);

        Object.entries(semester.geneds).forEach(([name, count]) => {
            // Create course container
            const courseContainer = document.createElement('div');
            courseContainer.classList.add(COURSE_CONTAINER_CLASS, 'gened');

            // Create and append course name
            const courseNameText = document.createElement('em');
            if (name in geneds) {
                courseNameText.innerText = `${name} (${geneds[name].credits})`;

                // Add id to gened if it is a prerequisite for other courses
                if (count === 1 && 'id' in geneds[name]) {
                    courseContainer.id = geneds[name].id;
                }
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
 * Renders the footer of the curriculum table with the total credit hours for each semester.
 */
function renderFooter() {
    for (let i = 0; i < SEMESTERS; i++) {
        const column = document.querySelector(`#${SEMESTER_PREFIX}${i + 1}`);

        let credits = 0;
        const courseElements = column.querySelectorAll('.course');

        // Sum the credits for each course in the column
        // Each credit amount is surrounded by () within the text of the course
        courseElements.forEach(courseElement => {
            const courseText = courseElement.textContent;
            const match = courseText.match(/\((\d+)\)/);

            if (match) {
                credits += parseInt(match[1], 10);
            }
        });

        // Create and append credits amount to footer by semester
        const tableFooter = document.querySelector(`.curriculum-table tfoot`);

        const creditsContainer = document.createElement('th');
        creditsContainer.textContent = `${credits} hours`;

        tableFooter.appendChild(creditsContainer);
    }
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
    renderFooter();
}
