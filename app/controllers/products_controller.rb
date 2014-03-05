class ProductsController < ApplicationController
  def show
    @product = Product.find_by(id: params[:id])
    @color = Color.published.find_by(id: params[:color_id])
    render json: { 
      products: @product.as_json(
        { include: { brand: { only: :name }, 
                      colors: { include: { sizes: { only: [:id, :name, :price, :discounted_price, :quantity] }}, only: [:id, :name, :published]
                      } 
                    }, 
         only: [:id, :title, :description, :category_id, :brand_id]
        }),
      images: get_images(@product),
      current_color: { id: @color.id }
    }

  end

  private
  def get_images(product)
    image_hash = {}
    product.colors.each do |color|
      image_hash[color.id] = {}
      image_hash[color.id][:small] = {}
      image_hash[color.id][:medium] = {}
      color.images.each_with_index do |image, index|
        medium_image_hash = []
        image_hash[color.id][:small][index] = image.thumbnail(:small)
        image_hash[color.id][:medium][index] = image.thumbnail(:medium)
      end
    end
    image_hash
  end
end
