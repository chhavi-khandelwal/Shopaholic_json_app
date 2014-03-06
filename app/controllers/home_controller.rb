class HomeController < ApplicationController

  def index
  end

  def get_products
    render json: { products: get_home_products }
  end

  private
  def get_home_products
    product_hash = {}
    Color.published.order(:created_at).each do |color|
      product_hash[color.id] = color.product.as_json(only: [:id, :title, :description, :brand_id, :category_id])
      product_hash[color.id][:image] = color.thumbnail_in_focus(:medium)
      product_hash[color.id][:brand] = color.product.brand.name
      product_hash[color.id][:size_quantity] = {}
      color.sizes.each do |size|
        product_hash[color.id][:size_quantity][size.id] = size.quantity
        
      end
      quantity_hash = product_hash[color.id][:size_quantity]
      if quantity_hash.select { |key, value| value > 0 }.empty?
        product_hash[color.id][:size_flag] = false
      else
        product_hash[color.id][:size_flag] = true
      end
    end

    product_hash
  end
end
