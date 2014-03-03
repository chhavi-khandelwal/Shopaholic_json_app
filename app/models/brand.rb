class Brand < ActiveRecord::Base
  has_many :categories, through: :products
  include DependencyHelper
  has_many :products, dependent: :restrict_with_exception
  has_one :image, as: :imageable

  validates :name, presence: true, length: { maximum: 255 }
  
  validates :name, format: { with: REGEXP[:name_format], multiline: true, message: "- Only letters allowed" }, uniqueness: { case_sensitive: false }, unless: "name.blank?"

end
