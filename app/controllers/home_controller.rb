class HomeController < ApplicationController

  def index
  end

  def get_products
    @products = Product.published.order(:created_at)
  end
end
