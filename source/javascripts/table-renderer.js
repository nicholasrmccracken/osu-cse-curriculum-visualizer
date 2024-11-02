const COURSE_CONTAINER_CLASS = 'course';
const GENED_CONTAINER_CLASS = 'gened';
const COURSE_DELIMETER = ' OR ';
const SEMESTER_PREFIX = 'semester-';
const SEMESTERS = 8;

/**
 * Renders the courses and general education courses into their respective semester columns.
 * @param {Array} courses - An array of course objects.
 * @param {Object} geneds - An object containing general education courses.
 * @param {Array} semesters - An array of semester objects.
 */
export default function renderTable(courses, geneds, semesters) {
    renderCourses(courses);
    renderGeneds(geneds, semesters);
    renderFooter();
}

/**
 * Renders the courses into their respective semester columns.
 * @param {Array} courses - An array of course objects.
 */
function renderCourses(courses) {
    courses.forEach(course => {
        // Select the column which the course belongs to
        const column = document.querySelector(`#${SEMESTER_PREFIX}${course.semester}`);
        if (!column) return;

        // Create and append course container to appropriate column
        const courseContainer = createCourseContainer(course);
        column.appendChild(courseContainer);
    });
}

/**
 * Renders the general education courses into their respective semester columns.
 * @param {Object} geneds - An object containing general education courses.
 * @param {Array} semesters - An array of semester objects.
 */
function renderGeneds(geneds, semesters) {
    semesters.forEach(semester => {
        // Determine which column the course belongs to
        const column = document.querySelector(`#${SEMESTER_PREFIX}${semester.id}`);

        Object.entries(semester.geneds).forEach(([genedName, count]) => {
            const genedContainer = createGenedContainer(geneds[genedName], genedName, count)
            
            // Append the gened container however many times the gened occurs
            for (let i = 0; i < count; i++) {
                column.appendChild(genedContainer.cloneNode(true));
            }
        });
    });
}

/**
 * Renders the footer of the curriculum table with the total credit hours for each semester.
 */
function renderFooter() {
    // Select the table footer
    const tableFooter = document.querySelector('.curriculum-table tfoot');
    if (!tableFooter) return;

    for (let i = 0; i < SEMESTERS; i++) {
        // Select the column corresponding to the semester
        const column = document.querySelector(`#${SEMESTER_PREFIX}${i + 1}`);
        if (!column) continue;

        // Create and append amount of credits by semester to table footer
        const credits = calculateCredits(column);
        const creditsContainer = document.createElement('th');
        creditsContainer.textContent = `${credits} hours`;
        tableFooter.appendChild(creditsContainer);
    }
}

/**
 * Creates a course container element.
 * @param {Object} course - The course object.
 * @returns {HTMLElement} - The created course container element.
 */
function createCourseContainer(course) {
    // Initialize course container
    const container = document.createElement('div');
    container.classList.add(COURSE_CONTAINER_CLASS, 'course');
    container.id = course.id
    container.setAttribute('data-course', course.id)

    // Create course ID and course name text
    const courseIdText = document.createElement('strong');
    courseIdText.innerText = `${course.id} (${course.credits})`
    const courseNameText = createCourseNameText(course);

    // Append course ID and course name separated by a linebreak
    container.appendChild(courseIdText);
    container.appendChild(document.createElement('br'));
    container.appendChild(courseNameText);

    return container;
}

/**
 * Creates a course name text element with hyperlinks if URLs are provided.
 * @param {Object} course - The course object.
 * @returns {HTMLElement} - The created course name element.
 */
function createCourseNameText(course) {
    // Initialize course name text
    const courseNameText = document.createElement('em');
    const names = course.name.split(COURSE_DELIMETER);
    
    // Courses which have multiple options also have multiple URLS to hyperlink
    course.urls?.forEach((url, index) => {
        const link = document.createElement('a');
        link.href = url;
        link.innerText = names[index];
        courseNameText.appendChild(link);

        if (index < course.urls.length - 1) {
            courseNameText.appendChild(document.createTextNode(COURSE_DELIMETER));
        }
    });

    return courseNameText;
}

/**
 * Creates a container for a general education course.
 * @param {string} name - The name of the general education course.
 * @param {Object} gened - The general education course details.
 * @param {number} count - The number of times the course appears.
 * @returns {HTMLElement} - The created gened course container.
 */
function createGenedContainer(gened, genedName, count) {
    // Initialize gened container
    const container = document.createElement('div');
    container.classList.add(COURSE_CONTAINER_CLASS, GENED_CONTAINER_CLASS);

    // Set gened name conditionally based on whether or not it exists in geneds object
    const courseIdText = document.createElement('em');
    courseIdText.innerText = gened ? `${genedName} (${gened.credits})` : genedName;
    const courseNameText = createGenedNameText(gened, genedName);

    // Handle edgecase where a gened is also a prereq for other courses by adding id
    if (count === 1 && gened?.id) {
        container.id = gened.id;
    }

    
    container.appendChild(courseNameText);
    return container;
}

function createGenedNameText(gened, genedName) {
    const genedNameText = document.createElement('em');

    // Create a hyperlink if gened.url exists
    if (gened?.urls) {
        const link = document.createElement('a');
        link.href = gened.urls; // Set the URL for the link
        link.innerText = genedName; // Set the gened name as the link text
        genedNameText.appendChild(link);
    } else {
        // Otherwise, just set the gened name as plain text
        genedNameText.innerText = genedName;
    }

    return genedNameText;
}

/**
 * Calculates the total credits for the courses in a column.
 * @param {HTMLElement} column - The column element.
 * @returns {number} - The total credits.
 */
function calculateCredits(column) {
    let credits = 0;
    const courseElements = column.querySelectorAll('.course');

    // Sum the credits for each course in the column
    // Each credit amount is surrounded by () within the course text
    courseElements.forEach(courseElement => {
        const match = courseElement.textContent.match(/\((\d+)\)/);
        if (match) credits += parseInt(match[1], 10);
    });

    return credits;
}
