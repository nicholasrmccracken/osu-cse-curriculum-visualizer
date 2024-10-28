# OSU Curriculum Visualization

An interactive tool which visualizes the **Computer Science & Engineering (CSE) Curriculum** at The Ohio State University, showing course prerequisites, corequisites, and postrequisites through a semester-by-semester plan. This tool can be leveraged by students to students understand course sequences and dependencies when planning their CSE degree at OSU!

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
  - [Style Guidelines](#style-guidelines)
- [Individual Contributions](#individual-contributions)

## Features

## Installation

To set up the project locally, follow these steps:

1. **Clone Repository:**

    ```bash
    git clone https://github.com/yourusername/your-repo-name.git cd your-repo-name
    ```

2. **Install Ruby:**  
Install ruby v3.3.3. You can check your version with:

    ```bash
    ruby -v
    ```

3. **Install Dependencies:**  
Install all required gems by running the following command:

    ```bash
    bundler install
    ```

4. **Run Middleman Server:**  
Locally host the website on port 4567 by running the following command:

    ```bash
    bundle exec middleman server
    ```

5. **Access Site Locally:**  
Open your web browser and navigate to [http://localhost:4567](http://localhost:4567).

## Usage

## Testing

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.  
2. Create a new branch for your feature.  

    ```bash
    git checkout -b feature-name
    ```

3. Make your changes and commit them.  
Be sure to adhere to the [style guidelines](#style-guidelines).

    ```bash
    git commit -m 'Add feature-name'
    ```

4. Push to the branch.  

    ```bash
    git push origin feature-name
    ```

5. Open a pull request on GitHub.  

### Style Guidelines

**HTML/CSS Code Style:**

- Strictly use HTML/CSS for simplicty.
  - Integrate HTML w/ ruby code via ERB files, and SCSS w/ CSS via CSS files for more advanced functionality.
- Ensure all HTML/CSS is validated via [w3c validation service](https://validator.w3.org)
- Refactor all reused HTML into layout files w/ dynamic frontmatter integrations.
- Break-up CSS into partials and pages files respectively.
- Use YAML files for reusable data, as to easily add new data and render it dynamically.

**JavaScript Code Style:**

- Use JSDoc documentation for all functions.
  - Do not include in-function comments unless absolutely necessary.
- Use ES6 modules (export/import) instead of global variables.
- Follow single responsibility principle (each function does one thing).

**Git Style**:

- Create a branch for features that will not be completed within a single push.
- Prefix branch names with descriptors of work being done and use dashes as separators.
  - ‘feature/deck-card-classes’, ‘bugfix/’
- Rebase branches instead of merging them.
- Commit messages must have subject line (50 char max) and optional body copy (wrapped at 72 columns) separated by a blank line.
- Subject lines should be capitalized, not end in a period, and be written in an imperative mood.
  - 'Add', 'Implement', 'Fix'
- Body copy must only contain what and why explanations, never how. The how should be in documentation.

## Individual Contributions

**Aysha:**

-

**Christopher:**

-

**Nicholas:**

-

**Sanju:**

-
