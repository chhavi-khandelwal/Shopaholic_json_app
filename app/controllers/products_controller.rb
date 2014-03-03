class ProductsController < ApplicationController
  def show
    @product = Product.find_by(id: params[:id])
    @color = Color.published.find_by(id: params[:color_id])
    render json: { product: render_to_string(template: 'products/show', layout: false) }

  end
end
