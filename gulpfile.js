import gulp from "gulp";
import browserSync from "browser-sync";
import minImage from "gulp-imagemin";
import del from "del";
import uglify from "gulp-uglify";
import size from "gulp-size";
import babel from "gulp-babel";
import concat from "gulp-concat";
import autoPrefixer from "gulp-autoprefixer";
import htmlmin from "gulp-htmlmin";
import cleanCss from "gulp-clean-css";
import nodeSass from "sass";
import gulpSass from "gulp-sass";
import rename from "gulp-rename";
const sass = gulpSass(nodeSass);
// defined src varible file gulp
const html = {
  input: "./*.html",
  output: "build/",
};
const video = {
  input: "./src/assets/video/*",
  output: "build/src/assets/video",
};
const font = {
  input: "./src/assets/font/**/*",
  output: "./build/src/assets/font",
};
const image = {
  input: "./src/assets/image/*",
  output: "./build/src/assets/image",
};
const scss = {
  input: "./src/scss/index.scss",
  output: "build/src/css",
  new_name: "style.min.css",
};
const javascript = {
  input: "./src/js/**/*.js",
  output: "./build/src/js",
  new_name: "index.min.js",
};
const boot_js = {
  input: [
    "./node_modules/bootstrap/dist/js/bootstrap.bundle.js",
    "./node_modules/bootstrap/js/dist/button.js",
  ],
  output: "./build/src/js",
  new_name: "bootstrap.min.js",
};
const module_css = {
  input: "./src/scss/module/module.scss",
  output: "./build/src/css",
  new_name: "module.min.css",
};
const all_css = {
  input: ["./src/scss/module/module.scss", "./src/scss/index.scss"],
  output: "./build/src/css",
  new_name: "style.min.css",
};
// delete task file build
gulp.task("delete", async function () {
  await del("./build");
});
// html compile task
gulp.task("html-Compile", async function () {
  gulp
    .src(html.input)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(size())
    .pipe(gulp.dest(html.output));
});
// video html compile
gulp.task("video-compile", async function () {
  gulp.src(video.input).pipe(gulp.dest(video.output));
});
// task compile javascript
gulp.task("compile-js", async function () {
  gulp
    .src(javascript.input)
    .pipe(concat("main.js"))
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(uglify())
    .pipe(rename(javascript.new_name))
    .pipe(gulp.dest(javascript.output));
});
// task for javascript bootsrap
gulp.task("compile-javascript-bootstrap", async function () {
  gulp
    .src(boot_js.input)
    .pipe(concat("bootstrap.js"))
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(uglify())
    .pipe(rename(boot_js.new_name))
    .pipe(gulp.dest(boot_js.output));
});
// task compile font
gulp.task("compile-font", async function () {
  gulp.src(font.input).pipe(gulp.dest(font.output));
});
// task minify-image
gulp.task("minify-image", async function () {
  gulp
    .src(image.input)
    .pipe(minImage())
    .pipe(size())
    .pipe(gulp.dest(image.output));
});
// task compile compile scss
gulp.task("comile-scss", async function () {
  gulp
    .src(scss.input)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoPrefixer({
        cascade: false,
      })
    )
    .pipe(rename(scss.new_name))
    .pipe(size())
    .pipe(concat(scss.new_name))
    .pipe(cleanCss({ compatibility: "ie8" }))
    .pipe(gulp.dest(scss.output));
});
// task for css style in file scss
gulp.task("compile-module-css", async function () {
  gulp
    .src(module_css.input)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoPrefixer({
        cascade: false,
      })
    )
    .pipe(concat(module_css.new_name))
    .pipe(cleanCss({ compatibility: "ie8" }))
    .pipe(gulp.dest(module_css.output));
});
// task for compile all style for production
gulp.task("compile-all-css", async function () {
  gulp
    .src(all_css.input)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoPrefixer({
        cascade: false,
      })
    )
    .pipe(size())
    .pipe(concat(all_css.new_name))
    .pipe(cleanCss({ compatibility: "ie8" }))
    .pipe(gulp.dest(all_css.output));
});
// task browser sync
gulp.task("browser-sync", async function () {
  browserSync.init({
    server: {
      baseDir: "./build",
    },
  });
});
// task watcher for gulp
gulp.task("watcher", async function () {
  gulp
    .watch(html.input)
    .on("change", gulp.series(["html-Compile", browserSync.reload]));
  gulp
    .watch(image.input)
    .on("change", gulp.series(["minify-image", browserSync.reload]));
  gulp
    .watch(scss.input)
    .on("change", gulp.series(["comile-scss", browserSync.reload]));
  gulp
    .watch(javascript.input)
    .on("change", gulp.series(["compile-js", browserSync.reload]));
  gulp
    .watch(video.input)
    .on("change", gulp.series(["video-compile", browserSync.reload]));
  gulp
    .watch(font.input)
    .on("change", gulp.series(["compile-font", browserSync.reload]));
  gulp
    .watch(module_css.input)
    .on("change", gulp.series(["compile-module-css", browserSync.reload]));
  gulp
    .watch(boot_js.input)
    .on(
      "change",
      gulp.series(["compile-javascript-bootstrap", browserSync.reload])
    );
});
// gulp dev task
gulp.task(
  "dev",
  gulp.series(
    "delete",
    gulp.parallel([
      "html-Compile",
      "minify-image",
      "compile-module-css",
      "comile-scss",
      "compile-javascript-bootstrap",
      "compile-js",
      "video-compile",
      "compile-font",
    ]),
    "browser-sync",
    "watcher"
  )
);
// gulp production task
gulp.task(
  "prod",
  gulp.series(
    "delete",
    gulp.parallel([
      "html-Compile",
      "minify-image",
      "compile-javascript-bootstrap",
      "compile-js",
      "compile-all-css",
      "video-compile",
      "compile-font",
    ]),
    "browser-sync",
    "watcher"
  )
);
