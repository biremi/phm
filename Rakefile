require 'rake'
require 'sprockets'
require 'jasmine'

module RakeHelper
  ROOT_DIR      = File.expand_path(File.dirname(__FILE__))
  SRC_DIR       = File.join(ROOT_DIR, 'src')
  SPEC_DIR      = File.join(ROOT_DIR, 'spec')
  DIST_DIR      = File.join(ROOT_DIR, 'dist')
    
  def self.build_js(file_name)
    destination = File.join(DIST_DIR, file_name)
    env = Sprockets::Environment.new
    env.append_path SRC_DIR
    open(destination, "w").write(env[file_name])
  end

  def self.build_spec_files
    env = Sprockets::Environment.new
    env.append_path SPEC_DIR
    files = File.expand_path("**/*.coffee", SPEC_DIR)
    Dir.glob(files).each do |srcfile|
      srcfile = Pathname.new(srcfile)
      destfile = srcfile.sub("specs", "generated").sub(".coffee", ".js")
      FileUtils.mkdir_p(destfile.dirname)
      File.open(destfile, "w").write(env[srcfile])
    end
  end
end

desc "Build js file."
task :build do
  RakeHelper.build_js('phm.js')
end

desc "Run specs"
task :run_specs do
  RakeHelper.build_js('phm.js')
  RakeHelper.build_spec_files
  Rake::Task['jasmine:ci'].invoke
end

begin
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end
