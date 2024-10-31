import populateSequences from './sequence-populator.js';
import renderTable from './table-renderer.js';
import createHoverEvents from './hover-events.js';

/**
 * Fetches data for courses, geneds, and semesters, then populates sequences and renders the table.
 */
async function initializeApp() {
    try { 
        const [courses, geneds, semesters] = await Promise.all([
            fetchData('/data/courses.json'),
            fetchData('data/geneds.json'),
            fetchData('data/semesters.json')
        ]);
        console.log('JSON data was fetched successfully.');

        // Populate pre/postreq sequences and render the curriculum table
        const populatedCourses = populateSequences(courses);
        renderTable(populatedCourses, geneds, semesters);
        createHoverEvents();

        console.log('Table was rendered successfully.');
    } catch(error) {
        console.error('An error occured:\n', error);
    }
}

/**
 * Fetches JSON data from a given URL and returns the parsed data.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Object>} A promise that resolves to the parsed JSON data.
 */
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
    }
    return response.json();
}

initializeApp();