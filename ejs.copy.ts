import * as fs from 'fs';

/**
 * Because typescript is not design to work with template engines by default
 * it is therefore necessary to copy all ejs templates to the build folder "dist"
 * after building the project
 */

fs.cp(`${__dirname}/src/core/notification/templates`, `${__dirname}/dist/src/core/notification/templates`, { recursive: true }, (err) => {
    if (err) {
        console.log(err);
        process.exit(0);
    }
});