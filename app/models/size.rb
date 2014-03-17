class Size < ActiveRecord::Base
  include DependencyHelper
  
  belongs_to :color, touch: true

  has_many :line_items, dependent: :destroy
  #FIXME_AB: instead of carts lets name it orders
  has_many :carts, through: :line_items

  validates :name, :price, :quantity, :discounted_price, :sku, presence: true


  validates :name, length: { maximum: 25 }
  validates :name, format: { with: REGEXP[:name_format], multiline: true, message: "- Special characters not allowed" }, unless: "name.blank?"

  validates :name, uniqueness: { case_sensitive: false, scope: :color_id, message: "Size already exists for this color"  }

  validates :quantity, numericality: { greater_than_or_equal_to: 0 }, unless: "quantity.blank?"

  validates :price, numericality: { greater_than: 0 }, unless: "price.blank?"

  validates :discounted_price, numericality: { greater_than: 0, less_than_or_equal_to: :price }, unless: "discounted_price.blank?"

  validates :sku, uniqueness: true

  def available?
    !quantity.zero?
  end


end