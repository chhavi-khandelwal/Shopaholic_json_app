class Image < ActiveRecord::Base
  belongs_to :imageable, polymorphic: true

  has_attached_file :file, styles: { medium: "200x200", thumb: "150x150", small: '80x80' }, default_url: "default.jpg"
  validates_attachment :file, :presence => true, :content_type => { :content_type => ["image/jpg", "image/jpeg", "image/png"] }, :size => { :in => 0..10000.kilobytes }, on: :create

  def thumbnail(size)
    file.url(size)
  end
end
