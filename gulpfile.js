const

	/********* 
		(빌드 방식 (개발, 배포)
		터미널에 작성
		Window = $env:NODE_ENV="production" or "development"
		Mac    = export NODE_ENV=production or development
	*********/

	devBuild  = ((process.env.NODE_ENV || 'development').trim().toLowerCase() === 'development'),

	// paths
	paths = {
		html: 'src/**/*.html',
		css: 'src/**/css/*.scss',
		js: 'src/**/js/*.js',
		img: 'src/**/images/*{jpg,gif,png,svg}',
		inc: 'src/**/inc/*.inc'
	},
	dist = {
		html: 'dist/',
		css: 'dist/',
		js: 'dist/',
		img: 'dist/'
	},

	// modules
	{
		src,
		series,
		dest,
		watch,
		lastRun
	}             = require('gulp'),
	noop          = require('gulp-noop'),
	plumber       = require('gulp-plumber'),
	fileinclude   = require('gulp-file-include'),
	cached        = require('gulp-cached'),
	sass          = require('gulp-sass')(require('sass')),
	dependents    = require('gulp-dependents'),
	autoprefixer  = require('gulp-autoprefixer'),
	browsersync   = require('browser-sync').create(),
	del           = require('del'),
	imagemin      = require('gulp-imagemin'),
	newer         = require('gulp-newer'),
	sourcemaps    = devBuild ? require('gulp-sourcemaps') : null;

const onError = (err) => console.log(err);

console.log('Gulp', devBuild ? 'development' : 'production', 'build');

// server
function server(done) {
	if (browsersync) {
		browsersync.init({
			server: {
				baseDir: 'dist',
				index: 'path.html'
			},
			open: false
		})
	}
	done();
}

// html
function copyHtml() {
	return new Promise(resolve => {
		src(paths.html)
			.pipe(plumber({ errorHandler: onError }))
			.pipe(fileinclude({
				prefix: '@@',
				basepath: '@file',
				context: {
					
				}
			}))
			.pipe(cached('html'))
			.pipe(dest(dist.html))
			resolve();
	});
}

// css
function compileScss() {
	return new Promise(resolve => {
		const options = {
			outputStyle: "expanded",  // 컴파일 스타일: expanded, compressed
			indentType: "tab",        // 들여쓰기 스타일: space(default), tab
			indentWidth: 1,           // 들여쓰기 칸 수 (Default : 2)
			precision: 6,             // 컴파일 된 CSS 의 소수점 자리수 (Type : Integer , Default : 5)
			sourceComments: false     // 코멘트 제거 여부 (Default : false)
		};
		src(paths.css, { since: lastRun(compileScss) })
			.pipe(plumber({ errorHandler: onError }))
			.pipe(dependents())
			.pipe(sourcemaps ? sourcemaps.init() : noop())
			.pipe(sass(options).on('error', sass.logError))
			.pipe(autoprefixer())
			.pipe(sourcemaps ? sourcemaps.write() : noop())
			.pipe(dest(dist.css))
			.pipe(browsersync.reload({ stream: true }));
		resolve();
	});
}

// js
function copyJs() {
	return new Promise(resolve => {
		src(paths.js, { since: lastRun(copyJs) })
			.pipe(plumber({ errorHandler: onError }))
			.pipe(dest(dist.js))
			.pipe(browsersync.reload({ stream: true }));
		resolve();
	});
}

// image
function image(done) {
	return src([paths.img, '!src/resources/images/sprite/**'])
		.pipe(newer(dist.img))
		.pipe(imagemin([
			imagemin.optipng({optimizationLevel: 1})
		], {
			verbose: true
		}
		))
		.pipe(dest(dist.img)),
	done();
}
exports.image = image;

// watch
function watchs(done) {
	watch([paths.html, paths.inc], copyHtml);
	watch(paths.css, compileScss);
	watch(paths.js, copyJs);
	watch(paths.img, image);
	watch([paths.html, paths.inc]).on('change', () => {
		browsersync.reload();
	});
	done();
}

// clean
function clean(done) {
	del.sync(['dist/*']);
	done();
}

exports.clean = clean;
exports.default = series(copyHtml, compileScss, image, copyJs, server, watchs);