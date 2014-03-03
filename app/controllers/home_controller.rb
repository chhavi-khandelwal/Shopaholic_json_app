class HomeController < ApplicationController

  def index
  end

  def get_products
    render json: { products: get_home_products, colors: get_product_colors, brands: get_product_brands, images: get_product_images }
  end

  private
  def get_home_products
    product_hash = {}
    Color.published.order(:created_at).each do |color|
      product_hash[color.id] = color.product
    end
    product_hash
  end

  def get_product_images
    image_hash = {}
    Color.published.each do |color|
      image_hash[color.id] = color.thumbnail_in_focus(:medium)
    end
    image_hash
  end

  def get_product_brands
    brand_hash = {}
    Color.published.each do |color|
      brand_hash[color.id] = color.product.brand
    end
    brand_hash
  end

  def get_product_colors
    Color.published.as_json(only: [:id, :product_id])
  end
end
