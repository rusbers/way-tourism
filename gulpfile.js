const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const postcssUrl = require("postcss-url");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgsprite = require("gulp-svg-sprite");
const rename = require("gulp-rename");
const del = require("del");
const concat = require("gulp-concat");
const sync = require("browser-sync").create();

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      postcssUrl({
        assetsPath: "../"
      }),
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Styles concat 

const stylesConcat = () => {
  return gulp.src(["node_modules/normalize.css/normalize.css"])
    .pipe(concat("libs.scss"))
    .pipe(gulp.dest("source/sass/global"))
    .pipe(sync.stream());
}

exports.stylesConcat = stylesConcat;

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"));
}

// Scripts

const scripts = () => {
  return gulp.src("source/js/script.js")
    .pipe(terser())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Images

const imageOptimization = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
}

exports.imageOptimization = imageOptimization;

const copyImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
   .pipe(gulp.dest("build/img"))
}

exports.copyImages = copyImages;

// webP

const createWebp = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 80}))
    .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

// Svg stack

const svgstack = () => {
  return gulp.src("source/img/icons/**/*.svg")
    .pipe(plumber())
    .pipe(svgsprite({
      mode: {
        stack: {}
      }
    }))
    .pipe(rename("stack.svg"))
    .pipe(gulp.dest("build/img"));
}

exports.svgstack = svgstack;

// Copy

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/*.webmanifest",
  ],{
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

// Clean

const clean = () => {
  return del("build");
}

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/img/icons/**/*.svg", gulp.series("svgstack"));
  gulp.watch("source/*.html", gulp.series(html, reload));
  gulp.watch("source/js/script.js", gulp.series(scripts));
}

// Build

const build = gulp.series(
  clean,
  copy,
  imageOptimization,
  stylesConcat,
  gulp.parallel(
    styles,
    html,
    svgstack,
    createWebp,
    scripts
  ),
);

exports.build = build;

// Default

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  stylesConcat,
  gulp.parallel(
    styles,
    html,
    svgstack,
    createWebp,
    scripts
  ),
  gulp.series(
    server,
    watcher
  )
);
