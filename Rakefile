require 'rake'
require 'sprockets'

module RakeHelper
  ROOT_DIR      = File.expand_path(File.dirname(__FILE__))
  SRC_DIR       = File.join(ROOT_DIR, 'src')
  DIST_DIR      = File.join(ROOT_DIR, 'dist')
    
  def self.build_js(file_name)
    destination = File.join(DIST_DIR, file_name)
    env = Sprockets::Environment.new
    env.append_path SRC_DIR
    open(destination, "w").write(env[file_name])
  end
end

desc "Build js file."
task :build do
  RakeHelper.build_js('phm.js')
end

begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end
