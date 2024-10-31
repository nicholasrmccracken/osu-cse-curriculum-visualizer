/**
 * Populates the prerequisite and postrequisite sequences for each course.
 * @param {Object} coursesObject - The object containing course data.
 * @returns {Array} The list of courses with populated prerequisite and postrequisite sequences.
 */
export default function populateSequences(coursesObject) {
    // Convert object to Map
    const courseMapping = new Map(Object.entries(coursesObject));

    // Initialize prerequisite and postrequisite sequences as empty Sets
    for (const course of courseMapping.values()) {
        course.prereqSequence = new Set();
        course.postreqSequence = new Set();
    }

    // Build prerequisite sequences
    for (const course of courseMapping.values()) {
        buildPrereqSequence(course, courseMapping);
    }

    // Build postrequisite sequences
    for (const course of courseMapping.values()) {
        buildPostreqSequence(course, courseMapping);
    }

    // Convert Sets to Arrays before returning
    return Array.from(courseMapping.values()).map(course => ({
        ...course,
        prereqSequence: Array.from(course.prereqSequence),
        postreqSequence: Array.from(course.postreqSequence)
    }));
}

/**
 * Builds the prerequisite sequence for a course.
 * @param {Object} course - The course object.
 * @param {Map<string, Object>} courseMapping - A map of course IDs to course objects.
 * @param {Set<string>} [visited=new Set()] - The set of visited courses to avoid cycles.
 */
function buildPrereqSequence(course, courseMapping, visited = new Set()) {
    // Base case: skip if the course is already visited
    if (visited.has(course.id)) return;
    visited.add(course.id);

    for (const prereqId of course.prereqs || []) {
        const prereqCourse = courseMapping.get(prereqId);

        if (prereqCourse) {
            // Build prerequisites for prerequisite course before continuing
            buildPrereqSequence(prereqCourse, courseMapping, visited);

            // Add the prerequisite course and it's prerequisites to the sequence
            course.prereqSequence.add(prereqCourse.id);
            prereqCourse.prereqSequence.forEach(id => course.prereqSequence.add(id));
        }
    }
}

/**
 * Builds the postrequisite sequence for a course.
 * @param {Object} course - The course object.
 * @param {Map<string, Object>} courseMapping - A map of course IDs to course objects.
 * @param {Set<string>} [visited=new Set()] - The set of visited courses to avoid cycles.
 */
function buildPostreqSequence(course, courseMapping, visited = new Set()) {
    // Base case: skip if the course is already visited
    if (visited.has(course.id)) return;
    visited.add(course.id);

    // For each course in the map, check if it has this course as a prerequisite
    for (const postreqCourse of courseMapping.values()) {
        if (postreqCourse.prereqSequence.has(course.id)) {
            // Build postrequisites for postrequisite course before continuing
            buildPostreqSequence(postreqCourse, courseMapping, visited);

            // Add the postrequisites course and it's postrequisites to the sequence
            course.postreqSequence.add(postreqCourse.id);
            postreqCourse.postreqSequence.forEach(id => course.postreqSequence.add(id));
        }
    }
}
