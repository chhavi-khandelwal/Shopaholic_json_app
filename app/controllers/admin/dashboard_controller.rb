class Admin::DashboardController < Admin::AdminsController
  def show
    @products = Product.all.limit(5)
    @categories = Category.all.limit(10)
    @recent_products = @products.order(created_at: :desc)
  end
end
