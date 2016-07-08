/**
 * Dependency Imports
 */
import gulp   from './gulpconfig/gulp.classes.js';
import config from './gulpconfig/gulp.config.json';

// Copy Folders / Files
gulp.Copy('copy', [
  { src: config.paths.vendor.bootstrap, dest: `${config.paths.src.sass}/vendor/bootstrap` }
  //{ src: config.paths.vendor.zone, dest: config.paths.dist.js }
]);

// Compile Sass
gulp.Sass('sass', `${config.paths.src.sass}/**/*.scss`, config.paths.dist.css);

// Complile Typescript
gulp.Browserify('browserify', `${config.paths.src.ts}/main.ts`, `${config.paths.dist.js}/main.js`);

// Lint Typescript
gulp.Tslint('tslint', `${config.paths.src.ts}/**/*.ts`, './tslint.json');

// Lint Scss
gulp.Scsslint('scsslint', `${config.paths.src.sass}/**/*.scss`, `${config.paths.src.sass}/vendor/**/*.scss`), './scsslint.yml';

// Clean Dist Folder
gulp.Clean('clean', [`${config.paths.dist.css}/*.css`, `${config.paths.dist.js}/*.js`, `${config.paths.dist.js}/*.js.map`]);

// Default Task
gulp.Default(['copy', 'sass', 'tslint', 'browserify']);

// Watch Task
gulp.Watch([], [
  { path: `${config.paths.src.ts}/*.ts`, tasks: ['tslint','browserify'] },
  { path: `${config.paths.src.sass}/*.scss`, tasks: ['scsslint','sass'] }
]);
