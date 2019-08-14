/* eslint max-len:0, no-console:0, func-names: 0, no-mixed-operators:0 */
const gulp = require('gulp');
const merge = require('merge-stream');
const spritesmith = require('gulp.spritesmith');
const buffer = require('vinyl-buffer');

// https://github.com/twolfson/gulp.spritesmith
function createSprite(src, fileName, cssTemplate, externalClassName = 'sprite') {
  const spriteData = gulp.src(src)
    .pipe(spritesmith({
      imgName: `${fileName.split('.')[0]}.png`,
      cssName: `${fileName}`,
      padding: 4,
      imgOpts: {
        quality: 100,
      },
      cssTemplate,
      cssHandlebarsHelpers: {
        externalName(name) {
          let className = name;
          if (/^\d/.test(className)) {
            className = `a__${name}`;
          }
          return `.${externalClassName}.${className}`;
        },
        percent(value, base) {
          return `${(value / base) * 100}%`;
        },
        bgPosition(spriteSize, imgSize, offset) {
          const result = (offset / (imgSize - spriteSize)) * 100;
          if (Number.isNaN(result)) {
            return '0';
          }
          return `${result}%`;
        },
      },
    }));
  const imgStream = spriteData.img
    .pipe(buffer())
    .pipe(gulp.dest('dist/'));

  const cssStream = spriteData.css
    .pipe(gulp.dest('dist/'));
  return merge(imgStream, cssStream);
}


gulp.task('sprite', () => {
  const basicTemplate = 'src/css/handlebars/autosize.hbs';

  const a = [
    createSprite('src/assets/sprite_src/*', 'sprite.css', basicTemplate),
  ];
  return merge(...a);
});



gulp.task('default', gulp.series('sprite'));
