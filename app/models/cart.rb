class Cart < ActiveRecord::Base
  has_many :line_items, dependent: :destroy
  has_many :sizes, through: :line_items


  def update_cart(line_item, size)
    if(line_item && size.quantity > 0)
      line_item.quantity += 1
      line_item.save
    else
      sizes << size
    end
  end
end
