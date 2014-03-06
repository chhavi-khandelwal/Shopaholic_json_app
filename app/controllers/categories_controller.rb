class CategoriesController < ApplicationController
  before_action :set_category, only: [:show] 

  def show
    @products = @category.products.published
    #FIXME_AB: This should not be done in controller, should be done in view file using jbuilder
    render json: { 
      products: @products.as_json(
        { include: { brand: { only: :name }, 
                      colors: { include: { sizes: { only: [:id, :name, :price, :discounted_price, :quantity] }}, only: [:id, :name, :published]
                      } 
                    }, 
         only: [:id, :title, :description, :category_id, :brand_id]
        }), 
      images: get_product_images(@category),
      size_flag: get_size_flag(@products)
    }
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

  def get_size_flag(products)
    size_hash = {}
    quantity_hash = {}
    products.each do |product|
      product.colors.published.map do |color|
        size_hash[color.id] = {}
        color.sizes.each do |size|
          size_hash[color.id][size.id] = size.quantity
        end
        if size_hash[color.id].select { |key, value| value > 0 }.empty?
          quantity_hash[color.id] = false
        else
          quantity_hash[color.id] = true
        end
      end
    end
    quantity_hash
  end
end
