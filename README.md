# Document Management System

## Installation

Please follow the installation instructions closely to set up a test environment that is suited for examination and validation of the Application.
Before you proceed, download and unzip the Github Repository on your local machine.

### Database

1. Follow the standard installation instructions provided by MariaDB to download and install a fresh MariaDB instance. If you already have an instance installed on your computer you can skip this step.
2. Open a query console for the Database and create a new Database (schema) called docview
   1. Open a console window and navigate to the MariaDB install location
   2. Run `bin/mysql --user=<user> --password=<password>` with your database user credentials as parameters (on Windows: `C:\Program Files\MariaDB <version>\bin\mysql.exe --user=<user> --password=<password>`)
   3. Create the Database by entering the command `CREATE DATABASE docview;`
   4. Enter `USE docview` to select the Database
3. Run the SQL command provided in Scripts/DatabaseSetup.txt to create the tables
   1. Make sure you have the docview Database selected in the query console
   2. Copy the SQL Statement found in DatabaseSetup.txt
   3. Paste it in the query console using a right click (standard Windows terminal)
4. Set up a User in the database for use with the Document Management System. You can also use the root user you created during installation
5. Open /api/api.js in a text editor of your choice and enter the credentials of your database user in lines 14 to 17. This step is required to enable the API to access the Database

### NodeJS

1. Download and install NodeJS following the instructions provided by NodeJS at https://nodejs.org/en
This Project has been developed using NodeJS 21.1.0. Newer Versions should work, but if you encounter compatibility issues, please revert to this version.
2. Open a console window in the Repository Root and type `npm install` to install all dependencies listed in package.json

## Adding Sample Data

1. Open a query console on the docview Database you have previously created
2. Run the SQL commands provided in Scripts/SampleTags.txt and Scripts/SampleUsers.txt to fill the Tags and Users tables with data

Sample PDFs have to be added in the running Application. You can use your own PDF files or use the sample files provided in the SamplePDFs directory


## Starting a Test / Validation Instance
1. Make sure the Database is running, set up as described and ensure NodeJS is installed and in the PATH
2. Make sure Ports 3000 and 3001 are free
3. Start the API: open a console in the repository root and type `node api/api.js`
4. Start the Front end: open another console in the repository root and type `npm start`
5. Open a browser and enter `http://localhost:3000/` in the Address bar

You can now log in using any of the sample users credentials found in Scripts/SampleUsers.txt