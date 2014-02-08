module.exports = (grunt) ->
  pkg = grunt.file.readJSON 'package.json'
  grunt.initConfig       
    watch:
      files: ['src/**'],
      tasks: ['copy', 'concat']
    coffee:
      compile:
        options:
          sourceMap: true
        files: [
            expand: true,
            cwd: 'src/coffee/',
            src: ['**/*.coffee'],
            dest: 'src/js/coffee/',
            ext: '.js'
        ]

    uglify:
      compress_target:
        options:
          sourceMap: (fileName) ->
            fileName.replace /\.js$/, '.js.map'
            except: [ 'ShipControls.js' ]
        files: [
            expand: true,
            cwd: 'src/js/',
            src: ['**/*.js']
            #src: ['*.js', 'mobile/*.js'],
            dest: 'build/js/',
            ext: '.js',

        ]
    copy:
      dist:
        files:[
            #src: ['src/css/**', 'src/geometries/**', 'src/images/**', 'src/textures/**', 'src/thumbs/**', 'src/**.html']
            expand: true,
            cwd: 'src/',
            src: [ '**' ],
            dest: 'build/'
        ]
    concat:
      pc:
        files:
            'build/js/pc.concat.js': [
                'build/js/lib/Three_dev.js',
                'build/js/bkcore/ShaderExtras.js'
                'build/js/postprocessing/EffectComposer.js'
                'build/js/postprocessing/RenderPass.js'
                'build/js/postprocessing/BloomPass.js'
                'build/js/postprocessing/ShaderPass.js'
                'build/js/postprocessing/MaskPass.js'
                'build/js/Detector.js'
                'build/js/lib/Stats.js'
                'build/js/lib/dat-gui.js'
                'build/js/bkcore/Timer.js'
                'build/js/bkcore/ImageData.js'
                'build/js/bkcore/Utils.js'
                'build/js/bkcore/Ladder.js'
                'build/js/bkcore/ThreePreloader.js'
                'build/js/bkcore/threejs/RenderManager.js'
                'build/js/bkcore/threejs/Shaders.js'
                'build/js/bkcore/threejs/Particles.js'
                'build/js/bkcore/threejs/Loader.js'
                'build/js/bkcore/hexgl/HUD.js'
                'build/js/bkcore/hexgl/ShipControls.js'
                'build/js/bkcore/hexgl/ShipEffects.js'
                'build/js/bkcore/hexgl/CameraChase.js'
                'build/js/bkcore/hexgl/Gameplay.js'
                'build/js/bkcore/hexgl/tracks/Cityscape.js'
                'build/js/bkcore/hexgl/HexGL.js'
                'build/js/hexgl-main.js'
                'build/js/lib/jquery-2_0_3_min.js'
                ]
            'build/js/mobile.lib.concat.js': [
                 'build/js/lib/jquery-2_0_3_min.js'
                'build/bootstrap-3.0.3/js/bootstrap.min.js'
            ]
            
            'build/js/mobile.concat.js': [
                'build/js/mobile/canvas.js'
                'build/js/mobile/motion.js'
                'build/js/mobile/mobile.js'
            ]

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  
  grunt.registerTask 'default', ['copy', 'concat']
  