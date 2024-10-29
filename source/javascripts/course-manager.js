/**
 * Class representing a Course Manager.
 */
class CourseManager {
    /**
     * Create a Course Manager.
     * @param {Array} courses - The list of courses.
     */
    constructor(courses) {
        this.courseMap = this.#buildCourseMapping(courses);
        this.#populateSequences();
    }

    /**
     * Get a flat list of all course objects.
     * @returns {Array<Object>} A list of all course objects.
     */
    getCourses() {
        return Array.from(this.courseMap.values()).flat();
    }

    /**
     * Build a mapping of course IDs to course objects.
     * @param {Array} courses - The list of courses.
     * @returns {Map} A map where each course ID maps to an array of course objects.
     */
    #buildCourseMapping(courses) {
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
     * @param {Set} [visited=new Set()] - The set of visited courses to avoid cycles.
     */
    #buildPrereqSequence(course, visited = new Set()) {
        // Base case: skip if the course is already visited
        if (visited.has(course.course_id)) return;
        visited.add(course.course_id);

        for (const prereq_id of course.prereqs) {
            if (this.courseMap.has(prereq_id)) {
                // Build prerequisites for prerequisite course before continuing
                for (const prereqCourse of this.courseMap.get(prereq_id)) {
                    this.#buildPrereqSequence(prereqCourse, visited);

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
     * @param {Set} [visited=new Set()] - The set of visited courses to avoid cycles.
     */
    #buildPostreqSequence(course, visited = new Set()) {
        // Base case: skip if the course is already visited
        if (visited.has(course.course_id)) return;
        visited.add(course.course_id);

        // For each course in the map, check if it has this course as a prerequisite
        for (const postreq of this.getCourses()) {
            if (postreq['prereq-sequence'].has(course.course_id)) {
                for (const postreqCourse of this.courseMap.get(postreq.course_id)) {
                    // Build postrequisites for postrequisite course before continuing
                    this.#buildPostreqSequence(postreqCourse, visited);

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
     * Populate the prerequisite and postrequisite sequences for all courses.
     */
    #populateSequences() {
        const courses = this.getCourses();

        for (const course of courses) {
            this.#buildPrereqSequence(course);
        }

        for (const course of courses) {
            this.#buildPostreqSequence(course);
        }

        // Convert sequences from Sets to Arrays for easier access
        for (const course of courses) {
            course['prereq-sequence'] = Array.from(course['prereq-sequence']);
            course['postreq-sequence'] = Array.from(course['postreq-sequence']);
        }
    }
}

export default CourseManager;
