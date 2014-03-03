class Product < ActiveRecord::Base
  include DependencyHelper
  
  has_many :sizes, through: :colors
  has_many :colors
  belongs_to :category
  belongs_to :brand
  after_touch :set_published

  scope :published, -> { where published: true }
  
  validates :title, presence: true, length: { maximum: 255 }
  validates :title, format: { with: REGEXP[:name_format], multiline: true, message: "- Special characters not allowed" }, unless: "title.blank?"
  validates :title, uniqueness: { case_sensitive: false }
  validates :description, presence: true, length: { maximum: 1000 }

  private
  def set_published
    if colors.published.exists?
      update_attributes(published: true)
    else
      update_attributes(published: false)
    end
    true
  end
end
