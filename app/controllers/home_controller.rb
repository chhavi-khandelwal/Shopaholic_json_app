#FIXME_AB: Why don't we name it products controller and have just index and published action. But hold on this, lets do it later
class HomeController < ApplicationController

  def index
  end

  #FIXME_AB: just name it products, if you move it to products controller then name it as published
  #Fixed
  def products
    @products = Product.includes(:brand, :category, :colors => [:sizes, :images]).where(colors: {published: true}).published.order(:created_at)
  end
end
