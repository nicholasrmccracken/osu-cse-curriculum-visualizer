/**
 * Creates EventListeners for each cell on mouseover.
 * @param {Array} courseData - Array of course objects.
 */
export default function createHoverEvents(courseData) {
    const courseMap = new Map(courseData.map(course => [course.id, course]));

    document.querySelectorAll('.course').forEach(cell => {
        const courseId = cell.getAttribute('id');
        const course = courseMap.get(courseId);

        if (course) {
            cell?.addEventListener('mouseenter', () => toggleRequisitesHighlight(course, true));
            cell?.addEventListener('mouseleave', () => toggleRequisitesHighlight(course, false));
        }
    });
}

/**
 * Toggles the highlight for all requisites of a course.
 * @param {Object} course - The course object.
 * @param {boolean} highlight - Whether to highlight or not.
 */
function toggleRequisitesHighlight(course, highlight) {
    toggleRequisiteHighlight(course, 'prereqSequence', 'prereq-sequence', highlight);
    toggleRequisiteHighlight(course, 'postreqSequence', 'postreq-sequence', highlight);
    toggleRequisiteHighlight(course, 'coreqSequence', 'coreq', highlight);
    toggleRequisiteHighlight(course, 'prereqs', 'prereq', highlight);
}

/**
 * Toggles the highlight for a single requisite.
 * @param {Object} course - The course object.
 * @param {string} requisitesKey - The key for the requisites array in the course object.
 * @param {string} highlightClass - The CSS class to toggle.
 * @param {boolean} highlight - Whether to highlight or not.
 */
function toggleRequisiteHighlight(course, requisitesKey, highlightClass, highlight) {
    const requisites = course[requisitesKey];
    requisites?.forEach(id => {
        const cell = document.getElementById(id);
        cell?.classList.toggle(highlightClass, highlight);
    });
}
