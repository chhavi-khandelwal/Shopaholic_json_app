class Color < ActiveRecord::Base
  include DependencyHelper
  
  has_many :sizes, dependent: :restrict_with_exception
  has_many :images, as: :imageable, dependent: :destroy
  belongs_to :product, touch: true

  validates :name, presence: true, length: { maximum: 255 }
  validates :name, format: { with: REGEXP[:name_format], multiline: true, message: "- Special characters not allowed" }, unless: "name.blank?"
  validates :name, uniqueness: { case_sensitive: false, scope: :product_id, message: "Color already exists"  }
  
  after_touch :set_published
  accepts_nested_attributes_for :images, update_only: true, allow_destroy: true

  scope :published, -> { where published: true }

  #FIXME_AB: Method name need to be something else, right now by looking on the method name it looks like it should be a helper method. May be you can name it default_thumbnail. Or just thumbnail 
  #Fixed
  def thumbnail(size)
    images.first.file.url(size)
  end

  #FIXME_AB: Similar method exists in product.rb
  def set_published
    if sizes.exists?
      update_attributes(published: true)
    else
      update_attributes(published: false)
    end
    true
  end

  #FIXME_AB: Lets discuss this method, 
  def availability?
    size_hash = {}
    sizes.each do |size|
      size_hash[size.id] = size.quantity
    end
    if size_hash.select { |key, value| value > 0 }.empty?
      quantity_flag = false
    else
      quantity_flag = true
    end
    quantity_flag
  end
  
end
