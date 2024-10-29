import CourseManager from './course-manager.js';
import { renderCourses } from './course-renderer.js';

/**
 * Fetches course data from a JSON file, initializes a CourseManager instance,
 * logs the courses, and renders them into the curriculum visualizer table.
 */
fetch('/data/courses.json')
    .then(response => response.json())
    .then(courses => {
        const courseManager = new CourseManager(courses);

        console.log(JSON.stringify(Array.from(courseManager.getCourses()), null, 2));

        renderCourses(courseManager.getCourses());
    })
    .catch(error => console.error('Error loading courses.json file:', error));
