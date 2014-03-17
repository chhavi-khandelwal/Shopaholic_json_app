#FIXME_AB: I would prefer to name this as Order. 
#Fixed - Ask doubt
class Cart < ActiveRecord::Base
  has_many :line_items, dependent: :destroy
  has_many :sizes, through: :line_items


  def add_item(line_item, product_size)
    #FIXME_AB: variable name size is creating confusion, you can name it as product_size
    #Fixed
    if(line_item && product_size.quantity > 0)
      line_item.quantity += 1
      line_item.save
    else
      sizes << product_size
    end
  end

  def total_price
    line_items.sum { |line_item|  line_item.size.discounted_price * line_item.quantity }
  end
end
