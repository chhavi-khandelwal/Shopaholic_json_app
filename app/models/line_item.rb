class LineItem < ActiveRecord::Base
  belongs_to :size
  belongs_to :cart
end
