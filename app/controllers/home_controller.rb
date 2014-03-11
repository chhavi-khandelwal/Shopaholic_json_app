#FIXME_AB: Why don't we name it products controller and have just index and published action. But hold on this, lets do it later
class HomeController < ApplicationController

  def index
  end

  #FIXME_AB: just name it products
  def get_products
    @products = Product.published.order(:created_at)
  end
end
