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

  def thumbnail_in_focus(size)
    images.first.file.url(size)
  end

  def set_published
    if sizes.exists?
      update_attributes(published: true)
    else
      update_attributes(published: false)
    end
    true
  end
  
end
