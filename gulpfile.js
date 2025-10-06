var gulp = require('gulp');
var chug = require('gulp-chug');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var minify = require('gulp-minifier');
var stripDebug = require('gulp-strip-debug');
var mainBowerFiles = require('gulp-main-bower-files');
var gulpFilter = require('gulp-filter');
var inject = require('gulp-inject');
var CacheBuster = require('gulp-cachebust');
var mergeStream = require('merge-stream');
var rename = require("gulp-rename");
var merge = require('merge-stream');
var cleanCSS = require('clean-css');
var replace = require('gulp-string-replace');
const terser = require('gulp-terser');
var git = require('gulp-git');
var editorVersionNumber = process.env.editor_version_number;
var buildNumber = process.env.build_number;
var branchName = process.env.branch || 'master';

if (!editorVersionNumber && !buildNumber) {
    console.error('Error!!! Cannot find editor_version_number and build_number env variables');
    return process.exit(1);
}
var versionPrefix = '.' + editorVersionNumber + '.' + buildNumber;
var cachebust = function (path) {
    path.basename += versionPrefix
}


//var cachebust = new CacheBuster();
const zip = require('gulp-zip');
const { exec } = require('child_process');


var bower_components = [
    "app/bower_components/jquery/dist/jquery.min.js",
    "app/bower_components/async/dist/async.min.js",
    "app/libs/semantic.min.js",
    "app/libs/mousetrap.min.js",
    "node_modules/@project-sunbird/telemetry-sdk/index.js",
    "app/libs/webfont.js",
    "app/bower_components/angular/angular.min.js",
    "app/bower_components/fabric/dist/fabric.min.js",
    "app/bower_components/lodash/dist/lodash.min.js",
    "app/bower_components/x2js/index.js",
    "app/bower_components/eventbus/index.js",
    "app/bower_components/uuid/index.js",
    "app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
    "app/bower_components/ng-dialog/js/ngDialog.min.js",
    "app/bower_components/ngSafeApply/index.js",
    "app/bower_components/oclazyload/dist/modules/ocLazyLoad.core.js",
    "app/bower_components/oclazyload/dist/modules/ocLazyLoad.directive.js",
    "app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.common.js",
    "app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.core.js",
    "app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.cssLoader.js",
    "app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.jsLoader.js",
    "app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.templatesLoader.js",
    "app/bower_components/oclazyload/dist/modules/ocLazyLoad.polyfill.ie8.js",
    "app/bower_components/oclazyload/dist/ocLazyLoad.min.js",
    "app/scripts/contenteditor/md5.js",
    "app/libs/ng-tags-input.js"
];

var bower_css = [
    "app/bower_components/font-awesome/css/font-awesome.min.css",
    "app/bower_components/ng-dialog/css/ngDialog.min.css",
    "app/bower_components/ng-dialog/css/ngDialog-theme-plain.min.css",
    "app/bower_components/ng-dialog/css/ngDialog-theme-default.min.css",
    "app/libs/ng-tags-input.css",
];

var contentEditorApp = [
    "app/scripts/angular/controller/main.js",
    "app/scripts/angular/controller/popup-controller.js",
    "app/scripts/angular/directive/draggable-directive.js",
    "app/scripts/angular/directive/droppable-directive.js",
    "app/scripts/angular/directive/template-compiler-directive.js",
    "app/scripts/contenteditor/migration/1_migration-task.js",
    "app/scripts/contenteditor/migration/mediamigration-task.js",
    "app/scripts/contenteditor/migration/stageordermigration-task.js",
    "app/scripts/contenteditor/migration/basestagemigration-task.js",
    "app/scripts/contenteditor/migration/imagemigration-task.js",
    "app/scripts/contenteditor/migration/scribblemigration-task.js",
    "app/scripts/contenteditor/migration/readalongmigration-task.js",
    "app/scripts/contenteditor/migration/assessmentmigration-task.js",
    "app/scripts/contenteditor/migration/eventsmigration-task.js",
    "app/scripts/contenteditor/migration/settagmigration-task.js",
    "app/scripts/contenteditor/migration/textmigration-task.js",
    "app/scripts/contenteditor/migration/questionsetfix1-task.js",
    "app/scripts/contenteditor/manager/stage-manager.js"
];

var editorFramework = [
    "app/libs/fontfaceobserver.min.js",
    "node_modules/@project-sunbird/telemetry-sdk/index.js",
    "app/scripts/contenteditor/bootstrap-editor.js",
    "app/scripts/contenteditor/ce-config.js",
    "app/scripts/contenteditor/content-editor.js",
    "app/scripts/contenteditor/content-editor-api.js",
    "app/scripts/contenteditor/base-plugin.js",
    "app/scripts/contenteditor/manager/toolbar-manager.js",
    "app/scripts/contenteditor/manager/media-manager.js",
    "app/scripts/contenteditor/manager/sidebar-manager.js",
    "app/scripts/contenteditor/manager/header-manager.js",
    "app/scripts/contenteditor/service/popup-service.js",
    "app/scripts/contenteditor/service/manifest-generator.js",
    "app/scripts/contenteditor/service/telemetry-service.js",
    "app/scripts/contenteditor/dispatcher/idispatcher.js",
    "app/scripts/contenteditor/dispatcher/console-dispatcher.js",
    "app/scripts/contenteditor/dispatcher/local-dispatcher.js",
    "app/scripts/contenteditor/dispatcher/piwik-dispatcher.js"
]

var pluginFramework = [
    "app/scripts/framework/libs/ES5Polyfill.js",
    "app/scripts/framework/class.js",
    "app/scripts/framework/libs/eventbus.min.js",
    "app/scripts/framework/libs/mousetrap.min.js",
    "app/scripts/framework/bootstrap-framework.js",
    "app/scripts/framework/manager/resource-manager.js",
    "app/scripts/framework/manager/event-manager.js",
    "app/scripts/framework/manager/plugin-manager.js",
    "app/scripts/framework/manager/keyboard-manager.js",
    "app/scripts/framework/service/iservice.js",
    "app/scripts/framework/service/content-service.js",
    "app/scripts/framework/service/assessment-service.js",
    "app/scripts/framework/service/asset-service.js",
    "app/scripts/framework/service/meta-service.js",
    "app/scripts/framework/service/language-service.js",
    "app/scripts/framework/service/search-service.js",
    "app/scripts/framework/service/dialcode-service.js",
    "app/scripts/framework/service/textbook-service.js",
    "app/scripts/framework/service/lock-service.js",
    "app/scripts/framework/service/user-service.js",
    "app/scripts/framework/repo/irepo.js",
    "app/scripts/framework/repo/published-repo.js",
    "app/scripts/framework/repo/draft-repo.js",
    "app/scripts/framework/repo/host-repo.js"
];

gulp.task('setup', function () {
    gulp.src('semantic/dist', {
        read: false
    }).pipe(clean())
    gulp.src(['app/config/theme.config']).pipe(gulp.dest('semantic/src/'))
    gulp.src(['app/config/site.variables']).pipe(gulp.dest('semantic/src/site/globals/'))
    gulp.src('semantic/gulpfile.js')
        .pipe(chug({
            tasks: ['build']
        }, function () {
            gulp.src(['semantic/dist/semantic.min.css']).pipe(gulp.dest('app/styles/'));
            gulp.src(['semantic/dist/themes/**/*']).pipe(gulp.dest('app/styles/themes'));
            gulp.src(['semantic/dist/semantic.min.js']).pipe(gulp.dest('app/libs/'));
        }))
});

var appScripts = pluginFramework.concat(editorFramework).concat(contentEditorApp);
var editorScripts = pluginFramework.concat(editorFramework);

gulp.task('minifyallJS', function () {
    return gulp.src(appScripts)
        .pipe(concat('script.min.js'))
        .pipe(minify({
            minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyJS: true
        }))
        .pipe(terser())
        .pipe(rename(cachebust))
        .pipe(gulp.dest('content-editor/scripts'));
});

gulp.task('minifyBaseEditor', function () {
    return gulp.src(editorScripts)
        .pipe(concat('base-editor.min.js'))
        .pipe(terser())
        .pipe(gulp.dest('content-editor/scripts'));
});

gulp.task('minifyFramework', function () {
    return gulp.src(pluginFramework)
        .pipe(concat('plugin-framework.min.js'))
        .pipe(terser())
        .pipe(gulp.dest('content-editor/scripts'));
});

gulp.task('dist', function () {
    var cesrc = gulp.src(scriptfiles).pipe(concat('script.min.js')).pipe(gulp.dest('dist/'));
    var celibs = gulp.src(bower_components).pipe(concat('external.min.js')).pipe(gulp.dest('dist/'));
    var pluginframework = gulp.src(pluginFramework).pipe(concat('plugin-framework.min.js')).pipe(gulp.dest('dist/'));
    return merge(cesrc, celibs, pluginframework);
});

gulp.task('minifyCSS', function () {
    return gulp.src([
        'app/styles/semantic.min.css',
        'app/styles/MyFontsWebfontsKit.css',
        'app/styles/iconfont.css',
        'app/styles/icomoon/style.css',
        'app/styles/header.css',
        'app/styles/commonStyles.css',
        'app/styles/content-editor.css',
        // 'app/styles/fonts/notosans/notosans.css',
        // 'app/styles/fonts/notosans-bengali/notosansbengali.css',
        // 'app/styles/fonts/notosans-malayalam/notosansmalayalam.css',
        // 'app/styles/fonts/notosans-gurmukhi/notosansgurmukhi.css',
        // 'app/styles/fonts/notosans-devanagari/notosansdevanagari.css',
        // 'app/styles/fonts/notosans-gujarati/notosansgujarati.css',
        // 'app/styles/fonts/notosans-telugu/notosanstelugu.css',
        // 'app/styles/fonts/notosans-tamil/notosanstamil.css',
        // 'app/styles/fonts/notosans-kannada/notosanskannada.css',
        // 'app/styles/fonts/notosans-oriya/notosansoriya.css',
        // 'app/styles/fonts/noto-nastaliqurdu/notonastaliqurdu.css',
        'app/styles/fonts-override.css'
    ])
        .pipe(concat('style.min.css'))
        .pipe(minify({
            minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyJS: true,
            minifyCSS: true,
            getKeptComment: function (content, filePath) {
                var m = content.match(/\/\*![\s\S]*?\*\//img);
                return m && m.join('\n') + '\n' || '';
            }
        }))
        .pipe(rename(cachebust))
        .pipe(gulp.dest('content-editor/styles'));
});

gulp.task('minifyJsBower', function () {
    return gulp.src(bower_components)
        .pipe(concat('external.min.js'))
        .pipe(minify({
            minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyJS: true
        }))
        .pipe(terser())
        .pipe(rename(cachebust))
        .pipe(gulp.dest('content-editor/scripts/'));
});

gulp.task('minifyCssBower', function () {
    return gulp.src(bower_css)
        .pipe(concat('external.min.css'))
        .pipe(rename(cachebust))
        .pipe(gulp.dest('content-editor/styles'));
});


gulp.task('copyfonts', function () {
    return gulp.src(['app/styles/themes/**/*', 'app/styles/webfonts/**/*', 'app/styles/fonts/**/*', 'app/styles/noto.css'], {
        base: 'app/styles/'
    })
        .pipe(gulp.dest('content-editor/styles'));
});
gulp.task('copycommonfonts', function () {
    return gulp.src(['app/styles/icomoon/fonts/*'], {
        base: 'app/styles/icomoon/fonts/'
    })
        .pipe(gulp.dest('content-editor/styles/fonts'));
});
gulp.task('copyfontawesomefonts', function () {
    return gulp.src(['app/bower_components/font-awesome/fonts/fontawesome-webfont.ttf', 'app/bower_components/font-awesome/fonts/fontawesome-webfont.woff'], {
        base: 'app/bower_components/font-awesome/fonts/'
    })
        .pipe(gulp.dest('content-editor/styles/fonts'));
});
gulp.task('copyFiles', function () {
    return gulp.src(['app/templates/**/*', 'app/images/content-logo.png', 'app/images/geniecontrols.png', 'app/images/editor-frame.png', 'app/config/*.json', 'app/config/*.js', 'app/index.html'], {
        base: 'app/'
    })
        .pipe(gulp.dest('content-editor'));
});

gulp.task('copydeploydependencies', function () {
    return gulp.src(['deploy/gulpfile.js', 'deploy/package.json'], {
        base: ''
    })
        .pipe(gulp.dest('content-editor'));
});

gulp.task('minify', ['minifyallJS', 'minifyBaseEditor', 'minifyCSS', 'minifyJsBower', 'minifyFramework', 'minifyCssBower', 'copyfonts', 'copycommonfonts', 'copyfontawesomefonts', 'copyFiles', 'copydeploydependencies']);

gulp.task('inject', ['minify'], function () {
    var target = gulp.src('content-editor/index.html');
    var sources = gulp.src(['content-editor/scripts/*.js', '!content-editor/scripts/base-editor*.js', '!content-editor/scripts/plugin-framework.*.js', '!content-editor/scripts/coreplugins.js', 'content-editor/styles/*.css'], {
        read: false
    });
    return target
        .pipe(inject(sources, {
            ignorePath: 'content-editor/',
            addRootSlash: false
        }))
        .pipe(gulp.dest('./content-editor'));
});

gulp.task('replace', ['inject'], function () {
    return mergeStream([
        gulp.src(["content-editor/styles/external.*.css"]).pipe(replace('../fonts', 'fonts')).pipe(gulp.dest('content-editor/styles')),
        gulp.src(["content-editor/scripts/script.*.js"]).pipe(replace('/plugins', '/content-plugins')).pipe(replace("https://dev.ekstep.in", "")).pipe(replace('dispatcher: "local"', 'dispatcher: "console"')).pipe(gulp.dest('content-editor/scripts/'))
    ]);
});

// Standalone tasks for individual archive creation
gulp.task('zip', ['minify', 'inject', 'replace', 'packageCorePlugins'], function () {
    return gulp.src('content-editor/**')
        .pipe(zip('content-editor.zip'))
        .pipe(gulp.dest(''));
});

gulp.task('targz', ['minify', 'inject', 'replace', 'packageCorePlugins'], function (done) {
    console.log('Creating content-editor.tar.gz with all generated and copied files...');
    exec('tar -czf content-editor.tar.gz content-editor', (error, stdout, stderr) => {
        if (error) {
            console.error('Error creating tar.gz:', error);
            done(error);
        } else {
            console.log('Successfully created content-editor.tar.gz containing:');
            console.log('  - content-editor/scripts/ (minified JS files)');
            console.log('  - content-editor/styles/ (minified CSS files, fonts, themes)');
            console.log('  - content-editor/templates/ (HTML templates)');
            console.log('  - content-editor/images/ (logos and assets)');
            console.log('  - content-editor/config/ (configuration files)');
            console.log('  - content-editor/index.html (main HTML file)');
            done();
        }
    });
});

gulp.task('build', ['minify', 'inject', 'replace', 'packageCorePlugins'], function(done) {
    // Step 1: First create individual .gz files
    console.log('Step 1: Creating individual .gz files for all content-editor files...');
    exec('find content-editor -type f ! -name "*.gz" -exec gzip -k {} \\;', (gzipError, gzipStdout, gzipStderr) => {
        if (gzipError) {
            console.error('Error creating individual .gz files:', gzipError);
            done(gzipError);
            return;
        }
        
        console.log('✓ Successfully created individual .gz files');
        
        // Verify .gz files were created
        exec('find content-editor -name "*.gz" -type f | wc -l', (countError, countStdout) => {
            var gzCount = parseInt(countStdout.trim());
            console.log('✓ Total .gz files created: ' + gzCount);
            
            if (gzCount === 0) {
                console.error('WARNING: No .gz files were created! Check if content-editor directory has files.');
                done(new Error('No .gz files created'));
                return;
            }
            
            // Show some examples
            exec('find content-editor -name "*.gz" -type f | head -5', (exError, exStdout) => {
                console.log('Example .gz files created:');
                console.log(exStdout);
                console.log('');
                
                // Step 2: Now create archives that include the .gz files
                var createZip = new Promise((resolve, reject) => {
                    console.log('Step 2a: Creating content-editor.zip (includes .gz files)...');
                    gulp.src('content-editor/**/*', { dot: true })
                        .pipe(zip('content-editor.zip'))
                        .pipe(gulp.dest(''))
                        .on('end', () => {
                            console.log('✓ Successfully created content-editor.zip');
                            resolve();
                        })
                        .on('error', reject);
                });
                
                var createTarGz = new Promise((resolve, reject) => {
                    console.log('Step 2b: Creating content-editor.tar.gz (includes .gz files)...');
                    exec('tar -czf content-editor.tar.gz content-editor', (error, stdout, stderr) => {
                        if (error) {
                            reject(error);
                        } else {
                            console.log('✓ Successfully created content-editor.tar.gz');
                            resolve();
                        }
                    });
                });
                
                Promise.all([createZip, createTarGz])
                    .then(() => {
                        // Verify archives contain .gz files
                        exec('unzip -l content-editor.zip | grep "\\.gz$" | wc -l', (zipCheckError, zipCheckStdout) => {
                            var gzInZip = parseInt(zipCheckStdout.trim());
                            console.log('');
                            console.log('=== BUILD COMPLETED SUCCESSFULLY ===');
                            console.log('Generated files:');
                            console.log('1. content-editor.zip - Complete ZIP archive');
                            console.log('   ✓ Contains ' + gzInZip + ' .gz files');
                            console.log('2. content-editor.tar.gz - Complete TAR.GZ archive');
                            console.log('   ✓ Contains ' + gzCount + ' .gz files');
                            console.log('3. content-editor/ directory with:');
                            console.log('   - All original files');
                            console.log('   - ' + gzCount + ' individual .gz files for original files');
                            console.log('   - Ready for deployment with pre-compressed assets');
                            console.log('=====================================');
                            done();
                        });
                    })
                    .catch(done);
            });
        });
    });
});

//Minification for dev Start
gulp.task('copyFilesDev', function () {
    return gulp.src(['app/scripts/**', 'app/templates/**/*', 'app/images/content-logo.png', 'app/images/geniecontrols.png',
        'app/config/*.json', 'app/config/*.js', 'app/index.html'
    ], {
        base: 'app/'
    })
        .pipe(gulp.dest('content-editor'));
});

gulp.task('minifyDev', ['minifyCSS', 'minifyJsBower', 'minifyCssBower', 'copyfonts', 'copyfontawsomefonts', 'copyFilesDev']);

gulp.task('injectDev', ['minifyDev'], function () {
    var target = gulp.src('content-editor/index.html');
    var sources = gulp.src(['content-editor/scripts/external.min.js', 'content-editor/scripts/main/class.js', 'content-editor/scripts/main/ekstep-editor.js', 'content-editor/scripts/main/base-plugin.js',
        'content-editor/scripts/manager/event-manager.js', 'content-editor/scripts/manager/plugin-manager.js', 'content-editor/scripts/manager/stage-manager.js', 'content-editor/scripts/manager/toolbar-manager.js',
        'content-editor/scripts/manager/media-manager.js', "app/scripts/contenteditor/manager/header-manager.js", "app/scripts/contenteditor/manager/sidebar-manager.js", 'content-editor/scripts/main/ekstep-editor-api.js', 'content-editor/scripts/migration/1_migration-task.js', 'content-editor/scripts/migration/stageordermigration-task.js',
        'content-editor/scripts/migration/basestagemigration-task.js', 'content-editor/scripts/migration/imagemigration-task.js', 'content-editor/scripts/migration/scribblemigration-task.js', 'content-editor/scripts/service/iservice.js',
        'content-editor/scripts/service/content-serice.js', 'content-editor/scripts/service/popup-service.js', 'content-editor/scripts/angular/controller/main.js', 'content-editor/scripts/angular/controller/popup-controller.js',
        'content-editor/scripts/angular/directive/draggable-directive.js', 'content-editor/scripts/angular/directive/droppable-directive.js', 'content-editor/scripts/service/assessment-service.js', 'content-editor/scripts/service/asset-service.js',
        'content-editor/scripts/service/concept-service.js', 'content-editor/styles/*.css'
    ], {
        read: false
    });
    return target.pipe(inject(sources, {
        ignorePath: 'content-editor/',
        addRootSlash: false
    }))
        .pipe(gulp.dest('./content-editor'));
});



gulp.task('buildDev', ['minifyDev', 'injectDev'], function(done) {
    // Step 1: First create individual .gz files
    console.log('Step 1: Creating individual .gz files for all content-editor files (dev build)...');
    exec('find content-editor -type f ! -name "*.gz" -exec gzip -k {} \\;', (gzipError, gzipStdout, gzipStderr) => {
        if (gzipError) {
            console.error('Error creating individual .gz files:', gzipError);
            done(gzipError);
            return;
        }
        
        console.log('✓ Successfully created individual .gz files (dev build)');
        console.log('');
        
        // Step 2: Now create archives that include the .gz files
        var createZipDev = new Promise((resolve, reject) => {
            console.log('Step 2a: Creating content-editor.zip (dev - includes .gz files)...');
            gulp.src('content-editor/**')
                .pipe(zip('content-editor.zip'))
                .pipe(gulp.dest(''))
                .on('end', () => {
                    console.log('✓ Successfully created content-editor.zip (dev)');
                    resolve();
                })
                .on('error', reject);
        });
        
        var createTarGzDev = new Promise((resolve, reject) => {
            console.log('Step 2b: Creating content-editor.tar.gz (dev - includes .gz files)...');
            exec('tar -czf content-editor.tar.gz content-editor', (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    console.log('✓ Successfully created content-editor.tar.gz (dev)');
                    resolve();
                }
            });
        });
        
        Promise.all([createZipDev, createTarGzDev])
            .then(() => {
                console.log('');
                console.log('=== DEV BUILD COMPLETED SUCCESSFULLY ===');
                console.log('Generated files:');
                console.log('1. content-editor.zip - Complete ZIP archive (dev - includes .gz files)');
                console.log('2. content-editor.tar.gz - Complete TAR.GZ archive (dev - includes .gz files)');
                console.log('3. content-editor/ directory with:');
                console.log('   - All original files (unminified for development)');
                console.log('   - Individual .gz files for EACH original file');
                console.log('   - Ready for development and testing with pre-compressed assets');
                console.log('=======================================');
                done();
            })
            .catch(done);
    });
});

var corePlugins = [
    "org.ekstep.colorpicker-1.0",
    "org.ekstep.config-1.0",
    "org.ekstep.readalongbrowser-1.0",
    "org.ekstep.assetbrowser-1.3"
];

gulp.task('minifyCorePlugins', function () {
    var tasks = [];
    corePlugins.forEach(function (plugin) {
        tasks.push(
            gulp.src('plugins/' + plugin + '/editor/plugin.js')
                .pipe(minify({
                    minify: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    minifyJS: true,
                    minifyCSS: true,
                    mangle: false
                }))
                .pipe(rename('plugin.min.js'))
                .pipe(gulp.dest('plugins/' + plugin + '/editor'))
        );
    });
    return mergeStream(tasks);
});

gulp.task('packageCorePluginsDev', ["minifyCorePlugins"], function () {
    var fs = require('fs');
    var _ = require('lodash');
    var jsDependencies = [];
    var cssDependencies = [];
    if (fs.existsSync('app/scripts/coreplugins.js')) {
        fs.unlinkSync('app/scripts/coreplugins.js');
    }
    corePlugins.forEach(function (plugin) {
        var manifest = JSON.parse(fs.readFileSync('plugins/' + plugin + '/manifest.json'));
        if (manifest.editor.dependencies) {
            manifest.editor.dependencies.forEach(function (dependency) {
                var resource = '/plugins/' + plugin + '/' + dependency.src;
                if (dependency.type == 'js') {
                    fs.appendFile('app/scripts/coreplugins.js', "org.ekstep.pluginframework.resourceManager.loadExternalResource('" + resource + "', 'js')" + "\n");
                } else if (dependency.type == 'css') {
                    fs.appendFile('app/scripts/coreplugins.js', "org.ekstep.pluginframework.resourceManager.loadExternalResource('" + resource + "', 'css')" + "\n");
                }
            });
        }
        var plugin = fs.readFileSync('plugins/' + plugin + '/editor/plugin.min.js', 'utf8');
        fs.appendFile('app/scripts/coreplugins.js', 'org.ekstep.pluginframework.pluginManager.registerPlugin(' + JSON.stringify(manifest) + ',eval(\'' + plugin.replace(/'/g, "\\'") + '\'))' + '\n');
    });
    return gulp.src('plugins/**/plugin.min.js', {
        read: false
    }).pipe(clean());
});

gulp.task('packageCorePlugins', ["minifyFramework", "minifyBaseEditor", "minifyCorePlugins"], function () {
    var fs = require('fs');
    var _ = require('lodash');
    var jsDependencies = [];
    var cssDependencies = [];
    if (fs.existsSync('content-editor/scripts/coreplugins.js')) {
        fs.unlinkSync('content-editor/scripts/coreplugins.js');
    }
    corePlugins.forEach(function (plugin) {
        var manifest = JSON.parse(fs.readFileSync('plugins/' + plugin + '/manifest.json'));
        if (manifest.editor.dependencies) {
            manifest.editor.dependencies.forEach(function (dependency) {
                var resource = '/content-plugins/' + plugin + '/' + dependency.src;
                //var resource = '/plugins/' + plugin + '/' + dependency.src;
                if (dependency.type == 'js') {
                    fs.appendFileSync('content-editor/scripts/coreplugins.js', "org.ekstep.pluginframework.resourceManager.loadExternalResource('" + resource + "', 'js')" + "\n");
                } else if (dependency.type == 'css') {
                    fs.appendFileSync('content-editor/scripts/coreplugins.js', "org.ekstep.pluginframework.resourceManager.loadExternalResource('" + resource + "', 'css')" + "\n");
                }
            });
        }
        var plugin = fs.readFileSync('plugins/' + plugin + '/editor/plugin.min.js', 'utf8');
        fs.appendFileSync('content-editor/scripts/coreplugins.js', 'org.ekstep.pluginframework.pluginManager.registerPlugin(' + JSON.stringify(manifest) + ',eval(\'' + plugin.replace(/'/g, "\\'") + '\'))' + '\n');
    });
    return gulp.src('plugins/**/plugin.min.js', {
        read: false
    }).pipe(clean());
});

gulp.task("clone-plugins", function (done) {
    git.clone('https://github.com/project-sunbird/sunbird-content-plugins.git', { args: '-b ' + branchName + ' ./plugins' }, function (err) {
        if (err) {
            done(err);
        }
        done();
    });
});

// Task to verify .gz files exist in content-editor directory
gulp.task('verify-gz-files', function(done) {
    console.log('Checking for .gz files in content-editor directory...');
    
    exec('find content-editor -name "*.gz" -type f', (error, stdout, stderr) => {
        if (error) {
            console.error('Error checking .gz files:', error);
            done(error);
            return;
        }
        
        var gzFiles = stdout.trim().split('\n').filter(f => f);
        console.log('Found ' + gzFiles.length + ' .gz files:');
        gzFiles.forEach(f => console.log('  ' + f));
        
        if (gzFiles.length === 0) {
            console.error('ERROR: No .gz files found in content-editor directory!');
            console.log('Run "gulp gzip-individual-files" to create them.');
        }
        
        done();
    });
});

// Task to verify .gz files in the zip archive
gulp.task('verify-zip-contents', function(done) {
    console.log('Checking contents of content-editor.zip...');
    
    exec('unzip -l content-editor.zip', (error, stdout, stderr) => {
        if (error) {
            console.error('Error: content-editor.zip not found or cannot be read');
            done(error);
            return;
        }
        
        var lines = stdout.split('\n');
        var gzFiles = lines.filter(line => line.includes('.gz'));
        
        console.log('Total lines in zip: ' + lines.length);
        console.log('Lines containing .gz files: ' + gzFiles.length);
        console.log('');
        console.log('First 10 .gz files in archive:');
        gzFiles.slice(0, 10).forEach(line => console.log('  ' + line));
        
        done();
    });
});

// Task to create a test .gz file to verify gzip is working
gulp.task('test-gzip', function(done) {
    console.log('Testing gzip functionality...');
    
    exec('echo "test content" > test-file.txt && gzip -k test-file.txt && ls -la test-file.*', (error, stdout, stderr) => {
        console.log(stdout);
        
        exec('rm -f test-file.txt test-file.txt.gz', (cleanError) => {
            if (error) {
                console.error('gzip test failed:', error);
                done(error);
            } else {
                console.log('✓ gzip is working correctly');
                done();
            }
        });
    });
});

// List all files in content-editor directory for verification
gulp.task('list-content-files', function (done) {
    exec('find content-editor -type f | sort', (error, stdout, stderr) => {
        if (error) {
            console.error('Error listing files:', error);
            done(error);
        } else {
            console.log('Files in content-editor directory:');
            console.log(stdout);
            done();
        }
    });
});

// Individual task to create .gz files for each file in content-editor directory (standalone)
gulp.task('gzip-individual-files', function (done) {
    console.log('Creating individual .gz files for each file in content-editor directory...');
    
    // Check if content-editor directory exists
    exec('test -d content-editor', (testError) => {
        if (testError) {
            console.error('Error: content-editor directory does not exist!');
            console.log('Please run "gulp minify" or "gulp build" first to create the content-editor directory.');
            done(new Error('content-editor directory not found'));
            return;
        }
        
        // Use find to get all files and gzip each one individually
        exec('find content-editor -type f ! -name "*.gz" -exec gzip -k {} \\;', (error, stdout, stderr) => {
            if (error) {
                console.error('Error creating individual .gz files:', error);
                done(error);
            } else {
                console.log('Successfully created individual .gz files for all content-editor files');
                console.log('Each file now has a corresponding .gz version:');
                console.log('  - Original files remain unchanged');
                console.log('  - .gz versions created alongside each file');
                console.log('  - Example: script.min.js → script.min.js + script.min.js.gz');
                done();
            }
        });
    });
});

// Standalone task to create .gz files for existing content-editor directory (no dependencies)
gulp.task('gzip-existing', function (done) {
    console.log('Creating individual .gz files for existing content-editor directory...');
    
    // Check if content-editor directory exists
    exec('test -d content-editor', (testError) => {
        if (testError) {
            console.error('Error: content-editor directory does not exist!');
            console.log('Please ensure you have a content-editor directory with files to compress.');
            done(new Error('content-editor directory not found'));
            return;
        }
        
        // Create .gz files for all files in content-editor
        exec('find content-editor -type f ! -name "*.gz" -exec gzip -k {} \\;', (error, stdout, stderr) => {
            if (error) {
                console.error('Error creating individual .gz files:', error);
                done(error);
            } else {
                console.log('Successfully created individual .gz files for all content-editor files');
                console.log('');
                console.log('Now listing all files with their .gz versions:');
                
                // List all files to show the results
                exec('find content-editor -type f | sort', (listError, listStdout) => {
                    if (!listError) {
                        console.log(listStdout);
                    }
                    done();
                });
            }
        });
    });
});

// Task to create .gz files for downloaded artifact (works with any directory structure)
gulp.task('gzip-artifact', function (done) {
    console.log('Creating individual .gz files for downloaded artifact...');
    console.log('This task will compress all files in the current directory and subdirectories.');
    
    // Create .gz files for all files in current directory, excluding already compressed files
    exec('find . -type f ! -name "*.gz" ! -name "*.zip" ! -name "*.tar*" ! -path "./.git/*" ! -path "./node_modules/*" -exec gzip -k {} \\;', (error, stdout, stderr) => {
        if (error) {
            console.error('Error creating individual .gz files:', error);
            done(error);
        } else {
            console.log('Successfully created individual .gz files for all artifact files');
            console.log('');
            console.log('Files that were compressed:');
            
            // List all .gz files to show what was created
            exec('find . -name "*.gz" -type f | sort', (listError, listStdout) => {
                if (!listError) {
                    console.log(listStdout);
                    console.log('');
                    console.log('Each original file now has a .gz version alongside it.');
                }
                done();
            });
        }
    });
});

// Task to create .gz files for a specific directory (you specify the path)
gulp.task('gzip-directory', function (done) {
    var targetDir = process.env.TARGET_DIR || '.';
    console.log('Creating individual .gz files for directory: ' + targetDir);
    
    // Check if target directory exists
    exec('test -d "' + targetDir + '"', (testError) => {
        if (testError) {
            console.error('Error: Target directory does not exist: ' + targetDir);
            console.log('Usage: TARGET_DIR="/path/to/your/directory" npx gulp gzip-directory');
            done(new Error('Target directory not found'));
            return;
        }
        
        // Create .gz files for all files in target directory
        exec('find "' + targetDir + '" -type f ! -name "*.gz" ! -name "*.zip" ! -name "*.tar*" -exec gzip -k {} \\;', (error, stdout, stderr) => {
            if (error) {
                console.error('Error creating individual .gz files:', error);
                done(error);
            } else {
                console.log('Successfully created individual .gz files for all files in: ' + targetDir);
                console.log('');
                console.log('Files with .gz versions:');
                
                // List all files to show the results
                exec('find "' + targetDir + '" -type f | sort', (listError, listStdout) => {
                    if (!listError) {
                        console.log(listStdout);
                    }
                    done();
                });
            }
        });
    });
});

// Standalone task to create both zip and tar.gz archives plus individual .gz files
gulp.task('archive', ['minify', 'inject', 'replace', 'packageCorePlugins'], function (done) {
    var createZip = new Promise((resolve, reject) => {
        gulp.src('content-editor/**')
            .pipe(zip('content-editor.zip'))
            .pipe(gulp.dest(''))
            .on('end', resolve)
            .on('error', reject);
    });
    
    var createTarGz = new Promise((resolve, reject) => {
        console.log('Creating comprehensive tar.gz archive of all content-editor files...');
        exec('tar -czf content-editor.tar.gz content-editor', (error, stdout, stderr) => {
            if (error) {
                console.error('Error creating tar.gz:', error);
                reject(error);
            } else {
                console.log('Successfully created content-editor.tar.gz with ALL content-editor files');
                resolve();
            }
        });
    });
    
    var createIndividualGz = new Promise((resolve, reject) => {
        console.log('Creating individual .gz files for each content-editor file...');
        exec('find content-editor -type f -exec gzip -k {} \\;', (error, stdout, stderr) => {
            if (error) {
                console.error('Error creating individual .gz files:', error);
                reject(error);
            } else {
                console.log('Successfully created individual .gz files for all content-editor files');
                resolve();
            }
        });
    });
    
    Promise.all([createZip, createTarGz, createIndividualGz])
        .then(() => {
            console.log('All archives created successfully!');
            console.log('Created:');
            console.log('1. content-editor.zip - Complete ZIP archive');
            console.log('2. content-editor.tar.gz - Complete TAR.GZ archive'); 
            console.log('3. Individual .gz files for each file in content-editor/');
            console.log('   - Each original file now has a .gz compressed version alongside it');
            console.log('   - Example: index.html → index.html + index.html.gz');
            done();
        })
        .catch(done);
});



