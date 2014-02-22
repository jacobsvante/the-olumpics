# Sass compass config

# gem install rgbapng
require 'rgbapng'
# gem install --pre sass-css-importer
require 'sass-css-importer'


# Set this to the root of your project when deployed:
http_path = '/'
css_dir = 'dist/styles'
sass_dir = 'app/styles'
images_dir = 'app/images'
javascripts_dir = 'app/scripts'
fonts_dir = 'app/fonts'

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed
output_style = :expanded

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false
line_comments = false

# TODO: Find out why this isn't executed. The file is definitely read
#       as an exception will be thrown if I change a require path.
# require 'autoprefixer-rails'
# on_stylesheet_saved do |file|
#   css = File.read(file)
#   File.open(file, 'w') do |io|
#     io << AutoprefixerRails.process(css,
#                                     ["last 2 versions", "Explorer 7"])
#   end
# end
