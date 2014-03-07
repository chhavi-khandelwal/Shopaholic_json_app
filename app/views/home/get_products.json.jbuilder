json.(@products) do |json, product|
  json.(product, :id, :title, :description)
  json.brand do |json|
    json.(product.brand, :id, :name)
  end
  json.category do |json|
    json.(product.category, :id, :name)
  end
  json.colors product.colors.published do |json, color|
    json.(color, :id, :name)
    json.sizes color.sizes do |json, size|
      json.(size, :id, :name, :price, :price, :discounted_price, :quantity)
    end
    json.images color.images do |json, image|
      json.small image.thumbnail(:small)
      json.medium image.thumbnail(:medium)
    end
    json.quantity_flag color.quantity_flag
  end

end
