/**
 * Populates the pre/post/co/iprerequisite sequences for each course.
 * @param {Object} coursesObject - The object containing course data.
 * @returns {Array} The list of courses with populated pre/post/co/iprerequisite sequences.
 */
export default function populateSequences(courseData) {
    // Convert object to Map
    const courseMapping = new Map(Object.entries(courseData));

    // Initialize pre/post/co/iprerequisite sequences as empty Sets
    for (const course of courseMapping.values()) {
        course.prereqSequence = new Set();
        course.postreqSequence = new Set();
        course.coreqSequence = new Set();
    }

    // Build prerequisite sequences
    for (const course of courseMapping.values()) {
        buildPrereqSequence(course, courseMapping);
    }

    // Build postrequisite sequences
    for (const course of courseMapping.values()) {
        buildPostreqSequence(course, courseMapping);
    }

    // Build corequisite sequences
    for (const course of courseMapping.values()){
        buildCoreqSequence(course, courseMapping);
    }

    // Convert Sets to Arrays before returning
    return Array.from(courseMapping.values()).map(course => ({
        ...course,
        prereqSequence: Array.from(course.prereqSequence),
        postreqSequence: Array.from(course.postreqSequence),
        coreqSequence: Array.from(course.coreqSequence)
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

/**
 * Builds the corequisite sequence for a course.
 * @param {Object} course - The course object.
 * @param {Map<string, Object>} courseMapping - A map of course IDs to course objects.
 * @param {Set<string>} [visited=new Set()] - The set of visited courses to avoid cycles.
 */
function buildCoreqSequence(course, courseMapping, visited = new Set()) {
    // Base case: skip if the course is already visited
    if (visited.has(course.id)) return;
    visited.add(course.id);

    for (const coreqId of course.coreqs || []) {
        const coreqCourse = courseMapping.get(coreqId);

        if (coreqCourse) {
            // Build corequisites for the corequisite course before continuing
            buildCoreqSequence(coreqCourse, courseMapping, visited);

            // Add the corequisite course and its corequisites to the sequence
            course.coreqSequence.add(coreqCourse.id);
            coreqCourse.coreqSequence.forEach(id => course.coreqSequence.add(id));
        }
    }
}
