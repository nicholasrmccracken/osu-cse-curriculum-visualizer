import populateSequences from './sequence-populator.js';
import renderTable from './table-renderer.js';
import createHoverEvents from './hover-events.js';

/**
 * Fetches JSON data for courses, geneds, and semesters, then populates sequences and renders the table.
 * @returns {Promise<void>} A promise that resolves when the data is fetched and the table is rendered.
 */
Promise.all([
    fetch('/data/courses.json').then(response => response.json()),
    fetch('data/geneds.json').then(response => response.json()),
    fetch('data/semesters.json').then(response => response.json())
])
    .then(([courses, geneds, semesters]) => {
        console.log('JSON data was fetched successfully.');

        try {
            const populatedCourses = populateSequences(courses);
            renderTable(populatedCourses, geneds, semesters);
            createHoverEvents();

            console.log('Table was rendered successfully.');
        } catch (error) {
            console.error('Error rendering table:\n', error);
        }
    })
    .catch(error => console.error('Error loading JSON file:\n', error));
