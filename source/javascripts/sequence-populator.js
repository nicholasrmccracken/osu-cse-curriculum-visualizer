/**
 * Build a mapping of course IDs to course objects.
 * @param {Array} courses - The list of courses.
 * @param {Object} courses[].course_id - The ID of the course.
 * @param {Object} courses[].prereqs - The prerequisites of the course.
 * @returns {Map<string, Object[]>} A map where each course ID maps to an array of course objects.
 */
function buildCourseMapping(courses) {
    const courseMap = new Map();
    for (const course of courses) {
        // Initialize prerequisite and postrequisite sequences as empty Sets
        course['prereq-sequence'] = new Set();
        course['postreq-sequence'] = new Set();

        // Add the course to the map; initialize array if the ID is new
        if (!courseMap.has(course.course_id)) {
            courseMap.set(course.course_id, []);
        }
        courseMap.get(course.course_id).push(course);
    }
    return courseMap;
}

/**
 * Build the prerequisite sequence for a course.
 * @param {Object} course - The course object.
 * @param {string} course.course_id - The ID of the course.
 * @param {Array<string>} course.prereqs - The prerequisites of the course.
 * @param {Map<string, Object[]>} courseMap - A map where each course ID maps to an array of course objects.
 * @param {Set<string>} [visited=new Set()] - The set of visited courses to avoid cycles.
 */
function buildPrereqSequence(course, courseMap, visited = new Set()) {
    // Base case: skip if the course is already visited
    if (visited.has(course.course_id)) return;
    visited.add(course.course_id);

    for (const prereq_id of course.prereqs) {
        if (courseMap.has(prereq_id)) {
            // Build prerequisites for prerequisite course before continuing
            for (const prereqCourse of courseMap.get(prereq_id)) {
                buildPrereqSequence(prereqCourse, visited);

                // Add this prerequisite course and it's prerequisites to the sequence
                course['prereq-sequence'].add(prereqCourse.course_id);
                course['prereq-sequence'] = new Set([
                    ...course['prereq-sequence'],
                    ...prereqCourse['prereq-sequence']
                ]);
            }
        }
    }
}

/**
 * Build the postrequisite sequence for a course.
 * @param {Object} course - The course object.
 * @param {string} course.course_id - The ID of the course.
 * @param {Map<string, Object[]>} courseMap - A map where each course ID maps to an array of course objects.
 * @param {Set<string>} [visited=new Set()] - The set of visited courses to avoid cycles.
 */
function buildPostreqSequence(course, courses, courseMap, visited = new Set()) {
    // Base case: skip if the course is already visited
    if (visited.has(course.course_id)) return;
    visited.add(course.course_id);

    // For each course in the map, check if it has this course as a prerequisite
    for (const postreq of courses) {
        if (postreq['prereq-sequence'].has(course.course_id)) {
            for (const postreqCourse of courseMap.get(postreq.course_id)) {
                // Build postrequisites for postrequisite course before continuing
                buildPostreqSequence(postreqCourse, courses, courseMap, visited);

                // Add this postrequisites course and it's postrequisites to the sequence
                course['postreq-sequence'].add(postreqCourse.course_id);
                course['postreq-sequence'] = new Set([
                    ...course['postreq-sequence'],
                    ...postreqCourse['postreq-sequence']
                ]);
            }
        }
    }
}

/**
 * Populates the prerequisite and postrequisite sequences for each course.
 * @param {Array} courses - The list of courses.
 * @returns {Array} The list of courses with populated prerequisite and postrequisite sequences.
 */
export default function populateSequences(courses) {
    const courseMap = buildCourseMapping(courses);
    courses = Array.from(courseMap.values()).flat();

    for (const course of courses) {
        buildPrereqSequence(course, courseMap);
    }

    for (const course of courses) {
        buildPostreqSequence(course, courses, courseMap);
    }

    // Convert sequences from Sets to Arrays for easier access
    for (const course of courses) {
        course['prereq-sequence'] = Array.from(course['prereq-sequence']);
        course['postreq-sequence'] = Array.from(course['postreq-sequence']);
    }

    return courses;
}

