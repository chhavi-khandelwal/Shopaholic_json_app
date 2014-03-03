class Category < ActiveRecord::Base
  include DependencyHelper
  has_many :brands, through: :products
  has_many :products, dependent: :restrict_with_exception
  validates :name, presence: true, length: { maximum: 255 }
  validates :name, format: { with: REGEXP[:name_format], multiline: true, message: "- Special characters not allowed" }, unless: "name.blank?"
  validates :name, uniqueness: { case_sensitive: false }
end
