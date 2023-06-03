# SprintCV - Automated CV Submission to Job Boards

SprintCV is a Node.js project that demonstrates the automation of CV submission to various job boards websites. This project serves as a showcase for using different technologies, including Puppeteer, Knex.js, TypeScript, and SQLite3.

**Note: This project is intended for demonstration purposes only and should not be used in a production environment.**

## Features

- Automates the process of submitting CVs to multiple job boards websites.
- Uses Puppeteer, a powerful headless browser automation library, to interact with the websites and fill out CV submission forms.
- Utilizes Knex.js as the SQL query builder for the database operations.
- Implements TypeScript to enhance the development experience and provide static type checking.
- Employs SQLite3 as the lightweight and embedded database for storing relevant data.

## Prerequisites

Before running the project, ensure that the following dependencies are installed on your system:

- Node.js: [Download and install Node.js](https://nodejs.org) if it's not already installed.
- SQLite3: The project relies on SQLite3 for database operations. Make sure SQLite3 is installed on your system. You can refer to the [official SQLite website](https://www.sqlite.org/index.html) for installation instructions.

## Getting Started

To set up and run the SprintCV project, follow these steps:

1. Clone the repository:
   ```shell
   git clone https://github.com/haimn100/sprintcv.git
   ```

2. Install the dependencies:
   ```shell
   cd sprintcv
   npm install
   ```

3. Configure the application:
   - Update the database configuration in `knexfile.ts` to match your environment.
   - Customize the Puppeteer automation logic in the relevant files (`src/puppeteer.ts`, etc.) to fit your requirements.

4. Build and run the project:
   ```shell
   npm run dev
   ```

## Contributing

Contributions to SprintCV are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request. Please adhere to the [code of conduct](CODE_OF_CONDUCT.md) when contributing.

## License

This project is licensed under the [MIT License](LICENSE).

## Disclaimer

Please note that while SprintCV provides an example of using various technologies, it is not intended for production use. Use it as a reference or starting point for your own projects, but be sure to build and customize it according to your specific requirements and security considerations.
