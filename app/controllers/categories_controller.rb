class CategoriesController < ApplicationController
  before_action :set_category, only: [:show] 
  def show
    @products = @category.products.published
    render json: { products: @products.as_json(:include => [:brand, {:colors => {:include => [:sizes] }}]), images: get_product_images(@category), filters: render_to_string({ partial: 'categories/filter', layout: false }) }
  end

  private
  def set_category
    @category = Category.find_by(id: params[:id])
    redirect_to root, alert: 'Category not found' if @category.nil?
  end

  def get_product_images(category)
    image_hash = {}
    category.products.published.map do |product|
      product.colors.published.map do |color|
        image_hash[color.id] = color.thumbnail_in_focus(:medium)
      end
    end
    image_hash
  end
end
