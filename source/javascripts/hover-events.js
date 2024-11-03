// Creates EventListener for each cell on mouseover
export default function createHoverEvents(courseData) {
const courseMap = new Map(courseData.map(course => [course.id, course]));

    document.querySelectorAll('.course').forEach(cell => {
        const courseId = cell.getAttribute('data-course');
        const course = courseMap.get(courseId);

        if (course) {
            cell.addEventListener('mouseenter', () => highlightRequisites(course, true));
            cell.addEventListener('mouseleave', () => highlightRequisites(course, false));
        }
        
    })
}

// Highlights appropriate requisites
function highlightRequisites(course, highlight) {
    // Highlight requisites
    // Prerequisites
    course.prereqSequence.forEach(prereqId => {
        const prereqCell = document.querySelector(`[data-course="${prereqId}"`);
        if (prereqCell) {
            prereqCell.classList.toggle('prereq-highlight', highlight);
        }
    });
    // Postrequistes
    course.postreqSequence.forEach(postreqId => {
        const postreqCell = document.querySelector(`[data-course="${postreqId}"`);
        if (postreqCell) {
            postreqCell.classList.toggle('postreq-highlight', highlight);
        }
    });
    // Corequisites
    course.coreqSequence.forEach(coreqId => {
        const coreqCell = document.querySelector(`[data-course="${coreqId}"`);
        if (coreqCell) {
            coreqCell.classList.toggle('coreq-highlight', highlight);
        }
    });
    // Immediate prerequisites
    course.iprereqSequence.forEach(iprereqId => {
        const iprereqCell = document.querySelector(`[data-course="${iprereqId}"`);
        if (iprereqCell) {
            iprereqCell.classList.toggle('iprereq-highlight', highlight);
        }
    });
}