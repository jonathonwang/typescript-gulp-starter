/**
 * NPM Dependencies
 */
import del         from 'del';
import gulp        from 'gulp';
import tsify       from "tsify";
import watchify    from 'watchify';
import sass        from 'gulp-sass';
import size        from 'gulp-size';
import gutil       from "gulp-util";
import browserify  from 'browserify';
import shell       from 'gulp-shell';
import watch       from 'gulp-watch';
import concat      from 'gulp-concat';
import gulpfilter  from 'gulp-filter';
import notify      from 'gulp-notify';
import tslint      from 'gulp-tslint';
import uglify      from 'gulp-uglify';
import browserSync from 'browser-sync';
import buffer      from 'vinyl-buffer';
import filesize    from 'gulp-filesize';
import cleancss    from 'gulp-clean-css';
import scsslint    from 'gulp-scss-lint';
import sourcemaps  from 'gulp-sourcemaps';
import ts          from 'gulp-typescript';
import combiner    from 'stream-combiner2';
import source      from 'vinyl-source-stream';

import config     from './gulp.config.json';

/**
 * Copy Task
 * @param taskName : string
 * @param copyTasks: Array<Object> = { src: string, dest: string }
 */
export const Copy = (taskName, copyTasks) => {
  gulp.task(taskName, () => {
    for(let copyTask of copyTasks){
      gulp.src(copyTask.src)
      .on('error', gutil.log)
      .pipe(gulp.dest(copyTask.dest))
      .pipe( notify({
        title: config.name,
        subtitle: 'Gulp',
        message: `Finished ${taskName}`,
        icon: config.icon,
        sound: false,
        onLast: false
      }));
    }
  });
}

/**
 * Sass Task
 * @param taskName: string
 * @param src     : string
 * @param dest    : string
 */
export const Sass = (taskName, src, dest) => {
  gulp.task(taskName, () => {
    gulp.src(src)
    .on('error', gutil.log)
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(cleancss())
    .pipe(sourcemaps.write())
    .pipe(size())
    .pipe(gulp.dest(dest))
    .pipe( notify({
      title: config.name,
      subtitle: 'Gulp',
      message: `Finished ${taskName}`,
      icon: config.icon,
      sound: false,
      onLast: false
    }));
  });
}

/**
 * Browserify Task
 * @param taskName: string
 * @param src     : Array<string> | string
 * @param dest    : string
 * @param dist    : string
 */
export const Browserify = (taskName, src, dest) => {
  gulp.task(taskName, () => {
    const bundler = browserify({ debug: true, entries: src });
    bundler.plugin(tsify);
    bundler.transform("babelify");
    bundler.bundle()
    .on('error', gutil.log)
    .pipe(source(dest))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    // .pipe(uglify().on('error', gutil.log));
    .pipe(size())
    .pipe(gulp.dest(''))
    .pipe(notify({
      title: config.name,
      subtitle: 'Gulp',
      message: `Finished ${taskName}`,
      icon: config.icon,
      sound: false,
      onLast: false
    }));
  });
}

/**
 * Typescript Linter
 * @param taskName : string
 * @param src      : string
 * @param configSrc: string
 */
export const Tslint = (taskName, src, configSrc) => {
  gulp.task(taskName, () => {
    gulp.src(src)
    .pipe(tslint({ configuration: configSrc }))
    .pipe(tslint.report("verbose"))
    .pipe( notify({
      title: config.name,
      subtitle: 'Gulp',
      message: `Finished ${taskName}`,
      icon: config.icon,
      sound: false,
      onLast: false
    }));
  });
}

/**
 * SCSS Linter
 * @param taskName : string
 * @param src      : string
 * @param exclude  : string
 * @param configSrc: string
 */
export const Scsslint = (taskName, src, exclude, configSrc) => {
  gulp.task(taskName, () => {
    const scssfilter = gulpfilter(exclude);
    gulp.src(src)
    .pipe(scssfilter)
    .pipe(scsslint({ 'config': configSrc }))
  });
}

/**
 * Watch Task
 * @param tasksToRun  : Array<string>
 * @param tasksToWatch: Array<Object> = { path: string, tasks: Array<string> }
 */
export const Watch = (tasksToRun, tasksToWatch) => {
  gulp.task('watch', tasksToRun, () => {
    for(let task of tasksToWatch){
      gulp.watch(task.path, task.tasks);
    }
  });
}

/**
 * Clean Task (Cleans Files)
 * @param taskName : string
 * @param paths    : Array<string>
 */
export const Clean = (taskName, paths) => {
  gulp.task(taskName, () => {
    del(paths);
  })
}

/**
 * Default Task
 * @param taskNames: Array<string>
 */
export const Default = (taskNames) => {
  gulp.task('default', taskNames);
}


export default {
  Copy,
  Sass,
  Clean,
  Watch,
  Tslint,
  Default,
  Scsslint,
  Browserify
}
